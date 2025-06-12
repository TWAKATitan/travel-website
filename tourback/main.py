from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from datetime import datetime
import pytz
from database import get_db
from auth import *
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
bearer = HTTPBearer()

# === 時間處理函數 ===
def now_taiwan_time():
    taiwan_tz = pytz.timezone('Asia/Taipei')
    return datetime.now(taiwan_tz)

# === 請求資料格式 ===
class UserBase(BaseModel):
    phone: str
    password: str

class CartItem(BaseModel):
    tour_name: str
    tour_price: float

# === 驗證 token ===
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(bearer)):
    user_id = decode_access_token(token.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id

# === 註冊 ===
@app.post("/register")
async def register(user: UserBase, db: AsyncSession = Depends(get_db)):
    # 先檢查電話是否已存在
    q = await db.execute(text("SELECT 1 FROM users WHERE phone = :p"), {"p": user.phone})
    if q.scalar():
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # 若無重複則進行註冊
    hashed = hash_password(user.password)
    await db.execute(
        text("INSERT INTO users (phone, password_hash) VALUES (:p, :h)"),
        {"p": user.phone, "h": hashed},
    )
    await db.commit()
    return {"msg": "User registered"}

# === 登入 ===
@app.post("/login")
async def login(user: UserBase, db: AsyncSession = Depends(get_db)):
    q = await db.execute(text("SELECT * FROM users WHERE phone = :p"), {"p": user.phone})
    row = q.fetchone()
    if not row or not verify_password(user.password, row.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(row.id))
    return {"access_token": token}

# === 加入購物車 ===
@app.post("/cart")
async def add_to_cart(item: CartItem, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(
        text("""INSERT INTO user_cart (user_id, tour_name, tour_price, purchased) 
                VALUES (:uid, :name, :price, false)"""),
        {"uid": user_id, "name": item.tour_name, "price": item.tour_price}
    )
    await db.commit()
    return {"msg": "Added to cart"}

# === 取消加入購物車 ===
@app.delete("/cart/{cart_id}")
async def cancel_cart_item(cart_id: str, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        text("""
            DELETE FROM user_cart 
            WHERE id = :cid AND user_id = :uid AND purchased = false
            RETURNING id
        """),
        {"cid": cart_id, "uid": user_id}
    )
    deleted = result.fetchone()

    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found or already purchased")

    await db.commit()
    return {"msg": "Item removed from cart"}


# === 查詢購物車或歷史紀錄 ===
@app.get("/cart")
async def view_cart(status: str = "pending", user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    purchased = True if status == "purchased" else False
    q = await db.execute(
        text("SELECT * FROM user_cart WHERE user_id = :uid AND purchased = :p"),
        {"uid": user_id, "p": purchased}
    )
    
    # 將結果轉換並處理時間格式
    results = []
    for row in q.fetchall():
        item = dict(row._mapping)
        
        # 處理 purchased_at 欄位（timestamptz 類型）
        if item.get('purchased_at'):
            purchased_time = item['purchased_at']
            if hasattr(purchased_time, 'isoformat'):
                item['purchased_at'] = purchased_time.isoformat()
            else:
                item['purchased_at'] = str(purchased_time)
        
        # 處理 added_at 欄位（timestamptz 類型）
        if item.get('added_at'):
            added_time = item['added_at']
            if hasattr(added_time, 'isoformat'):
                item['added_at'] = added_time.isoformat()
            else:
                item['added_at'] = str(added_time)
                
        results.append(item)
    
    return results

# === 結帳：將購物車設為 purchased ===
@app.post("/checkout/{cart_id}")
async def checkout_one(cart_id: str, user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    taiwan_time = now_taiwan_time()

    result = await db.execute(
        text("""
            UPDATE user_cart 
            SET purchased = true, purchased_at = :ts 
            WHERE id = :cid AND user_id = :uid AND purchased = false
            RETURNING id
        """),
        {"cid": cart_id, "uid": user_id, "ts": taiwan_time}
    )
    updated = result.fetchone()

    if not updated:
        raise HTTPException(status_code=404, detail="Item not found or already purchased")

    await db.commit()
    return {
        "msg": "Item checkout success",
        "purchased_at": taiwan_time.isoformat()
    }

@app.get("/me")
async def get_user_info(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = await db.execute(
        text("SELECT id, phone, vip, created_at FROM users WHERE id = :uid"),
        {"uid": user_id}
    )
    row = q.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = dict(row._mapping)
    # 處理 created_at（若是 timestamptz）
    if user.get("created_at") and hasattr(user["created_at"], "isoformat"):
        user["created_at"] = user["created_at"].isoformat()

    return user

handler = Mangum(app)