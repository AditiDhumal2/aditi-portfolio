import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ResearchPage = () => {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResearch();
    window.scrollTo(0, 0);
  }, []);

  const loadResearch = async () => {
    try {
      const response = await axios.get('/api/research');
      setResearch(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading research:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-20">
        <div className="text-white">Loading research...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            All <span className="text-accent">Research</span>
          </h1>
          <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 mt-3">Publications and research work</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {research.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/research/${item.slug || item._id}`} className="block group">
                <div className={`relative rounded-xl overflow-hidden bg-gray-800 border ${item.featured ? 'border-yellow-500/50' : 'border-gray-700'} hover:border-accent transition-all h-[260px]`}>
                  <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center">
                    <div className="text-5xl opacity-30">{item.featured ? '⭐' : '📄'}</div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {item.featured && (
                      <span className="inline-block bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-medium mb-2">
                        ⭐ Featured
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition line-clamp-2">
                      {item.title}
                    </h3>
                    {item.venue && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                        {item.venue} {item.year && `• ${item.year}`}
                      </p>
                    )}
                    {item.abstract && (
                      <p className="text-gray-300 text-xs mt-2 line-clamp-2">{item.abstract}</p>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-accent/90 hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                      Learn More →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {research.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            No research yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPage;