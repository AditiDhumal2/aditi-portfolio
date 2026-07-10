import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AchievementModal = ({ ach, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!ach) return null;
  
  // Get images array - if ach.images is array, use it, otherwise fallback to single image
  const images = ach.images && ach.images.length > 0 ? ach.images : (ach.image ? [ach.image] : []);
  const hasMultipleImages = images.length > 1;
  
  // Auto-slide effect
  useEffect(() => {
    if (!hasMultipleImages) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length, hasMultipleImages]);
  
  // Go to next/previous image
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Go to specific image
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-dark border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <button onClick={onClose} className="float-right text-gray-400 hover:text-white text-2xl">✕</button>
          
          {/* Title with Icon */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">
                {ach.category === '💼 Leadership & Community' && '👔'}
                {ach.category === '🏅 Awards' && '🏆'}
                {ach.category === '🏆 Achievements' && '🏆'}
              </span>
              <h2 className="text-2xl font-bold text-accent">{ach.title}</h2>
            </div>
            {ach.subcategory && (
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{ach.subcategory}</span>
            )}
            {ach.date && <span className="text-gray-400 text-sm ml-3">{ach.date}</span>}
          </div>
          
          {/* Image Slider */}
          {images.length > 0 && (
            <div className="mb-5 rounded-xl overflow-hidden border border-gray-700 relative">
              {/* Image Container */}
              <div className="relative w-full" style={{ minHeight: '300px', maxHeight: '500px' }}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={ach.title}
                    className="w-full h-full max-h-[500px] object-contain bg-gray-900"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows - Only show if multiple images */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                    >
                      ▶
                    </button>
                    
                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            currentImageIndex === idx ? 'bg-accent w-6' : 'bg-gray-500/50 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Image counter */}
                {hasMultipleImages && (
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Achievement Details */}
          <div className="space-y-4">
            {ach.description && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                  <span>📝</span> Achievement Details
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{ach.description}</p>
              </div>
            )}
            
            {/* Links Section */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-700">
              {ach.certificateLink && (
                <a 
                  href={ach.certificateLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition flex items-center gap-2"
                >
                  <span>📄</span> View Certificate
                </a>
              )}
              {ach.link && (
                <a 
                  href={ach.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-accent hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition flex items-center gap-2"
                >
                  <span>🔗</span> Learn More
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [selectedAch, setSelectedAch] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAchievements();
  }, []);
  
  const loadAchievements = async () => {
    try {
      const response = await axios.get('/api/achievements');
      setAchievements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading achievements:', error);
      setLoading(false);
    }
  };
  
  if (loading) return (
    <section id="achievements" className="py-16 bg-gradient-to-b from-gray-900 to-dark">
      <div className="container mx-auto px-6 text-center">
        <div className="animate-pulse text-gray-400">Loading achievements...</div>
      </div>
    </section>
  );
  
  // Filter achievements by category
  const leadershipItems = achievements.filter(a => 
    a.category === '💼 Leadership & Community' || 
    a.category === 'Leadership' || 
    a.category === 'Community Service' ||
    a.category === 'Volunteer' ||
    a.category === 'Event Coordination'
  );
  
  const awardsItems = achievements.filter(a => 
    a.category === '🏅 Awards' || 
    a.category === 'Award' || 
    a.category === 'Recognition' ||
    a.category === 'Scholarship'
  );
  
  const getFilteredAchievements = () => {
    switch(activeTab) {
      case 'leadership':
        return leadershipItems;
      case 'awards':
        return awardsItems;
      default:
        return achievements;
    }
  };
  
  const filteredAchievements = getFilteredAchievements();
  
  const tabs = [
    { id: 'all', label: 'All', icon: '📋', count: achievements.length },
    { id: 'leadership', label: 'Leadership & Community', icon: '👔', count: leadershipItems.length },
    { id: 'awards', label: 'Awards & Recognition', icon: '🏆', count: awardsItems.length }
  ];
  
  return (
    <>
      <section id="achievements" className="py-16 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold">🏆 <span className="text-accent">Achievements</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
          </motion.div>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg transition flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Achievements Grid */}
          {filteredAchievements.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No achievements in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((ach, idx) => (
                <motion.div
                  key={ach._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedAch(ach)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[240px]">
                    {/* Show first image as preview */}
                    {ach.images && ach.images.length > 0 ? (
                      <img 
                        src={ach.images[0]} 
                        alt={ach.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : ach.image ? (
                      <img 
                        src={ach.image} 
                        alt={ach.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center">
                        <div className="text-6xl">
                          {ach.category === '💼 Leadership & Community' && '👔'}
                          {ach.category === '🏅 Awards' && '🏆'}
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-base font-bold text-white group-hover:text-accent transition line-clamp-2">
                        {ach.title}
                      </h3>
                      {ach.date && (
                        <p className="text-gray-500 text-xs">{ach.date}</p>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-accent/90 hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transform transition-transform group-hover:scale-105 shadow-lg">
                        Learn More →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <AnimatePresence>
        {selectedAch && <AchievementModal ach={selectedAch} onClose={() => setSelectedAch(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Achievements;