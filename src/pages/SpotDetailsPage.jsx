import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUser, FaSpinner } from 'react-icons/fa';
import { cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SpotDetailsPage = ({ scenicSpots }) => {
  const { spotId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  // Filters
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTravelStyle, setSelectedTravelStyle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(''); // Corresponds to spot.category

  // Unique values for filter dropdowns
  const [countries, setCountries] = useState([]);
  const [travelStyles, setTravelStyles] = useState([]);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    if (scenicSpots && scenicSpots.length > 0) {
      const spot = scenicSpots.find(s => s.id === parseInt(spotId));
      setSelectedSpot(spot);

      // Populate filter options
      setCountries([...new Set(scenicSpots.map(s => s.country))].sort());
      setTravelStyles([...new Set(scenicSpots.map(s => s.travelStyle))].sort());
      setThemes([...new Set(scenicSpots.map(s => s.category))].sort()); // Using spot.category for themes

      // Pre-select filter if passed in location state (from "Learn More" button)
      if (location.state && location.state.initialCategory) {
        // Determine if initialCategory is a country, travelStyle, or theme
        const initialCat = location.state.initialCategory;
        if ([...new Set(scenicSpots.map(s => s.country))].includes(initialCat)) {
          setSelectedCountry(initialCat);
        } else if ([...new Set(scenicSpots.map(s => s.travelStyle))].includes(initialCat)) {
          setSelectedTravelStyle(initialCat);
        } else if ([...new Set(scenicSpots.map(s => s.category))].includes(initialCat)) {
          setSelectedTheme(initialCat);
        }
      }
    }
  }, [spotId, scenicSpots, location.state]);

  useEffect(() => {
    if (!scenicSpots) return;

    let spots = scenicSpots.filter(s => s.id !== parseInt(spotId)); // Exclude the main selected spot

    if (selectedCountry) {
      spots = spots.filter(s => s.country === selectedCountry);
    }
    if (selectedTravelStyle) {
      spots = spots.filter(s => s.travelStyle === selectedTravelStyle);
    }
    if (selectedTheme) {
      spots = spots.filter(s => s.category === selectedTheme);
    }
    setFilteredSpots(spots);
  }, [selectedCountry, selectedTravelStyle, selectedTheme, scenicSpots, spotId]);

  if (!selectedSpot) {
    return <div className="container mx-auto px-6 py-10 text-center">景點載入中或找不到景點...</div>;
  }

  const resetFilters = () => {
    setSelectedCountry('');
    setSelectedTravelStyle('');
    setSelectedTheme('');
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/member-area');
      return;
    }

    if (!selectedSpot) return;

    setAddingToCart(true);
    setCartMessage('');

    try {
      await cartAPI.addToCart({
        name: selectedSpot.title,
        price: user?.isVip ? selectedSpot.memberPrice : selectedSpot.regularPrice,
      });

      setCartMessage('已成功加入購物車！');
      setTimeout(() => setCartMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setCartMessage('加入購物車失敗，請稍後再試');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Main Spot Details - Animated */}
      <motion.section 
        key={selectedSpot.id}
        className="mb-12 bg-white shadow-xl rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.img 
          src={selectedSpot.image} 
          alt={selectedSpot.title} 
          className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        />
        <motion.div 
          className="p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-serif">{selectedSpot.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{selectedSpot.country}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{selectedSpot.travelStyle}</span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{selectedSpot.category}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">旅遊期間: {new Date(selectedSpot.startDate).toLocaleDateString()} - {new Date(selectedSpot.endDate).toLocaleDateString()}</p>
          
          {/* Prices and Cart Section */}
          <div className="my-6 p-6 bg-gray-50 rounded-lg shadow-inner">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {user?.isVip && (
                  <p className="text-sm text-gray-500 line-through">一般價: NT$ {selectedSpot.regularPrice.toLocaleString()}</p>
                )}
                <p className="text-xl font-bold text-amber-600">
                  {user?.isVip ? '會員價' : '價格'}: NT$ {(user?.isVip ? selectedSpot.memberPrice : selectedSpot.regularPrice).toLocaleString()}
                </p>
                {user?.isVip && (
                  <p className="text-sm text-green-600 font-medium">VIP會員優惠價</p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {cartMessage && (
                  <div className={`text-sm px-3 py-2 rounded-lg ${
                    cartMessage.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {cartMessage}
                  </div>
                )}
                
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {addingToCart ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      加入中...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      {isLoggedIn ? '加入購物車' : '登入後購買'}
                    </>
                  )}
                </button>
                
                {!isLoggedIn && (
                  <p className="text-xs text-gray-500 text-center">
                    需要登入才能購買行程
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedSpot.fullDescription}</p>
        </motion.div>
      </motion.section>

      {/* Filters Section */}
      <section className="mb-10 p-4 md:p-6 bg-gray-50 rounded-lg shadow border-t-2 border-gray-200 pt-8 mt-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">探索其他景點</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 items-end">
          {/* Country Filter */}
          <div>
            <label htmlFor="country-filter" className="block text-sm font-medium text-gray-700 mb-1">國家</label>
            <select 
              id="country-filter"
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">所有國家</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Travel Style Filter */}
          <div>
            <label htmlFor="travel-style-filter" className="block text-sm font-medium text-gray-700 mb-1">旅遊風格</label>
            <select 
              id="travel-style-filter"
              value={selectedTravelStyle} 
              onChange={(e) => setSelectedTravelStyle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">所有風格</option>
              {travelStyles.map(ts => <option key={ts} value={ts}>{ts}</option>)}
            </select>
          </div>
          {/* Theme/Tag Filter */}
          <div>
            <label htmlFor="theme-filter" className="block text-sm font-medium text-gray-700 mb-1">主題/標籤</label>
            <select 
              id="theme-filter"
              value={selectedTheme} 
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">所有主題</option>
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={resetFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium self-end whitespace-nowrap sm:col-start-auto md:col-start-4"
          >
            清除篩選
          </button>
        </div>
      </section>

      {/* Filtered Spots List - Animated */}
      <section>
        {filteredSpots.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {filteredSpots.map(spot => (
              <motion.div
                key={spot.id} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                }}
              >
                <Link to={`/spot/${spot.id}`} className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl transform hover:-translate-y-1 block h-full">
                  <img src={spot.image} alt={spot.title} className="w-full h-56 object-cover"/>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-amber-600">{spot.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{spot.travelStyle} - {spot.country}</p>
                    <p className="text-sm text-gray-600 truncate">{spot.description}</p>
                    <div className="mt-2 pt-2 text-sm border-t border-gray-100">
                      <p className="text-gray-700">
                        <span className="font-semibold">參考售價:</span> NT$ {spot.regularPrice.toLocaleString()}
                      </p>
                      <p className="text-rose-600">
                        <span className="font-semibold">會員特價:</span> NT$ {spot.memberPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 py-8">沒有找到符合條件的景點。</p>
        )}
      </section>
    </div>
  );
};

export default SpotDetailsPage; 