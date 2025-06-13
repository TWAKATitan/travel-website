import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import ItinerarySearchPage from './pages/ItinerarySearchPage';
import SpotDetailsPage from './pages/SpotDetailsPage';
import AllTripsPage from './pages/AllTripsPage';
import TravelInfoSubPage from './pages/TravelInfoSubPage';
import OrderLookupPage from './pages/OrderLookupPage';
import MemberAreaPage from './pages/MemberAreaPage';
import PackagesPage from './pages/PackagesPage';
import CustomerServicePage from './pages/CustomerServicePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { FaCalendarAlt, FaRegCommentDots, FaShoppingCart } from 'react-icons/fa';
import { travelInfoSections } from './data/travelInfoData'; // Import travel info data
import { client } from './sanity/client'; // 導入 Sanity 客戶端
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 初始假資料陣列 - 將會被移入 useState
const initialScenicSpots = [
  {
    id: 1,
    title: '古風．佐原商家町飯店',
    description: '懷舊創新．韻味獨具老宅旅宿',
    image: 'https://picsum.photos/seed/sahara/1200/800',
    category: 'Latest Travel',
    fullDescription: `在茶芳中領會「和敬清寂」的茶道之心，再於金繼藝術中稱頌「侘寂」之美。\n繼承悠遠的傳統後而創新，追求上質生活的美學體驗。`,
    country: 'Japan',
    travelStyle: 'Cultural Heritage',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 75000,
    memberPrice: 72000,
  },
  {
    id: 2,
    title: '直島旅館．ろ霞',
    description: '簡約美學．日式靜謐藝術の美',
    image: 'https://picsum.photos/seed/naoshima/1200/800',
    category: 'Japanese Vibe',
    fullDescription: `一期一會．圍爐裏佐旅人時光。\n品味幸福．瀨戶內海時令食藝。`,
    country: 'Japan',
    travelStyle: 'Art & Design',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 88000,
    memberPrice: 85000,
  },
  {
    id: 3,
    title: '頂級奢華宿．京都柏悅',
    description: '侘寂美學．和韻建築靜雅の美',
    image: 'https://picsum.photos/seed/kyoto/1200/800',
    category: 'Japanese Vibe',
    fullDescription: `卓越服務．一期一會款待之心。\n視覺饗宴．五感食藝佐京美景。`,
    country: 'Japan',
    travelStyle: 'Luxury Escape',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 120000,
    memberPrice: 115000,
  },
  {
    id: 4,
    title: '米其林星鑰．安縵伊沐',
    description: '極致美學．海天一色四季の美',
    image: 'https://picsum.photos/seed/izu/1200/800',
    category: 'Japanese Vibe',
    fullDescription: `五感體驗．暖湯浸浴身心合一。\n和韻珍饈．山海之幸自然食藝。`,
    country: 'Japan',
    travelStyle: 'Wellness Retreat',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 150000,
    memberPrice: 145000,
  },
  {
    id: 5,
    title: '峇里島．靜謐心靈之旅',
    description: '熱帶天堂．奢享靜心假期',
    image: 'https://picsum.photos/seed/bali-retreat/1200/800',
    category: '海島東南亞',
    fullDescription: `沉浸於峇里島的獨特文化氛圍，體驗傳統SPA的撫慰，探索翠綠稻田與古老廟宇的神秘。\n在私人別墅中享受無憂無慮的時光，讓身心靈得到全然的放鬆與 обнов。`,
    country: 'Indonesia',
    travelStyle: 'Luxury Escape',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 95000,
    memberPrice: 91000,
  },
  {
    id: 6,
    title: '杭州．西湖雅集',
    description: '江南古韻．詩畫山水間',
    image: 'https://picsum.photos/seed/hangzhou-culture/1200/800',
    category: '中國雅學賞',
    fullDescription: `漫步蘇堤春曉，欣賞雷峰夕照，於西湖的濛濛煙雨中感受千年宋詞的意境。\n品龍井茶香，嘗地道杭幫菜，體驗中國古典園林的精巧與雅緻。`,
    country: 'China',
    travelStyle: 'Cultural Heritage',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 68000,
    memberPrice: 65000,
  },
  {
    id: 7,
    title: '花蓮．太魯閣慢行',
    description: '山海壯闊．峽谷森呼吸',
    image: 'https://picsum.photos/seed/taroko-taiwan/1200/800',
    category: '台灣心慢遊',
    fullDescription: `深入太魯閣國家公園的雄偉峽谷，感受大自然的鬼斧神工。\n沿著步道緩行，聽流水潺潺，觀峭壁紋理，享受森林浴的清新與寧靜。`,
    country: 'Taiwan',
    travelStyle: 'Nature & Adventure',
    startDate: '2025-05-15',
    endDate: '2025-12-30',
    regularPrice: 45000,
    memberPrice: 42000,
  }
];

