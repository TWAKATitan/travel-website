import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllTripsPage = ({ scenicSpots }) => {
  const location = useLocation();
  const [filteredSpots, setFilteredSpots] = useState([]);

  // Filters
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTravelStyle, setSelectedTravelStyle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  // Unique values for filter dropdowns
  const [countries, setCountries] = useState([]);
  const [travelStyles, setTravelStyles] = useState([]);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    if (scenicSpots && scenicSpots.length > 0) {
      // Populate filter options
      setCountries([...new Set(scenicSpots.map(s => s.country))].sort());
      setTravelStyles([...new Set(scenicSpots.map(s => s.travelStyle))].sort());
      setThemes([...new Set(scenicSpots.map(s => s.category))].sort());

      // Check for initial filter state passed from navigation (e.g. from header link)
      if (location.state && location.state.initialFilters) {
        const { country, travelStyle, theme, startDate, endDate } = location.state.initialFilters;
        if (country) setSelectedCountry(country);
        if (travelStyle) setSelectedTravelStyle(travelStyle);
        if (theme) setSelectedTheme(theme);
        if (startDate) setFilterStartDate(new Date(startDate));
        if (endDate) setFilterEndDate(new Date(endDate));
      }
    }
  }, [scenicSpots, location.state]);

  useEffect(() => {
    if (!scenicSpots) {
        setFilteredSpots([]);
        return;
    }

    let spots = [...scenicSpots]; // Start with all spots

    if (selectedCountry) {
      spots = spots.filter(s => s.country === selectedCountry);
    }
    if (selectedTravelStyle) {
      spots = spots.filter(s => s.travelStyle === selectedTravelStyle);
    }
    if (selectedTheme) {
      spots = spots.filter(s => s.category === selectedTheme);
    }

    if (filterStartDate && filterEndDate) {
      spots = spots.filter(spot => {
        const spotStart = new Date(spot.startDate);
        const spotEnd = new Date(spot.endDate);
        // Check for overlap: (FilterStart <= SpotEnd) and (FilterEnd >= SpotStart)
        return filterStartDate <= spotEnd && filterEndDate >= spotStart;
      });
    } else if (filterStartDate) {
      spots = spots.filter(spot => new Date(spot.endDate) >= filterStartDate);
    } else if (filterEndDate) {
      spots = spots.filter(spot => new Date(spot.startDate) <= filterEndDate);
    }

    setFilteredSpots(spots);
  }, [selectedCountry, selectedTravelStyle, selectedTheme, filterStartDate, filterEndDate, scenicSpots]);

  const resetFilters = () => {
    setSelectedCountry('');
    setSelectedTravelStyle('');
    setSelectedTheme('');
    setFilterStartDate(null);
    setFilterEndDate(null);
  };
  
  if (!scenicSpots || scenicSpots.length === 0) {
    return <div className="container mx-auto px-6 py-10 text-center">沒有可顯示的行程資訊。</div>;
  }

  const CustomDatePickerInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <button 
      type="button"
      className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-10"
      onClick={onClick} 
      ref={ref}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </button>
  ));

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Page Title */}
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        各國行程總覽
      </motion.h1>

      {/* Filters Section */}
      <motion.section 
        className="mb-10 p-4 md:p-6 bg-gray-100 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center md:text-left">選擇您的理想行程</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 items-end">
          {/* Date Filters */}
          <div className="w-full">
            <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 mb-1">開始日期</label>
            <DatePicker
              selected={filterStartDate}
              onChange={(date) => setFilterStartDate(date)}
              selectsStart
              startDate={filterStartDate}
              endDate={filterEndDate}
              dateFormat="yyyy/MM/dd"
              isClearable
              placeholderText="選擇開始日期"
              customInput={<CustomDatePickerInput placeholder="選擇開始日期" />}
              wrapperClassName="w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 mb-1">結束日期</label>
            <DatePicker
              selected={filterEndDate}
              onChange={(date) => setFilterEndDate(date)}
              selectsEnd
              startDate={filterStartDate}
              endDate={filterEndDate}
              minDate={filterStartDate}
              dateFormat="yyyy/MM/dd"
              isClearable
              placeholderText="選擇結束日期"
              customInput={<CustomDatePickerInput placeholder="選擇結束日期" />}
              wrapperClassName="w-full"
            />
          </div>
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
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium self-end whitespace-nowrap h-10 lg:col-start-5"
          >
            清除篩選
          </button>
        </div>
      </motion.section>

      {/* Filtered Spots List */}
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
                className="h-full"
              >
                <Link to={`/spot/${spot.id}`} className="block group bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-2xl transform hover:-translate-y-1 h-full">
                  <img src={spot.image} alt={spot.title} className="w-full h-56 object-cover"/>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-amber-600">{spot.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{spot.travelStyle} - {spot.country} - {spot.category}</p>
                    <p className="text-xs text-gray-500 mb-2">日期: {new Date(spot.startDate).toLocaleDateString()} - {new Date(spot.endDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600 truncate flex-grow">{spot.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            className="text-center text-gray-500 py-10 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            沒有找到符合您篩選條件的行程，請嘗試調整篩選器。
          </motion.p>
        )}
      </section>
    </div>
  );
};

export default AllTripsPage; 