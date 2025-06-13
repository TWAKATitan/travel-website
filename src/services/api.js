// API base URL now comes from environment variable ONLY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set in your .env file!');
}

// 獲取JWT token
const getToken = () => {
  return localStorage.getItem('token');
};

// 設置JWT token
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// 移除JWT token
const removeToken = () => {
  localStorage.removeItem('token');
};

// 基本fetch包裝函數
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// 認證相關API
export const authAPI = {
  // 註冊帳號
  register: async (phone, password) => {
    return apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },

// 修改 authAPI.login
login: async (phone, password) => {
  const response = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });

  // 後端回的是 access_token
  if (response.access_token) {
    setToken(response.access_token);
  }

  return response;
},

// 登出
logout: () => {
  removeToken();
},

// 取得目前使用者資料
getMe: async () => {
  return apiRequest('/me');
},
};

// 購物車相關API
// ======== cartAPI.addToCart 需改為： ========
export const cartAPI = {
  // 加入旅遊團到購物車
  // 只傳 tour_name 與 tour_price，名字要跟後端 Pydantic Model 一致
  addToCart: async (tourData) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({
        tour_name: tourData.name,   // 前端的 spot.name
        tour_price: tourData.price, // 前端的 spot.price (number)
      }),
    });
  },

  // 其餘函式不動…
  getPendingCart: async () => {
    return apiRequest('/cart?status=pending');
  },
  getPurchasedCart: async () => {
    return apiRequest('/cart?status=purchased');
  },
  removeFromCart: async (cartId) => {
    return apiRequest(`/cart/${cartId}`, { method: 'DELETE' });
  },
  checkout: async (cartId) => {
    return apiRequest(`/checkout/${cartId}`, { method: 'POST' });
  },
};


// 檢查是否已登入
export const isAuthenticated = () => {
  return !!getToken();
};

// 工具函數
export { getToken, setToken, removeToken }; 