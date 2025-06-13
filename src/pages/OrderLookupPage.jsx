import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSpinner, FaHistory } from 'react-icons/fa';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const OrderLookupPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [searchType, setSearchType] = useState('history');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderFound, setOrderFound] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 載入購買歷史
  const loadPurchaseHistory = async () => {
    if (!isLoggedIn) return;
    
    try {
      setHistoryLoading(true);
      const history = await cartAPI.getPurchasedCart();
      setPurchaseHistory(history);
    } catch (error) {
      console.error('Failed to load purchase history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && searchType === 'history') {
      loadPurchaseHistory();
    }
  }, [isLoggedIn, searchType]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 模擬 API 查詢
    setTimeout(() => {
      if (orderNumber === 'TITAN2024001' || email === 'demo@example.com') {
        setOrderFound({
          orderNumber: 'TITAN2024001',
          customerName: '王小明',
          email: 'demo@example.com',
          phone: '0912-345-678',
          tourTitle: '古風．佐原商家町飯店',
          travelDate: '2024-06-15 - 2024-06-20',
          destination: '日本千葉縣',
          totalAmount: 72000,
          status: '已確認',
          paymentStatus: '已付款',
          bookingDate: '2024-03-15',
          adultCount: 2,
          childCount: 0,
          specialRequests: '需要素食餐點',
        });
      } else {
        setOrderFound(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const resetSearch = () => {
    setOrderNumber('');
    setEmail('');
    setPhone('');
    setOrderFound(null);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        訂單查詢
      </motion.h1>

      {/* Search Section */}
      <motion.section 
        className="max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">請輸入您的訂單資訊</h2>
          
          {/* Search Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setSearchType('history')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'history' 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  我的購買紀錄
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchType('order')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'order' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                訂單編號查詢
              </button>
              <button
                type="button"
                onClick={() => setSearchType('email')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'email' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                信箱查詢
              </button>
            </div>
          </div>

          {searchType === 'history' ? (
            // 購買歷史顯示
            <div className="space-y-4">
              {historyLoading ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-amber-600 mr-2" />
                  <span className="text-gray-600">載入購買紀錄中...</span>
                </div>
              ) : purchaseHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FaHistory className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">尚無購買紀錄</p>
                  <button
                    onClick={() => navigate('/all-trips')}
                    className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
                  >
                    開始探索行程
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    購買紀錄 ({purchaseHistory.length} 筆)
                  </h3>
                  {purchaseHistory.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{item.tour_name}</h4>
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">已完成</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>訂單編號: #{item.id}</p>
                        <p>購買金額: NT$ {item.tour_price?.toLocaleString()}</p>
                        <p>購買時間: {new Date(item.purchased_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // 搜尋表單
            <>
              <form onSubmit={handleSearch} className="space-y-4">
                {searchType === 'order' ? (
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      訂單編號
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="請輸入訂單編號 (例：TITAN2024001)"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        電子信箱
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="請輸入預訂時使用的電子信箱"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        聯絡電話 (選填)
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="請輸入聯絡電話"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        查詢中...
                      </>
                    ) : (
                      <>
                        <FaSearch />
                        查詢訂單
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </form>

              {/* Demo Info */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>示範資料：</strong>訂單編號 <code className="bg-amber-100 px-1 rounded">TITAN2024001</code> 或信箱 <code className="bg-amber-100 px-1 rounded">demo@example.com</code>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.section>

      {/* Order Details */}
      {orderFound && (
        <motion.section 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
              <h3 className="text-xl font-semibold mb-2">訂單詳情</h3>
              <p className="text-amber-100">訂單編號：{orderFound.orderNumber}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-amber-500" />
                    客戶資訊
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">姓名：</span>{orderFound.customerName}</p>
                    <p><span className="font-medium">信箱：</span>{orderFound.email}</p>
                    <p><span className="font-medium">電話：</span>{orderFound.phone}</p>
                    <p><span className="font-medium">預訂日期：</span>{orderFound.bookingDate}</p>
                  </div>
                </div>

                {/* Trip Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-amber-500" />
                    行程資訊
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">行程：</span>{orderFound.tourTitle}</p>
                    <p><span className="font-medium">目的地：</span>{orderFound.destination}</p>
                    <p><span className="font-medium">出發日期：</span>{orderFound.travelDate}</p>
                    <p><span className="font-medium">人數：</span>大人 {orderFound.adultCount} 位，小孩 {orderFound.childCount} 位</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-amber-500" />
                    付款資訊
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">總金額：</span>NT$ {orderFound.totalAmount.toLocaleString()}</p>
                    <p>
                      <span className="font-medium">付款狀態：</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        orderFound.paymentStatus === '已付款' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {orderFound.paymentStatus}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">訂單狀態：</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        orderFound.status === '已確認' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orderFound.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">特殊需求</h4>
                  <div className="text-gray-700">
                    <p>{orderFound.specialRequests || '無特殊需求'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                <button className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors">
                  下載行程單
                </button>
                <button 
                  onClick={() => navigate('/customer-service')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  聯絡客服
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  修改訂單
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* No Results Message */}
      {!isLoading && orderFound === null && (orderNumber || email) && (
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">查無訂單</h3>
            <p className="text-red-700 mb-4">
              很抱歉，我們找不到符合您輸入條件的訂單。請檢查您的資訊是否正確，或聯絡我們的客服團隊。
            </p>
            <button 
              onClick={() => navigate('/customer-service')}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              聯絡客服
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderLookupPage; 