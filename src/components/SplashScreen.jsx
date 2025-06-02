import React, { useEffect } from 'react';

const SplashScreen = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 1500); // Reduced to 1.5 seconds for quicker loading
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* You can replace this with a logo or a more elaborate animation */}
      <h1 className="text-4xl font-bold text-gray-700 animate-pulse">TITAN旅遊</h1>
      <p className="mt-4 text-lg text-gray-500">Loading your next adventure...</p>
      {/* Example of a more complex logo (SVG) if you have one*/}
      {/* 
      <svg className="w-24 h-24 text-amber-500 mb-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .29L9.23.38a.94.94 0 00-.86.94l.05 2.88c-1.4.43-2.62 1.24-3.53 2.32l-2.05-2.05a.94.94 0 00-1.33 0L.38 5.6a.94.94 0 000 1.33l2.05 2.05c-.43 1.4-.43 2.93 0 4.33L.38 15.36a.94.94 0 000 1.33l1.13 1.13a.94.94 0 001.33 0l2.05-2.05c.9 1.08 2.13 1.89 3.53 2.32l-.05 2.88a.94.94 0 00.86.94l2.77.09a.94.94 0 00.94-.86l.05-2.88c1.4-.43 2.62-1.24 3.53-2.32l2.05 2.05a.94.94 0 001.33 0l1.13-1.13a.94.94 0 000-1.33l-2.05-2.05c.43-1.4.43-2.93 0-4.33l2.05-2.05a.94.94 0 000-1.33L20.4 4.27a.94.94 0 00-1.33 0l-2.05 2.05c-.9-1.08-2.13-1.89-3.53-2.32l.05-2.88a.94.94 0 00-.86-.94L12.81.29a.94.94 0 00-.81 0zm0 6.78a4.93 4.93 0 110 9.86 4.93 4.93 0 010-9.86z"/>
      </svg> 
      */}
    </div>
  );
};

export default SplashScreen; 