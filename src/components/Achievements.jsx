import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
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
  
  if (loading) return null;
  if (achievements.length === 0) return null;
  
  // Group achievements by category
  const categories = {
    '🏆 Achievements': achievements.filter(a => a.category === '🏆 Achievements'),
    '💼 Leadership & Community': achievements.filter(a => a.category === '💼 Leadership & Community'),
    '🏅 Awards': achievements.filter(a => a.category === '🏅 Awards')
  };
  
  return (
    <section id="achievements" className="py-16 bg-gradient-to-b from-gray-900 to-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold">🏆 <span className="text-accent">Achievements</span></h2>
          <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
        </motion.div>
        
        <div className="space-y-10">
          {Object.entries(categories).map(([category, items]) => 
            items.length > 0 && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-accent mb-6 flex items-center gap-3">
                  <span className="text-3xl">{category.split(' ')[0]}</span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((ach, idx) => (
                    <motion.div
                      key={ach._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 hover:border-accent transition-all"
                    >
                      {ach.image && (
                        <div className="mb-3">
                          <img src={ach.image} alt={ach.title} className="w-full h-32 object-cover rounded-lg" />
                        </div>
                      )}
                      <div className="text-3xl mb-2">
                        {category === '🏆 Achievements' && '🏆'}
                        {category === '💼 Leadership & Community' && '👔'}
                        {category === '🏅 Awards' && '🏅'}
                      </div>
                      <h3 className="text-lg font-bold text-accent mb-1">{ach.title}</h3>
                      {ach.subcategory && <p className="text-gray-400 text-xs">{ach.subcategory}</p>}
                      <p className="text-gray-300 text-sm mt-2">{ach.description}</p>
                      {ach.date && <p className="text-gray-500 text-xs mt-2">{ach.date}</p>}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ach.certificateLink && (
                          <a href={ach.certificateLink} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline">
                            📄 Certificate
                          </a>
                        )}
                        {ach.link && (
                          <a href={ach.link} target="_blank" rel="noopener noreferrer" className="text-accent text-xs hover:underline">
                            Learn more →
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Achievements;