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
    Academic: achievements.filter(a => a.category === 'Academic'),
    Competition: achievements.filter(a => a.category === 'Competition'),
    Professional: achievements.filter(a => a.category === 'Professional'),
    Leadership: achievements.filter(a => a.category === 'Leadership'),
    Research: achievements.filter(a => a.category === 'Research')
  };
  
  return (
    <section id="achievements" className="py-20 bg-gradient-to-b from-gray-900 to-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            🏆 Achievements & <span className="text-accent">Awards</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Recognitions that highlight my dedication and excellence
          </p>
        </motion.div>
        
        <div className="space-y-12">
          {Object.entries(categories).map(([category, items]) => 
            items.length > 0 && (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-accent mb-6 flex items-center gap-3">
                  <span className="text-3xl">
                    {category === 'Academic' && '📚'}
                    {category === 'Competition' && '🏅'}
                    {category === 'Professional' && '💼'}
                    {category === 'Leadership' && '👥'}
                    {category === 'Research' && '🔬'}
                  </span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((ach, idx) => (
                    <motion.div
                      key={ach._id || ach.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-accent/10 to-transparent rounded-xl p-6 border border-gray-700 hover:border-accent transition-all"
                    >
                      <div className="text-4xl mb-3">
                        {category === 'Academic' && '🎓'}
                        {category === 'Competition' && '🏆'}
                        {category === 'Professional' && '⭐'}
                        {category === 'Leadership' && '👔'}
                        {category === 'Research' && '📖'}
                      </div>
                      <h3 className="text-xl font-bold text-accent mb-2">{ach.title}</h3>
                      <p className="text-gray-300 text-sm">{ach.description}</p>
                      {ach.date && <p className="text-gray-500 text-xs mt-2">{ach.date}</p>}
                      {ach.link && (
                        <a href={ach.link} target="_blank" rel="noopener noreferrer" className="text-accent text-sm mt-3 inline-block hover:underline">
                          Learn more →
                        </a>
                      )}
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