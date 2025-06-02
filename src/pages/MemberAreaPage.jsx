import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaHistory, FaHeart, 
  FaCog, FaSignOutAlt, FaStar, FaCalendarAlt, FaMapMarkerAlt,
  FaEye, FaEyeSlash, FaEdit, FaGift
} from 'react-icons/fa';

const MemberAreaPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // 模擬會員資料
  const memberData = {
    name: '王小明',
    email: 'demo@example.com',
    phone: '0912-345-678',
    memberLevel: '黃金會員',
    joinDate: '2023-01-15',
    points: 2450,
    nextLevelPoints: 5000,
  };

  // 模擬訂單歷史
  const orderHistory = [
    {
      id: 'TITAN2024001',
      title: '古風．佐原商家町飯店',
      date: '2024-06-15 - 2024-06-20',
      amount: 72000,
      status: '已完成',
      image: 'https://picsum.photos/seed/sahara/300/200',
    },
    {
      id: 'TITAN2023087',
      title: '峇里島．靜謐心靈之旅',
      date: '2023-12-10 - 2023-12-15',
      amount: 91000,
      status: '已完成',
      image: 'https://picsum.photos/seed/bali-retreat/300/200',
    },
    {
      id: 'TITAN2023045',
      title: '杭州．西湖雅集',
      date: '2023-09-05 - 2023-09-10',
      amount: 65000,
      status: '已完成',
      image: 'https://picsum.photos/seed/hangzhou-culture/300/200',
    },
  ];

  // 模擬收藏清單
  const favorites = [
    {
      id: 2,
      title: '直島旅館．ろ霞',
      description: '簡約美學．日式靜謐藝術の美',
      image: 'https://picsum.photos/seed/naoshima/300/200',
      price: 85000,
    },
    {
      id: 4,
      title: '米其林星鑰．安縵伊沐',
      description: '極致美學．海天一色四季の美',
      image: 'https://picsum.photos/seed/izu/300/200',
      price: 145000,
    },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模擬登入
    setTimeout(() => {
      if (loginForm.email === 'demo@example.com' && loginForm.password === 'password') {
        setIsLoggedIn(true);
      } else {
        alert('登入失敗，請檢查您的帳號密碼');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
    setActiveTab('profile');
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
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">會員登入</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  電子信箱
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="請輸入您的電子信箱"
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

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>還不是會員？ <button className="text-amber-600 hover:underline">立即註冊</button></p>
              <p className="mt-2"><button className="text-amber-600 hover:underline">忘記密碼？</button></p>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>示範帳號：</strong><br />
                信箱：<code className="bg-amber-100 px-1 rounded">demo@example.com</code><br />
                密碼：<code className="bg-amber-100 px-1 rounded">password</code>
              </p>
            </div>
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
                <h2 className="text-xl font-semibold">{memberData.name}</h2>
                <p className="text-amber-100">{memberData.memberLevel}</p>
                <p className="text-amber-100 text-sm">加入日期：{memberData.joinDate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-lg font-semibold">{memberData.points} 點</p>
                <p className="text-amber-100 text-sm">累積紅利點數</p>
                <div className="mt-2 bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(memberData.points / memberData.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
                <p className="text-amber-100 text-xs mt-1">
                  距離下一等級還需 {memberData.nextLevelPoints - memberData.points} 點
                </p>
              </div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaUser className="text-gray-400" />
                      <span>{memberData.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">電子信箱</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaEnvelope className="text-gray-400" />
                      <span>{memberData.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">聯絡電話</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaPhone className="text-gray-400" />
                      <span>{memberData.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">會員等級</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                      <FaStar className="text-yellow-500" />
                      <span>{memberData.memberLevel}</span>
                    </div>
                  </div>
                </div>
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
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img 
                          src={order.image} 
                          alt={order.title}
                          className="w-full md:w-32 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{order.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === '已完成' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt />
                              {order.date}
                            </span>
                            <span>訂單編號：{order.id}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-amber-600">
                              NT$ {order.amount.toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                              <button className="text-amber-600 hover:text-amber-700 text-sm">
                                查看詳情
                              </button>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                再次預訂
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                            <button className="text-red-600 hover:text-red-700">
                              <FaHeart />
                            </button>
                            <button className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700">
                              查看詳情
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <p className="text-2xl font-bold">228,000</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <FaHeart className="text-3xl mb-4" />
                    <h4 className="text-lg font-semibold mb-2">累積回饋</h4>
                    <p className="text-2xl font-bold">11,400</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">點數兌換</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">旅遊折抵券 $500</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 500 點</p>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700">
                        立即兌換
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium mb-2">旅遊折抵券 $1000</h5>
                      <p className="text-gray-600 text-sm mb-3">需要 1000 點</p>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded text-sm hover:bg-amber-700">
                        立即兌換
                      </button>
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