// Data for the new interactive section
const interactiveSectionData = {
  sectionTitle: "日旅遊遊", // Main title for the block (e.g., Japan Tours)
  sectionSubtitle: "GOODAY TOURS", // Subtitle for the block
  items: [
    {
      id: 'classic-japan',
      title: '日本心旅行', // Classic Japan
      image: 'https://picsum.photos/seed/interactive-classic-japan/1200/800',
      description: '探索日本的經典之美，從繁華都市到寧靜古都，感受日本文化的深厚底蘊。'
    },
    {
      id: 'luxury-rail',
      title: '日本鐵道遊', // Luxury Rail Travel
      image: 'https://picsum.photos/seed/interactive-luxury-rail/1200/800',
      description: '搭乘豪華觀光列車，穿梭於日本的壯麗山川，享受尊貴舒適的鐵道旅行體驗。'
    },
    {
      id: 'festival-events',
      title: '主題旅遊賞', // Festival & Events
      image: 'https://picsum.photos/seed/interactive-festival-events/1200/800',
      description: '參與日本各地的特色節慶與活動，如櫻花祭、夏日花火、紅葉狩等，體驗獨特的季節魅力。'
    },
    {
      id: 'japanese-beauty',
      title: '日本美學旅', // Japanese Beauty Tour
      image: 'https://picsum.photos/seed/interactive-japanese-beauty/1200/800',
      description: '沉浸於日本的傳統美學，如茶道、花道、庭園藝術，感受和風文化的雅緻與寧靜。'
    },
    {
      id: 'se-asia-islands', // Renamed for consistency
      title: '海島東南亞', // Shortened for vertical display
      image: 'https://picsum.photos/seed/interactive-se-asia/1200/800',
      description: '前往陽光普照的海島與充滿活力的東南亞國家，享受沙灘、美食與異國文化。'
    },
    {
      id: 'china-travel', // Renamed for consistency
      title: '中國雅學賞',
      image: 'https://picsum.photos/seed/interactive-china-travel/1200/800',
      description: '發掘中國悠久的歷史與文化，遊覽名山大川，品味中華雅學的博大精深。'
    },
    {
      id: 'unique-taiwan', // Renamed for consistency
      title: '台灣心慢遊',
      image: 'https://picsum.photos/seed/interactive-unique-taiwan/1200/800',
      description: '細細品味台灣的獨特風情，從北到南，體驗在地的熱情與多元文化。'
    }
  ]
};

// 購物車圖標組件
const CartIcon = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Link 
      to="/cart" 
      className={`flex items-center space-x-2 hover:text-white transition-colors ${
        location.pathname === '/cart' ? 'text-amber-400' : 'text-gray-300' 
      }`}
    >
      <FaShoppingCart className="text-lg" />
      <span className="text-sm font-medium">購物車</span>
    </Link>
  );
};

