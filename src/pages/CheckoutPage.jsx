import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaCreditCard, FaCalendarAlt, FaMapMarkerAlt, FaUser, 
  FaPhone, FaEnvelope, FaSpinner, FaCheckCircle, FaArrowLeft,
  FaExclamationTriangle, FaShieldAlt
} from 'react-icons/fa';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage = () => {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/member-area');
      return;
    }
    
    if (!cartId) {
      navigate('/cart');
      return;
    }

    loadCartItem();
  }, [isLoggedIn, cartId, navigate]);

  // 預填用戶資料
  useEffect(() => {
    if (user) {
      setContactInfo(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const loadCartItem = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.getPendingCart();
      const item = items.find(item => item.id.toString() === cartId);
      
      if (!item) {
        setError('找不到此購物車項目，可能已被移除或已結帳');
        return;
      }
      
      setCartItem(item);
    } catch (error) {
      console.error('Failed to load cart item:', error);
      setError('載入訂單資訊失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!cartItem) return;

    // 基本驗證
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      setError('請填寫完整的聯絡資訊');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      
      await cartAPI.checkout(cartId);
      setSuccess(true);
      
      // 3秒後導向訂單查詢頁面
      setTimeout(() => {
        navigate('/order-lookup');
      }, 3000);
      
    } catch (error) {
      console.error('Checkout failed:', error);
      setError('結帳失敗，請稍後再試或聯絡客服');
    } finally {
      setProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-amber-600" />
          <span className="ml-4 text-lg text-gray-600">載入訂單資訊中...</span>
        </div>
      </div>
    );
  }

  if (error && !cartItem) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            訂單載入失敗
          </h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link
            to="/cart"
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            返回購物車
          </Link>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            訂購成功！
          </h2>
          <p className="text-gray-600 mb-4">
            您的訂單已成功送出，我們將盡快與您聯絡確認行程細節。
          </p>
          <p className="text-sm text-gray-500 mb-8">
            正在為您導向訂單查詢頁面...
          </p>
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-2xl text-amber-600 mr-2" />
            <span className="text-amber-600">處理中...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const finalPrice = cartItem?.tour_price;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FaCreditCard className="text-3xl text-amber-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">
              確認訂購
            </h1>
          </div>
          <Link
            to="/cart"
            className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            返回購物車
          </Link>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <FaExclamationTriangle className="mr-2" />
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：訂單詳情 */}
          <div className="lg:col-span-2">
            {/* 行程資訊 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                行程資訊
              </h3>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-48 h-32 flex-shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${cartItem?.tour_name}/400/300`}
                    alt={cartItem?.tour_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {cartItem?.tour_name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    精選旅遊行程，帶您體驗難忘的旅程
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      加入時間: {new Date(cartItem?.added_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 聯絡資訊表單 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                聯絡資訊
              </h3>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactInfo.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="請輸入您的姓名"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      電話 *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="請輸入您的電話號碼"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      電子信箱 *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactInfo.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="請輸入您的電子信箱"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                      緊急聯絡人
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={contactInfo.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="緊急聯絡人姓名"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      緊急聯絡電話
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={contactInfo.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="緊急聯絡電話"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                      特殊需求
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={contactInfo.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="如有特殊飲食需求、身體狀況或其他需要注意的事項，請在此說明"
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* 右側：訂單摘要 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                訂單摘要
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>行程名稱</span>
                  <span className="text-right text-sm">
                    {cartItem?.title}
                  </span>
                </div>
                
                {user?.isVip && cartItem?.regularPrice && (
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>原價</span>
                    <span className="line-through">
                      NT$ {cartItem.regularPrice.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {user?.isVip && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>VIP優惠</span>
                    <span>已套用</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-semibold text-gray-800">
                    <span>總計</span>
                    <span className="text-amber-600">
                      NT$ {finalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                onClick={handleCheckout}
                disabled={processing || !cartItem}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    處理中...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    確認訂購
                  </>
                )}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaShieldAlt className="text-amber-600 mr-2" />
                  <span className="font-medium text-amber-800">安全保障</span>
                </div>
                <div className="text-sm text-amber-700">
                  <p>• 專業旅遊保險保障</p>
                  <p>• 24小時客服支援</p>
                  <p>• 退款保證政策</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage; 