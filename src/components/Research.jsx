import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Research = () => {
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadResearch();
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
  
  if (loading) return null;
  if (research.length === 0) return null;
  
  return (
    <section id="research" className="py-20 bg-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-center">Research & <span className="text-accent">Publications</span></h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Academic research that demonstrates my analytical thinking and contribution to the field
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {research.map((item, idx) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-dark rounded-xl p-6 border border-gray-800 hover:border-accent/50 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{item.type}</span>
                <span className="text-xs text-gray-500">{item.status}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-accent">{item.title}</h3>
              {item.authors && <p className="text-sm text-gray-400 mb-3">{item.authors}</p>}
              {item.venue && <p className="text-xs text-gray-500 mb-3">{item.venue} • {item.year}</p>}
              <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>
              {item.paperLink && (
                <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">
                  Read Paper →
                </a>
              )}
              {item.doi && <p className="text-xs text-gray-500 mt-2">DOI: {item.doi}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Research;