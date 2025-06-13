import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, FaTrash, FaCalendarAlt, FaMapMarkerAlt, 
  FaUser, FaCreditCard, FaSpinner, FaArrowLeft, FaExclamationTriangle
} from 'react-icons/fa';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/member-area');
      return;
    }
    
    loadCartItems();
  }, [isLoggedIn, navigate]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await cartAPI.getPendingCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart items:', error);
      setError('載入購物車失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartId) => {
    if (!window.confirm('確定要從購物車中移除此項目嗎？')) {
      return;
    }

    try {
      setRemoving(cartId);
      await cartAPI.removeFromCart(cartId);
      setCartItems(items => items.filter(item => item.id !== cartId));
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('移除項目失敗，請稍後再試');
    } finally {
      setRemoving(null);
    }
  };

  const handleCheckout = (cartId) => {
    navigate(`/checkout/${cartId}`);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.tour_price;
    }, 0);
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-amber-600" />
          <span className="ml-4 text-lg text-gray-600">載入購物車中...</span>
        </div>
      </div>
    );
  }

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
            <FaShoppingCart className="text-3xl text-amber-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-serif">
              購物車
            </h1>
          </div>
          <Link
            to="/all-trips"
            className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            繼續選購
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

        {cartItems.length === 0 ? (
          // 空購物車狀態
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              您的購物車是空的
            </h2>
            <p className="text-gray-500 mb-8">
              還沒有選擇任何旅遊行程，快去探索我們的精彩旅程吧！
            </p>
            <Link
              to="/all-trips"
              className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              開始探索旅程
            </Link>
          </motion.div>
        ) : (
          // 購物車項目列表
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側：購物車項目 */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* 圖片 */}
                      <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
                        <img
                          src={`https://picsum.photos/seed/${item.tour_name}/400/300`}
                          alt={item.tour_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 內容 */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {item.tour_name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              精選旅遊行程，帶您體驗難忘的旅程
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                加入時間: {new Date(item.added_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* 移除按鈕 */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removing === item.id}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                            title="移除此項目"
                          >
                            {removing === item.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>

                        {/* 價格和結帳按鈕 */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div className="text-right">
                            <div className="text-xl font-bold text-amber-600">
                              NT$ {item.tour_price?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              已套用會員價格
                            </div>
                          </div>

                          <button
                            onClick={() => handleCheckout(item.id)}
                            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                          >
                            <FaCreditCard className="mr-2" />
                            立即結帳
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 右側：購物車摘要 */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  購物車摘要
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>項目數量</span>
                    <span>{cartItems.length}</span>
                  </div>
                  
                  {user?.isVip && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>VIP會員優惠</span>
                      <span>已套用</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>總計</span>
                      <span>NT$ {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  * 每個項目需要分別結帳
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaUser className="text-amber-600 mr-2" />
                    <span className="font-medium text-amber-800">會員資訊</span>
                  </div>
                  <div className="text-sm text-amber-700">
                    {user?.name || user?.phone}
                    {user?.isVip && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        VIP會員
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage; 