import os, bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str):
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(user_id: str):
    expire = datetime.now(timezone.utc) + timedelta(hours=2)
    return jwt.encode({"sub": user_id, "exp": expire}, JWT_SECRET, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        return None
