import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaComments, FaQuestionCircle, FaHeadset, FaWhatsapp,
  FaFacebook, FaLine, FaPaperPlane, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const CustomerServicePage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', message: '您好！歡迎來到TITAN旅遊客服中心，我是您的專屬客服助理。請問有什麼可以為您服務的嗎？', time: '14:30' }
  ]);

  const contactInfo = [
    {
      icon: FaPhone,
      title: '客服專線',
      content: '(02) 8772-3373',
      description: '週一至週五 09:00-18:00',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FaEnvelope,
      title: '電子信箱',
      content: 'service@titantours.com.tw',
      description: '24小時內回覆',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: FaMapMarkerAlt,
      title: '服務據點',
      content: '台北市松山區南京東路三段248號17樓',
      description: '週一至週五 09:00-18:00',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      content: '+886-912-345-678',
      description: '即時回覆',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  const socialContacts = [
    { icon: FaFacebook, name: 'Facebook', handle: '@TitanTours', color: 'text-blue-600' },
    { icon: FaLine, name: 'LINE', handle: '@titantours', color: 'text-green-500' },
  ];

  const faqData = [
    {
      category: '預訂相關',
      questions: [
        {
          q: '如何預訂旅遊行程？',
          a: '您可以透過我們的官網線上預訂，或致電客服專線 (02) 8772-3373。我們的專業顧問將為您提供詳細的行程說明和預訂服務。'
        },
        {
          q: '預訂後可以取消或更改嗎？',
          a: '根據不同行程的取消政策，通常在出發前14-30天可以免費取消或更改。詳細條款請參考各行程說明或聯絡客服。'
        },
        {
          q: '需要支付訂金嗎？',
          a: '是的，預訂確認後需支付30%訂金，餘款請於出發前14天完成付款。我們接受信用卡、銀行轉帳等多種付款方式。'
        }
      ]
    },
    {
      category: '行程相關',
      questions: [
        {
          q: '行程包含哪些項目？',
          a: '我們的行程通常包含往返機票、住宿、部分餐食、交通接駁、專業導遊服務及旅遊保險。詳細包含項目請參考各行程說明。'
        },
        {
          q: '可以客製化行程嗎？',
          a: '當然可以！我們提供客製化旅遊服務，可根據您的需求、預算和時間安排專屬行程。請聯絡我們的旅遊顧問討論。'
        },
        {
          q: '團體人數限制是多少？',
          a: '我們提供不同規模的團體服務，從2人小團到40人大團都可安排。小團體享有更彈性的行程安排和個人化服務。'
        }
      ]
    },
    {
      category: '證件與簽證',
      questions: [
        {
          q: '需要辦理簽證嗎？',
          a: '依目的地不同而有所差異。日本、韓國等地台灣護照可免簽證，歐美國家可能需要申請簽證。我們可協助辦理相關手續。'
        },
        {
          q: '護照有效期限要求？',
          a: '護照效期建議至少6個月以上，部分國家要求更長。出發前請確認護照效期，如需換發請提早辦理。'
        }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        type: 'user',
        message: chatMessage,
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
      
      // 模擬客服回覆
      setTimeout(() => {
        const botReply = {
          type: 'bot',
          message: '感謝您的詢問！我已收到您的訊息，專業客服人員將在5分鐘內為您詳細回覆。如有緊急需求，請直接撥打客服專線 (02) 8772-3373。',
          time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, botReply]);
      }, 1000);
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center font-serif"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        客服中心
      </motion.h1>

      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 rounded-lg shadow-lg mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">24小時貼心服務</h2>
          <p className="text-amber-100 mb-6">
            我們的專業客服團隊隨時為您提供最優質的服務，無論是行程諮詢、預訂協助或緊急支援，都能獲得即時專業的回應
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FaHeadset className="text-amber-200" />
              <span>專業客服團隊</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-amber-200" />
              <span>快速回應</span>
            </div>
            <div className="flex items-center gap-2">
              <FaComments className="text-amber-200" />
              <span>多元聯絡方式</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'contact', name: '聯絡方式', icon: FaPhone },
              { id: 'chat', name: '線上客服', icon: FaComments },
              { id: 'faq', name: '常見問題', icon: FaQuestionCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">聯絡資訊</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className={`${contact.bgColor} p-6 rounded-lg border border-gray-200`}>
                      <div className="flex items-start gap-4">
                        <div className={`${contact.color} text-2xl mt-1`}>
                          <contact.icon />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{contact.title}</h4>
                          <p className="text-gray-700 font-medium mb-1">{contact.content}</p>
                          <p className="text-gray-600 text-sm">{contact.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">社群媒體</h3>
                <div className="flex flex-wrap gap-4">
                  {socialContacts.map((social, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <social.icon className={`text-xl ${social.color}`} />
                      <div>
                        <p className="font-medium text-gray-800">{social.name}</p>
                        <p className="text-gray-600 text-sm">{social.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-amber-800 mb-4">服務時間</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-amber-800">電話客服</p>
                    <p className="text-amber-700">週一至週五 09:00-18:00</p>
                    <p className="text-amber-700">週六 09:00-12:00</p>
                  </div>
                  <div>
                    <p className="font-medium text-amber-800">線上客服</p>
                    <p className="text-amber-700">週一至週日 24小時</p>
                    <p className="text-amber-700">即時回應</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-800">線上即時客服</h3>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 h-96 flex flex-col">
                {/* Chat Header */}
                <div className="bg-amber-500 text-white p-4 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <FaHeadset />
                    </div>
                    <div>
                      <p className="font-medium">TITAN客服小幫手</p>
                      <p className="text-amber-100 text-sm">線上中</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-amber-100' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="輸入您的問題..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>提示：</strong>為了更快速地為您服務，請提供您的訂單編號或具體問題描述。我們的客服團隊將盡快為您解答。
                </p>
              </div>
            </motion.div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-800">常見問題</h3>
              
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h4 className="text-md font-semibold text-amber-600 border-b border-amber-200 pb-2">
                    {category.category}
                  </h4>
                  
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    return (
                      <div key={faqIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleFaq(globalIndex)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800">{faq.q}</span>
                          {expandedFaq === globalIndex ? (
                            <FaChevronUp className="text-gray-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </button>
                        
                        {expandedFaq === globalIndex && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 pb-3 border-t border-gray-200"
                          >
                            <p className="text-gray-700 pt-3">{faq.a}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="bg-gray-100 p-6 rounded-lg text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">找不到您要的答案？</h4>
                <p className="text-gray-600 mb-6">
                  我們的專業客服團隊隨時為您提供個人化的協助與解答
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors font-medium"
                  >
                    線上客服
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
                    電話諮詢
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerServicePage; 