// Reusable Animated Section Component
const AnimatedSpotCard = ({ spot, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 }); // Trigger every time, when 30% is visible

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      // To make it animate out, set it back to hidden if not in view
      controls.start("hidden"); 
    }
  }, [controls, isInView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={ref}
      key={spot.id}
      className={`mb-20 flex flex-col items-center gap-8 md:gap-12 p-6 md:p-8 rounded-lg shadow-lg ${index % 2 === 0 ? 'md:flex-row bg-white' : 'md:flex-row-reverse bg-orange-50'}`}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="md:w-3/5 lg:w-2/3 flex-shrink-0">
        <motion.img 
          src={spot.image} 
          alt={spot.title} 
          className="w-full h-auto object-cover rounded-xl shadow-2xl" 
          style={{maxHeight: '600px'}}
          // Optional: add variants to the image itself if needed
        />
      </div>
      <div className="md:w-2/5 lg:w-1/3 space-y-3 text-center md:text-left">
        <p className="text-xs font-light tracking-wider uppercase text-gray-500">{spot.category || 'Travel Highlight'}</p>
        <h3 className="text-xl md:text-2xl font-serif text-gray-700">{spot.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {spot.description}
        </p>
        <Link 
            to={`/spot/${spot.id}`}
            state={{ initialCategory: spot.category }}
          className="mt-2 inline-block bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-md transition-colors text-sm font-medium shadow-md">
          了解更多
        </Link>
      </div>
    </motion.section>
  );
};

