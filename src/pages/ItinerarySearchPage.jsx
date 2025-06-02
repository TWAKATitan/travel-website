import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

const destinations = ['日本', '台灣', '印尼', '中國'];
const themes = ['Latest Travel', 'Japanese Vibe', '海島東南亞', '中國雅學賞', '台灣心慢遊', 'Cultural Heritage', 'Art & Design', 'Luxury Escape', 'Wellness Retreat', 'Nature & Adventure'];

const ItinerarySearchPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState('');
  const [theme, setTheme] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {
      country: destination,
      theme: theme,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    };
    
    navigate('/all-trips', { state: { initialFilters: filters } });
  };

  const CustomDatePickerInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 h-12"
      onClick={onClick}
      ref={ref}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </button>
  ));

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 p-6">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-8 font-serif">行程日期搜尋</h1>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">出發區間 (起)</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy/MM/dd"
                isClearable
                placeholderText="選擇開始日期"
                customInput={<CustomDatePickerInput placeholder="選擇開始日期" />}
                wrapperClassName="w-full"
              />
            </div>
            <div className="w-full">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">出發區間 (迄)</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="yyyy/MM/dd"
                isClearable
                placeholderText="選擇結束日期"
                customInput={<CustomDatePickerInput placeholder="選擇結束日期" />}
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">目的地</label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">請選擇目的地</option>
              {destinations.map(dest => <option key={dest} value={dest}>{dest}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">主題</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">請選擇主題</option>
              {themes.map(th => <option key={th} value={th}>{th}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          >
            搜尋行程
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItinerarySearchPage; 