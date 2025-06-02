import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { travelInfoSections } from '../data/travelInfoData';
import { FaArrowLeft } from 'react-icons/fa';

const TravelInfoSubPage = () => {
  const { subPageSlug } = useParams();
  let item = null;

  // Find the item from the data structure
  for (const section of travelInfoSections) {
    const foundLink = section.links.find(link => link.id === subPageSlug);
    if (foundLink) {
      item = foundLink;
      break;
    }
  }

  if (!item) {
    return (
      <div className="container mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">內容未找到</h1>
        <p className="mb-6">抱歉，我們找不到您所請求的資訊。</p>
        <Link to="/" className="text-amber-600 hover:underline">
          返回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Link 
          to="/"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 group transition-colors"
        >
          <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          返回首頁
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-serif">{item.name}</h1>
        
        {item.image && (
          <motion.img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          />
        )}
        
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {item.description}
        </div>
      </motion.div>
    </div>
  );
};

export default TravelInfoSubPage; 