const HomePage = ({ scenicSpots }) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [activeInteractiveItemIndex, setActiveInteractiveItemIndex] = useState(0);

  // Animation controls for the interactive section
  const interactiveSectionRef = useRef(null);
  const interactiveSectionInView = useInView(interactiveSectionRef, { once: false, amount: 0.2 });
  const interactiveSectionControls = useAnimation();

  useEffect(() => {
    // Cycle through all scenicSpots for the hero slider
    const timer = setTimeout(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % scenicSpots.length);
    }, 7000); // Change slide every 7 seconds
    return () => clearTimeout(timer);
  }, [currentHeroIndex, scenicSpots.length]);

  // Effect for interactive section animation
  useEffect(() => {
    if (interactiveSectionInView) {
      interactiveSectionControls.start("visible");
    } else {
      interactiveSectionControls.start("hidden");
    }
  }, [interactiveSectionInView, interactiveSectionControls]);

  const activeHeroSpot = scenicSpots[currentHeroIndex];

  const interactiveSectionVariants = {
    hidden: { opacity: 0, y: 50, transition: { duration: 0.5, ease: "easeOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <>
      {/* Hero Section - Auto-sliding */}
      <section 
        id="hero-slider" 
        className="relative w-full h-screen flex items-center justify-start overflow-hidden bg-gray-800"
      >
        {scenicSpots.map((spot, index) => (
          <motion.div // Changed to motion.div for potential hero animations later
            key={spot.id} 
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${spot.image})` }}
            // Example initial/animate for hero images if needed
            // initial={{ opacity: 0 }}
            // animate={{ opacity: index === currentHeroIndex ? 1 : 0 }}
            // transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </motion.div>
        ))}
        
        {/* Text Content for Hero - Positioned to the left */}
        <div className="relative z-10 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-6 md:p-12 text-white bg-black bg-opacity-25 rounded-r-lg md:rounded-lg shadow-2xl ml-0 md:ml-8 lg:ml-16">
          <p className="font-light tracking-widest uppercase opacity-80 text-xs md:text-sm mb-2">
            {activeHeroSpot.category || 'Featured Travel'}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight font-serif mb-3">
            {activeHeroSpot.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed opacity-90 mb-6 max-w-prose">
            {activeHeroSpot.fullDescription || activeHeroSpot.description}
          </p>
          <Link 
            to={`/spot/${activeHeroSpot.id}`}
            state={{ initialCategory: activeHeroSpot.category }}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md transition-colors text-base md:text-lg font-semibold shadow-lg">
            探索此景
          </Link>
        </div>
      </section>

      {/* Other Scenic Spots - Static sections below hero */}
      <main className="container mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">精選行程</h2>

        {/* NEW INTERACTIVE SECTION - Now with animation and enhanced border */}
        {interactiveSectionData && interactiveSectionData.items && interactiveSectionData.items.length > 0 && (
          <motion.section 
            ref={interactiveSectionRef}
            variants={interactiveSectionVariants}
            initial="hidden"
            animate={interactiveSectionControls}
            className="flex flex-col md:flex-row h-[70vh] min-h-[500px] max-h-[700px] bg-white shadow-xl rounded-lg overflow-hidden my-16 border border-gray-300"
          >
            {/* Left Panel: Titles & Description */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col bg-gray-50 rounded-l-lg overflow-hidden">
              <h3 className="text-3xl font-bold mb-1 text-gray-800">{interactiveSectionData.sectionTitle}</h3>
              <p className="text-sm text-gray-400 mb-6 tracking-wider">{interactiveSectionData.sectionSubtitle}</p>
              
              {/* Container for horizontally arranged vertical titles */}
              <div className="flex items-start space-x-2 md:space-x-3 lg:space-x-4 overflow-x-auto pb-3 mb-4 flex-grow min-h-[120px] custom-scrollbar">
                {interactiveSectionData.items.map((item, index) => {
                  // Find the first spot that matches this interactive item's title (which we use as a category)
                  const matchingSpot = scenicSpots.find(spot => spot.category === item.title);

                  return (
                    <div // This div handles mouse enter for hover effects, separate from Link
                      key={item.id}
                      onMouseEnter={() => setActiveInteractiveItemIndex(index)}
                      className={`p-2 transition-all duration-200 ease-in-out rounded-md flex-shrink-0 
                                  ${activeInteractiveItemIndex === index ? 'bg-amber-100 shadow-inner' : 'hover:bg-gray-200'}`}
                    >
                      {matchingSpot ? (
                        <Link 
                          to={`/spot/${matchingSpot.id}`}
                          state={{ initialCategory: item.title }} // Pass the category title for pre-filtering
                          className="cursor-pointer" // Ensure link is clickable
                        >
                          <h4 
                            className={`font-semibold whitespace-nowrap ${activeInteractiveItemIndex === index ? 'text-amber-700' : 'text-gray-600'}`}
                            style={{ lineHeight: '1.3' }} // Controls vertical spacing of characters
                          >
                            {item.title.split('').map((char, charIdx) => (
                              <span key={charIdx} className="block text-xs md:text-sm text-center">{char}</span>
                            ))}
                          </h4>
                        </Link>
                      ) : (
                        // Fallback if no matching spot is found (should not happen with current data)
                        <h4 
                          className={`font-semibold whitespace-nowrap text-gray-400 cursor-not-allowed`}
                          style={{ lineHeight: '1.3' }}
                        >
                          {item.title.split('').map((char, charIdx) => (
                            <span key={charIdx} className="block text-xs md:text-sm text-center">{char}</span>
                          ))}
                        </h4>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-auto pt-6 border-t border-gray-200">
                <h5 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {interactiveSectionData.items[activeInteractiveItemIndex].title}
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed h-16 overflow-y-auto custom-scrollbar"> {/* Fixed height and scroll for description */}
                  {interactiveSectionData.items[activeInteractiveItemIndex].description}
                </p>
              </div>
            </div>

            {/* Right Panel: Image */}
            <div className="w-full md:w-3/5 relative overflow-hidden rounded-r-lg">
              {interactiveSectionData.items.map((item, index) => (
                <motion.div // Using motion.div for the image container for potential transitions
                  key={item.id}
                  className={`absolute inset-0 bg-cover bg-center`}
                  style={{ backgroundImage: `url(${item.image})` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === activeInteractiveItemIndex ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Static Scenic Spots with Scroll Animation */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-16">熱門景點</h2>
        {scenicSpots.map((spot, index) => (
          <AnimatedSpotCard key={spot.id} spot={spot} index={index} />
        ))}
      </main>
    </>
  );
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [travelInfoDropdownOpen, setTravelInfoDropdownOpen] = useState(false);
  const travelInfoTimeoutRef = useRef(null); // For delayed closing
  const [scenicSpots, setScenicSpots] = useState(initialScenicSpots); // 在 App 層級管理 scenicSpots

  const handleSplashFinished = () => setLoading(false);
  const handlePackagesClick = () => navigate('/packages');
  const handleCustomerServiceClick = () => navigate('/customer-service');

  // 撈取 Sanity 第一筆資料 - 移到 App 層級
  useEffect(() => {
    const fetchSanitySpot = async () => {
      try {
        // 先測試是否有任何 tour 資料
        const allTours = await client.fetch(`*[_type == "tour"]`);
        console.log('所有 tours:', allTours);
        
        // 嘗試不同的查詢方式
        let data = null;
        
        // 方法 1: id 為數字（根據 schema，id 是 number 類型）
        data = await client.fetch(
          `*[_type == "tour" && id == 1][0]{
            id,
            title,
            description,
            fullDescription,
            category,
            country,
            travelStyle,
            startDate,
            endDate,
            regularPrice,
            memberPrice,
            "imageUrl": image.asset->url
          }`
        );
        console.log('查詢 id=1 結果:', data);
        
        // 方法 2: 如果還是沒有，就取第一筆
        if (!data && allTours.length > 0) {
          data = allTours[0];
          console.log('取第一筆資料:', data);
        }
        if (data) {
          // 將 Sanity 資料映射到我們需要的格式
          const mappedData = {
            ...data,
            id: Number(data.id) || 1, // 確保 id 是數字型且有值
            image: data.imageUrl // 將 imageUrl 映射為 image
          };
          
          console.log('從 Sanity 撈取的資料:', mappedData); // 除錯用
          
          // 替換原本的第一筆資料，保留後面其他假資料
          setScenicSpots(prev => {
            const newSpots = [...prev];
            newSpots[0] = mappedData;
            return newSpots;
          });
        }
      } catch (error) {
        console.error('Error fetching Sanity data:', error);
        // 如果撈取失敗，繼續使用假資料
      }
    };

    fetchSanitySpot();
  }, []);

  const navItems = [
    { name: "各國行程", href: "/all-trips" },
    { name: "方案賞析", href: "/packages" },
    { name: "旅遊資訊", href: "/travel-info/recommended-deals", isDropdown: true }, // Link directly to recommended-deals
    { name: "訂單查詢", href: "/order-lookup" },
    { name: "會員專區", href: "/member-area" },
  ];

  const handleMouseEnterTravelInfo = () => {
    clearTimeout(travelInfoTimeoutRef.current);
    setTravelInfoDropdownOpen(true);
  };

  const handleMouseLeaveTravelInfo = () => {
    travelInfoTimeoutRef.current = setTimeout(() => {
      setTravelInfoDropdownOpen(false);
    }, 200); // Small delay to allow moving mouse to dropdown
  };

  if (loading) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <header className="bg-neutral-900 text-gray-300 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-gray-100 hover:text-amber-400 transition-colors">
            TITAN旅遊
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-grow justify-center">
            {navItems.map((item) => {
              // Updated isActive logic for "旅遊資訊"
              const isActive = location.pathname === item.href || 
                               (item.href === "/all-trips" && location.pathname.startsWith("/spot/")) ||
                               (item.name === "旅遊資訊" && location.pathname.startsWith("/travel-info/"));
              
              if (item.isDropdown) {
                return (
                  <div 
                    key={item.name} 
                    className="relative" 
                    onMouseEnter={handleMouseEnterTravelInfo}
                    onMouseLeave={handleMouseLeaveTravelInfo}
                  >
                    <Link 
                      to={item.href} // This now points to /travel-info/recommended-deals
                      className={`px-1 pb-1 transition-all duration-150 ease-in-out flex items-center
                                  ${
                                    isActive
                                      ? 'text-white border-b-2 border-amber-400' 
                                      : 'hover:text-white hover:border-b-2 hover:border-amber-400 text-gray-300'
                                  }
                                  text-sm lg:text-base font-medium cursor-pointer`}
                      onClick={() => setTravelInfoDropdownOpen(false)} // Close dropdown if main link is clicked
                    >
                      {item.name}
                    </Link>
                    {travelInfoDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-4xl p-6 bg-neutral-800 shadow-2xl rounded-md z-50"
                        onMouseEnter={handleMouseEnterTravelInfo} 
                        onMouseLeave={handleMouseLeaveTravelInfo} 
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                          {travelInfoSections.map(section => (
                            <div key={section.id} className="min-w-[180px]">
                              <h3 className="text-lg font-semibold text-amber-400 mb-3 pb-1 border-b border-neutral-700">
                                {section.title}
                              </h3>
                              <ul className="space-y-2">
                                {section.links.map(link => (
                                  <li key={link.id}>
                                    <Link 
                                      to={`/travel-info/${link.id}`}
                                      onClick={() => setTravelInfoDropdownOpen(false)} 
                                      className="block text-sm text-gray-300 hover:text-white hover:underline transition-colors whitespace-nowrap"
                                    >
                                      {link.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-1 pb-1 transition-all duration-150 ease-in-out 
                              ${
                                isActive
                                  ? 'text-white border-b-2 border-amber-400' 
                                  : 'hover:text-white hover:border-b-2 hover:border-amber-400 text-gray-300'
                              }
                              text-sm lg:text-base font-medium`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-5 md:space-x-6">
            <Link to="/search-itinerary" className={`flex items-center space-x-2 hover:text-white transition-colors ${
              location.pathname === '/search-itinerary' ? 'text-amber-400' : 'text-gray-300' 
            }`}>
              <FaCalendarAlt className="text-lg" />
              <span className="text-sm font-medium">日期搜尋</span>
            </Link>
            <CartIcon />
            <button onClick={handleCustomerServiceClick} className="hover:text-white transition-colors">
              <FaRegCommentDots className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage scenicSpots={scenicSpots} />} />
        <Route path="/search-itinerary" element={<ItinerarySearchPage />} />
        <Route path="/spot/:spotId" element={<SpotDetailsPage scenicSpots={scenicSpots} />} />
        <Route path="/all-trips" element={<AllTripsPage scenicSpots={scenicSpots} />} />
        
        {/* Travel Info Routes - Main overview page route removed */}
        {/* <Route path="/travel-info" element={<TravelInfoPage />} /> --- This line is removed */}
        <Route path="/travel-info/:subPageSlug" element={<TravelInfoSubPage />} />

        <Route path="/order-lookup" element={<OrderLookupPage />} />
        <Route path="/member-area" element={<MemberAreaPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/customer-service" element={<CustomerServicePage />} />
        
        {/* 新增的購物車和結帳路由 */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/:cartId" element={<CheckoutPage />} />
      </Routes>

      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">TITAN旅遊</h3>
              <p className="text-gray-400 text-xs leading-relaxed">代表號：(02)8772-3373<br/>服務信箱：service@titantours.com.tw<br/>台北市松山區南京東路三段248號17樓</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3">日本心旅行</h3>
              <ul className="space-y-1 text-xs">
                <li><Link to="#" className="text-gray-400 hover:text-white">札幌‧北海道道東</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">東京‧關東富士山</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">大阪‧關西‧京都</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3">主題旅遊賞</h3>
              <ul className="space-y-1 text-xs">
                <li><Link to="/packages" className="text-gray-400 hover:text-white">國際金旅獎‧行程</Link></li>
                <li><Link to="/packages" className="text-gray-400 hover:text-white">日本慶典‧花火遊</Link></li>
                <li><Link to="/packages" className="text-gray-400 hover:text-white">白川鄉合掌村點燈</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3">關於我們</h3>
              <ul className="space-y-1 text-xs">
                <li><Link to="#" className="text-gray-400 hover:text-white">服務據點</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">團隊介紹</Link></li>
                <li><Link to="/customer-service" className="text-gray-400 hover:text-white">聯絡我們</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} TITAN TOURS Service Co., Ltd. All rights reserved.</p>
            <p>交觀綜 222100 品保北 2569 號</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 