import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ResearchModal = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
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
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-accent">{item.title}</h2>
            <p className="text-gray-400 mt-1">{item.authors}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">{item.type}</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{item.status}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {item.venue && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📅 Publication Venue</h3>
                <p className="text-gray-300">{item.venue} {item.year && `(${item.year})`}</p>
              </div>
            )}
            
            {item.abstract && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📝 Abstract</h3>
                <p className="text-gray-300 leading-relaxed">{item.abstract}</p>
              </div>
            )}
            
            {item.description && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📖 Description</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            )}
            
            {/* DOI Link - Clickable */}
            {item.doi && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">🔗 Digital Object Identifier (DOI)</h3>
                <a 
                  href={`https://doi.org/${item.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {item.doi}
                </a>
              </div>
            )}
            
            {/* Links Section */}
            {(item.paperLink || item.pdfLink || item.arxivLink) && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">🔗 Access Links</h3>
                <div className="flex flex-wrap gap-3">
                  {item.paperLink && (
                    <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition flex items-center gap-2">
                      📄 View Publication
                    </a>
                  )}
                  {item.pdfLink && (
                    <a href={item.pdfLink} target="_blank" rel="noopener noreferrer" className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition flex items-center gap-2">
                      📑 Download PDF
                    </a>
                  )}
                  {item.arxivLink && (
                    <a href={item.arxivLink} target="_blank" rel="noopener noreferrer" className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg transition flex items-center gap-2">
                      📚 ArXiv
                    </a>
                  )}
                </div>
              </div>
            )}
            
            {item.citations && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📊 Citations</h3>
                <p className="text-gray-300">{item.citations} citations</p>
              </div>
            )}
            
            {item.impact && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">🌟 Impact</h3>
                <p className="text-gray-300">{item.impact}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Research = () => {
  const [research, setResearch] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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
    <>
      <section id="research" className="py-20 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Research & <span className="text-accent">Publications</span></h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Academic research that demonstrates my analytical thinking and contribution to the field
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {research.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedItem(item)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-accent transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{item.type}</span>
                  <span className="text-xs text-gray-500">{item.status}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-accent group-hover:text-blue-400 transition">{item.title}</h3>
                {item.authors && <p className="text-sm text-gray-400 mb-3">{item.authors}</p>}
                {item.venue && <p className="text-xs text-gray-500 mb-3">{item.venue} {item.year && `• ${item.year}`}</p>}
                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">{item.description || item.abstract}</p>
                
                {/* Show DOI if available */}
                {item.doi && (
                  <div className="mb-3">
                    <a 
                      href={`https://doi.org/${item.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-accent text-sm hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      DOI: {item.doi}
                    </a>
                  </div>
                )}
                
                <button className="text-accent hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedItem && <ResearchModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Research;