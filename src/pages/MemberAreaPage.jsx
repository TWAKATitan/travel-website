import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaHistory, FaHeart, 
  FaCog, FaSignOutAlt, FaStar, FaCalendarAlt, FaMapMarkerAlt,
  FaEye, FaEyeSlash, FaEdit, FaGift, FaUserPlus, FaShoppingCart
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { cartAPI } from '../services/api';

const MemberAreaPage = () => {
  const { isLoggedIn, user, login, register, logout } = useAuth();
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 模擬收藏清單數據
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: '日本心旅行．經典路線',
      description: '東京、京都、大阪深度遊',
      price: 98000,
      image: 'https://picsum.photos/seed/japan-classic/400/300'
    },
    {
      id: 2,
      title: '峇里島奢華度假',
      description: '私人別墅．無邊際泳池',
      price: 75000,
      image: 'https://picsum.photos/seed/bali-luxury/400/300'
    }
  ]);

  // 模擬會員數據
  const memberData = {
    points: user?.isVip ? 2580 : 1200,
    totalSpent: 228000,
    totalRewards: 11400
  };

  // 載入購買歷史
  useEffect(() => {
    if (isLoggedIn) {
      loadPurchaseHistory();
    }
  }, [isLoggedIn]);

  const loadPurchaseHistory = async () => {
    try {
      const purchased = await cartAPI.getPurchasedCart();
      setPurchaseHistory(purchased);
    } catch (error) {
      console.error('Failed to load purchase history:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(loginForm.phone, loginForm.password);
      setLoginForm({ phone: '', password: '' });
    } catch (error) {
      setError(error.message || '登入失敗，請檢查您的手機號碼和密碼');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('密碼確認不符，請重新輸入');
      setIsRegistering(false);
      return;
    }

    try {
      await register(registerForm.phone, registerForm.password);
      alert('註冊成功！請登入您的帳號');
      setShowRegister(false);
      setRegisterForm({ phone: '', password: '', confirmPassword: '' });
    } catch (error) {
      setError(error.message || '註冊失敗，請稍後再試');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginForm({ phone: '', password: '' });
    setActiveTab('profile');
  };

  const handleRemoveFavorite = (itemId) => {
    if (window.confirm('確定要移除此收藏項目嗎？')) {
      setFavorites(favorites.filter(item => item.id !== itemId));
    }
  };

  const handleRedeemPoints = (requiredPoints, rewardName) => {
    if (memberData.points < requiredPoints) {
      alert(`點數不足！您目前有 ${memberData.points} 點，需要 ${requiredPoints} 點才能兌換 ${rewardName}`);
      return;
    }
    
    if (window.confirm(`確定要使用 ${requiredPoints} 點兌換 ${rewardName} 嗎？`)) {
      alert(`兌換成功！${rewardName} 已發送至您的帳戶`);
      // 這裡可以調用 API 來實際扣除點數
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          會員專區
        </motion.h1>

        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className={`px-4 py-2 mr-2 rounded-l-lg transition-colors ${
                  !showRegister 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                會員登入
              </button>
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className={`px-4 py-2 rounded-r-lg transition-colors ${
                  showRegister 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                註冊會員
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {!showRegister ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    手機號碼
                </label>
                <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                      type="tel"
                      id="phone"
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="請輸入您的手機號碼"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  密碼
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="請輸入您的密碼"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    登入中...
                  </>
                ) : (
                  '登入'
                )}
              </button>
            </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="registerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    手機號碼
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      id="registerPhone"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="請輸入您的手機號碼"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    密碼
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="registerPassword"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="請輸入您的密碼"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
            </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    確認密碼
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="請再次輸入密碼"
                      required
                    />
                  </div>
            </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-amber-600 text-white py-3 px-6 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      註冊中...
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      註冊會員
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        會員專區
      </motion.h1>

      <div className="max-w-6xl mx-auto">
        {/* Member Info Header */}
        <motion.div 
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.name || user?.phone || '會員'}
                </h2>
                <p className="text-amber-100">
                  {user?.isVip ? 'VIP會員' : '一般會員'}
                </p>
                {user?.joinDate && (
                  <p className="text-amber-100 text-sm">加入日期：{user.joinDate}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors flex items-center gap-2"
              >
                <FaShoppingCart className="text-xl" />
                <div>
                  <p className="text-sm">購物車</p>
                  <p className="text-xs text-amber-100">查看購物車</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-colors flex items-center gap-2"
              >
                <FaSignOutAlt className="text-xl" />
                <div>
                  <p className="text-sm">登出</p>
                  <p className="text-xs text-amber-100">安全登出</p>
              </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'profile', name: '個人資料', icon: FaUser },
                { id: 'orders', name: '訂單歷史', icon: FaHistory },
                { id: 'favorites', name: '收藏清單', icon: FaHeart },
                { id: 'rewards', name: '紅利回饋', icon: FaGift },
                { id: 'settings', name: '帳戶設定', icon: FaCog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">個人資料</h3>
                  <button className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                    <FaEdit />
                    編輯資料
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user?.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaUser className="text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    </div>
                  )}
                  {user?.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">電子信箱</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaEnvelope className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">聯絡電話</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaPhone className="text-gray-400" />
                      <span>{user?.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">會員等級</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaStar className={user?.isVip ? "text-yellow-500" : "text-gray-400"} />
                      <span>{user?.isVip ? 'VIP會員' : '一般會員'}</span>
                    </div>
                  </div>
                  {user?.joinDate && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">加入日期</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{user.joinDate}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {user?.isVip && (
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <FaStar className="text-amber-600 mr-2" />
                      <h4 className="font-medium text-amber-800">VIP會員特權</h4>
                    </div>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                        享有所有行程優惠價格
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                        優先預訂熱門行程
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                        專屬客服支援
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
                        免費行程客製化諮詢
                      </li>
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">訂單歷史</h3>
                <div className="space-y-4">
                  {purchaseHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <FaHistory className="text-4xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">尚無購買記錄</p>
                      <p className="text-sm text-gray-400 mb-6">開始您的第一次旅程吧！</p>
                      <Link
                        to="/all-trips"
                        className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        立即探索行程
                      </Link>
                    </div>
                  ) : (
                    purchaseHistory.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img 
                            src={order.image || 'https://picsum.photos/seed/default/400/300'} 
                          alt={order.title}
                          className="w-full md:w-32 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{order.title}</h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                已購買
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt />
                                {order.startDate} - {order.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt />
                                {order.country}
                            </span>
                            </div>
                            {order.purchaseDate && (
                              <div className="text-xs text-gray-500 mb-2">
                                購買日期：{new Date(order.purchaseDate).toLocaleDateString()}
                          </div>
                            )}
                          <div className="flex justify-between items-center">
                              <div>
                                {user?.isVip && order.regularPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    NT$ {order.regularPrice.toLocaleString()}
                                  </div>
                                )}
                            <span className="text-lg font-semibold text-amber-600">
                                  NT$ {(user?.isVip ? order.memberPrice : order.regularPrice)?.toLocaleString()}
                            </span>
                                {user?.isVip && (
                                  <div className="text-xs text-green-600">VIP優惠價</div>
                                )}
                              </div>
                            <div className="flex gap-2">
                                <Link
                                  to={`/spot/${order.id}`}
                                  className="text-amber-600 hover:text-amber-700 text-sm"
                                >
                                查看詳情
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">收藏清單</h3>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">尚無收藏項目</h4>
                    <p className="text-gray-500 mb-6">快去探索我們的精彩旅程，加入您的收藏清單吧！</p>
                    <Link
                      to="/all-trips"
                      className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      開始探索
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-amber-600">
                            NT$ {item.price.toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleRemoveFavorite(item.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="移除收藏"
                            >
                              <FaHeart />
                            </button>
                            <Link
                              to={`/spot/${item.id}`}
                              className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 transition-colors"
                            >
                              查看詳情
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">紅利回饋</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <FaGift className="text-3xl mb-4" />
                    <h4 className="text-lg font-semibold mb-2">可用點數</h4>
                    <p className="text-2xl font-bold">{memberData.points}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                    <FaStar className="text-3xl mb-4" />
                    <h4 className="text-lg font-semibold mb-2">本年消費</h4>
                    <p className="text-2xl font-bold">NT$ {memberData.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <FaHeart className="text-3xl mb-4" />
                    <h4 className="text-lg font-semibold mb-2">累積回饋</h4>
                    <p className="text-2xl font-bold">{memberData.totalRewards.toLocaleString()} 點</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">點數兌換</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">旅遊折抵券 $500</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 500 點</p>
                      <button 
                        onClick={() => handleRedeemPoints(500, '旅遊折抵券 $500')}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          memberData.points >= 500 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={memberData.points < 500}
                      >
                        {memberData.points >= 500 ? '立即兌換' : '點數不足'}
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">旅遊折抵券 $1000</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 1000 點</p>
                      <button 
                        onClick={() => handleRedeemPoints(1000, '旅遊折抵券 $1000')}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          memberData.points >= 1000 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={memberData.points < 1000}
                      >
                        {memberData.points >= 1000 ? '立即兌換' : '點數不足'}
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">旅遊折抵券 $2000</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 2000 點</p>
                      <button 
                        onClick={() => handleRedeemPoints(2000, '旅遊折抵券 $2000')}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          memberData.points >= 2000 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={memberData.points < 2000}
                      >
                        {memberData.points >= 2000 ? '立即兌換' : '點數不足'}
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">VIP升級券</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 3000 點</p>
                      <button 
                        onClick={() => handleRedeemPoints(3000, 'VIP升級券')}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          memberData.points >= 3000 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={memberData.points < 3000}
                      >
                        {memberData.points >= 3000 ? '立即兌換' : '點數不足'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 點數歷史記錄 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">點數歷史記錄</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">購買旅遊行程</p>
                        <p className="text-sm text-gray-500">2024/01/15</p>
                      </div>
                      <span className="text-green-600 font-medium">+120 點</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">兌換旅遊折抵券</p>
                        <p className="text-sm text-gray-500">2024/01/10</p>
                      </div>
                      <span className="text-red-600 font-medium">-500 點</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">會員註冊獎勵</p>
                        <p className="text-sm text-gray-500">2024/01/01</p>
                      </div>
                      <span className="text-green-600 font-medium">+100 點</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium text-gray-800">生日禮金</p>
                        <p className="text-sm text-gray-500">2023/12/25</p>
                      </div>
                      <span className="text-green-600 font-medium">+200 點</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">帳戶設定</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">修改密碼</h4>
                    <p className="text-gray-600 text-sm mb-3">定期更新密碼以保護您的帳戶安全</p>
                    <button className="bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700">
                      修改密碼
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">通知設定</h4>
                    <p className="text-gray-600 text-sm mb-3">管理您接收的通知類型</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">促銷活動通知</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">訂單狀態更新</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">旅遊資訊電子報</span>
                      </label>
                    </div>
                  </div>
                  <div className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2 text-red-600">刪除帳戶</h4>
                    <p className="text-gray-600 text-sm mb-3">此操作將永久刪除您的帳戶和所有相關資料</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                      刪除帳戶
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <FaSignOutAlt />
            登出
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberAreaPage; 