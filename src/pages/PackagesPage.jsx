import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cartAPI } from '../services/api';
import { 
  FaStar, FaCalendarAlt, FaUsers, FaMapMarkerAlt, 
  FaPlane, FaHotel, FaCar, FaUtensils, FaCamera,
  FaGift, FaCrown, FaHeart, FaCheck
} from 'react-icons/fa';

const PackagesPage = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');

  // 方案資料
  const packages = [
    {
      id: 1,
      title: '日本心旅行．經典路線',
      subtitle: '東京、京都、大阪深度遊',
      category: 'japan',
      type: 'premium',
      duration: 7,
      groupSize: '16人小團',
      price: 98000,
      originalPrice: 128000,
      rating: 4.9,
      reviews: 156,
      image: 'https://picsum.photos/seed/japan-classic/400/300',
      highlights: ['米其林餐廳體驗', '私人茶道課程', '溫泉會席料理', '專業攝影師隨行'],
      included: ['往返機票', '精選住宿', '全程用餐', '專業導遊', '旅遊保險'],
      dates: ['2024-04-15', '2024-05-01', '2024-06-10'],
      popular: true,
      featured: true,
    },
    {
      id: 2,
      title: '峇里島奢華度假',
      subtitle: '私人別墅．無邊際泳池',
      category: 'southeast-asia',
      type: 'luxury',
      duration: 5,
      groupSize: '自由行',
      price: 75000,
      originalPrice: 95000,
      rating: 4.8,
      reviews: 89,
      image: 'https://picsum.photos/seed/bali-luxury/400/300',
      highlights: ['私人別墅住宿', '專屬管家服務', '私人海灘', 'SPA療程'],
      included: ['往返機票', '別墅住宿', '管家服務', '機場接送', '旅遊保險'],
      dates: ['2024-04-20', '2024-05-15', '2024-06-05'],
      popular: false,
      featured: true,
    },
    {
      id: 3,
      title: '中國文化深度遊',
      subtitle: '蘇杭雅緻．古韻今風',
      category: 'china',
      type: 'cultural',
      duration: 6,
      groupSize: '20人團',
      price: 45000,
      originalPrice: 58000,
      rating: 4.7,
      reviews: 124,
      image: 'https://picsum.photos/seed/china-culture/400/300',
      highlights: ['園林建築導覽', '書法體驗課', '傳統戲曲欣賞', '茶文化體驗'],
      included: ['往返機票', '星級酒店', '文化導覽', '特色餐食', '旅遊保險'],
      dates: ['2024-04-25', '2024-05-20', '2024-06-15'],
      popular: true,
      featured: false,
    },
    {
      id: 4,
      title: '台灣環島慢旅',
      subtitle: '在地文化．山海之美',
      category: 'taiwan',
      type: 'eco',
      duration: 8,
      groupSize: '12人小團',
      price: 32000,
      originalPrice: 42000,
      rating: 4.6,
      reviews: 98,
      image: 'https://picsum.photos/seed/taiwan-round/400/300',
      highlights: ['原住民文化體驗', '有機農場參訪', '夜市美食導覽', '生態導覽'],
      included: ['環島交通', '民宿住宿', '在地餐食', '文化體驗', '旅遊保險'],
      dates: ['2024-05-01', '2024-05-25', '2024-06-20'],
      popular: false,
      featured: false,
    },
    {
      id: 5,
      title: '歐洲古堡之旅',
      subtitle: '德法瑞浪漫經典',
      category: 'europe',
      type: 'premium',
      duration: 12,
      groupSize: '25人團',
      price: 168000,
      originalPrice: 198000,
      rating: 4.9,
      reviews: 87,
      image: 'https://picsum.photos/seed/europe-castle/400/300',
      highlights: ['新天鵝堡參觀', '萊茵河遊船', '少女峰纜車', '酒莊品酒'],
      included: ['往返機票', '四星酒店', '歐洲火車', '城堡門票', '旅遊保險'],
      dates: ['2024-05-10', '2024-06-01', '2024-07-15'],
      popular: true,
      featured: true,
    },
    {
      id: 6,
      title: '北歐極光奇幻之旅',
      subtitle: '芬蘭冰島．極地體驗',
      category: 'europe',
      type: 'adventure',
      duration: 10,
      groupSize: '18人團',
      price: 145000,
      originalPrice: 175000,
      rating: 4.8,
      reviews: 67,
      image: 'https://picsum.photos/seed/nordic-aurora/400/300',
      highlights: ['極光觀測', '玻璃屋住宿', '哈士奇雪橇', '冰川健行'],
      included: ['往返機票', '特色住宿', '極地活動', '保暖裝備', '旅遊保險'],
      dates: ['2024-12-01', '2024-12-15', '2025-01-10'],
      popular: false,
      featured: true,
    },
  ];

  const categories = [
    { id: 'all', name: '全部方案', icon: FaStar },
    { id: 'japan', name: '日本心旅行', icon: FaPlane },
    { id: 'southeast-asia', name: '海島東南亞', icon: FaHotel },
    { id: 'china', name: '中國雅學賞', icon: FaCamera },
    { id: 'taiwan', name: '台灣心慢遊', icon: FaHeart },
    { id: 'europe', name: '歐洲經典', icon: FaCrown },
  ];

  const typeColors = {
    premium: 'bg-gradient-to-r from-amber-500 to-orange-500',
    luxury: 'bg-gradient-to-r from-purple-500 to-pink-500',
    cultural: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    eco: 'bg-gradient-to-r from-green-500 to-teal-500',
    adventure: 'bg-gradient-to-r from-red-500 to-orange-500',
  };

  const [filteredPackages, setFilteredPackages] = useState(packages);

  const handleAddToCart = async (pkg) => {
    if (!user) {
      alert('請先登入會員才能加入購物車');
      return;
    }

    try {
      await cartAPI.addToCart({
        name: pkg.title,
        price: pkg.price
      });
      alert('已成功加入購物車！');
    } catch (error) {
      console.error('加入購物車失敗:', error);
      alert('加入購物車失敗，請稍後再試');
    }
  };

  useEffect(() => {
    let filtered = packages;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === selectedCategory);
    }

    switch (selectedSort) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered = [...filtered].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    setFilteredPackages(filtered);
  }, [selectedCategory, selectedSort]);

  // 動畫組件
  const AnimatedPackageCard = ({ package: pkg, index }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      }
    }, [controls, isInView]);

    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.6, 
          ease: "easeOut",
          delay: index * 0.1 
        } 
      },
    };

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={controls}
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative">
          <img 
            src={pkg.image} 
            alt={pkg.title}
            className="w-full h-48 object-cover"
          />
          {pkg.featured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              精選推薦
            </div>
          )}
          {pkg.popular && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              熱門
            </div>
          )}
          <div className={`absolute bottom-3 left-3 text-white px-3 py-1 rounded-full text-xs font-medium ${typeColors[pkg.type]}`}>
            {pkg.type === 'premium' && '精品'}
            {pkg.type === 'luxury' && '奢華'}
            {pkg.type === 'cultural' && '文化'}
            {pkg.type === 'eco' && '生態'}
            {pkg.type === 'adventure' && '探險'}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{pkg.title}</h3>
              <p className="text-gray-600 text-sm">{pkg.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <FaStar className="text-sm" />
              <span className="text-sm font-medium">{pkg.rating}</span>
              <span className="text-xs text-gray-500">({pkg.reviews})</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {pkg.duration}天
            </span>
            <span className="flex items-center gap-1">
              <FaUsers />
              {pkg.groupSize}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">行程亮點</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {highlight}
                </span>
              ))}
              {pkg.highlights.length > 3 && (
                <span className="text-gray-500 text-xs">+{pkg.highlights.length - 3}項</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">包含項目</h4>
            <div className="grid grid-cols-2 gap-1">
              {pkg.included.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                  <FaCheck className="text-green-500 text-xs" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                {pkg.originalPrice > pkg.price && (
                  <span className="text-sm text-gray-500 line-through">
                    NT$ {pkg.originalPrice.toLocaleString()}
                  </span>
                )}
                <div className="text-xl font-bold text-amber-600">
                  NT$ {pkg.price.toLocaleString()}
                </div>
                <span className="text-xs text-gray-500">起/每人</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">近期出團</div>
                <div className="text-sm font-medium text-gray-700">
                  {new Date(pkg.dates[0]).toLocaleDateString('zh-TW')}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleAddToCart(pkg)}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                立即預訂
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <FaHeart />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        方案賞析
      </motion.h1>

      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">精選旅遊方案</h2>
          <p className="text-amber-100 mb-6">
            探索世界各地的精彩旅程，從奢華度假到文化深度遊，我們為您量身打造難忘的旅行體驗
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FaGift className="text-amber-200" />
              <span>專屬優惠價格</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-amber-200" />
              <span>精選優質住宿</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-amber-200" />
              <span>專業導遊服務</span>
            </div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-amber-200" />
              <span>貼心客製化服務</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">選擇主題</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">排序方式</h3>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="popular">熱門推薦</option>
                <option value="price-low">價格：低到高</option>
                <option value="price-high">價格：高到低</option>
                <option value="rating">評分最高</option>
              </select>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Results Summary */}
      <motion.div 
        className="mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-gray-600">
          找到 <span className="font-semibold text-amber-600">{filteredPackages.length}</span> 個符合條件的方案
        </p>
      </motion.div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg, index) => (
          <AnimatedPackageCard key={pkg.id} package={pkg} index={index} />
        ))}
      </div>

      {/* Call to Action */}
      <motion.section 
        className="mt-12 bg-gray-100 p-8 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">找不到合適的方案？</h3>
        <p className="text-gray-600 mb-6">
          我們提供客製化旅遊規劃服務，讓我們為您量身打造專屬的旅行體驗
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors font-medium">
            客製化諮詢
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
            聯絡專員
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default PackagesPage; 