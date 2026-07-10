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
          
          {/* Image at top of modal */}
          {item.image && (
            <div className="mb-4">
              <img src={item.image} alt={item.title} className="w-full max-h-56 object-cover rounded-lg" />
            </div>
          )}
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-accent">{item.title}</h2>
            <p className="text-gray-400 mt-1">
              <span className="font-semibold">Role:</span> {item.authors || 'Not specified'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">{item.type}</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">{item.status}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Research Area */}
            {item.theme && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📌 Research Area</h3>
                <p className="text-gray-300">{item.theme}</p>
              </div>
            )}
            
            {/* Overview / Abstract */}
            {item.abstract && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📝 Overview</h3>
                <p className="text-gray-300 leading-relaxed">{item.abstract}</p>
              </div>
            )}
            
            {/* Contribution */}
            {item.description && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">💡 Contribution</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            )}
            
            {/* Impact */}
            {item.impact && (
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">🔥 Impact</h3>
                <p className="text-gray-300 leading-relaxed">{item.impact}</p>
              </div>
            )}
            
            {/* Skills/Technologies */}
            {item.skills && item.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">🛠️ Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map(skill => (
                    <span key={skill} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Venue */}
            {item.venue && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📅 Publication Venue</h3>
                <p className="text-gray-300">{item.venue} {item.year && `(${item.year})`}</p>
              </div>
            )}
            
            {/* DOI Link */}
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
            <div className="flex flex-wrap gap-3 pt-2">
              {item.paperLink && (
                <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                  📄 Read Paper
                </a>
              )}
              {item.pdfLink && (
                <a href={item.pdfLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                  📑 Download PDF
                </a>
              )}
              {item.arxivLink && (
                <a href={item.arxivLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                  📚 ArXiv
                </a>
              )}
              {item.projectLink && (
                <a href={item.projectLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                  💻 View Project
                </a>
              )}
            </div>
            
            {item.citations && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📊 Citations</h3>
                <p className="text-gray-300">{item.citations} citations</p>
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
  
  // Sort by order
  const sortedResearch = [...research].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Featured Research
  const featuredPaper = sortedResearch.find(r => r.featured === true);
  const otherPapers = sortedResearch.filter(r => r.featured !== true);
  
  return (
    <>
      <section id="research" className="py-16 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold">📚 <span className="text-accent">Research & Publications</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Demonstrates academic curiosity and research potential
            </p>
          </motion.div>
          
          {/* Featured Research */}
          {featuredPaper && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="text-center mb-4">
                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full text-sm font-semibold">
                  ⭐ Featured Research
                </span>
              </div>
              <div 
                onClick={() => setSelectedItem(featuredPaper)}
                className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-6 cursor-pointer hover:scale-[1.01] transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {featuredPaper.image && (
                    <div className="md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={featuredPaper.image} alt={featuredPaper.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition">
                      {featuredPaper.title}
                    </h3>
                    <p className="text-gray-300 mt-1">
                      <span className="font-semibold">Role:</span> {featuredPaper.authors || 'Not specified'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">{featuredPaper.type}</span>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">{featuredPaper.status}</span>
                      {featuredPaper.venue && (
                        <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">{featuredPaper.venue}</span>
                      )}
                    </div>
                    {featuredPaper.abstract && (
                      <p className="text-gray-400 mt-3 text-sm line-clamp-2">{featuredPaper.abstract}</p>
                    )}
                    <button className="text-yellow-400 hover:underline mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Research Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPapers.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[320px]">
                  {/* Image */}
                  <div className="w-full h-40 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                        <div className="text-5xl">📚</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Content overlay - bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex flex-wrap gap-1 mb-1">
                      <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded">{item.type}</span>
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">{item.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-accent transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      <span className="font-semibold">Role:</span> {item.authors || 'Not specified'}
                    </p>
                    {item.venue && (
                      <p className="text-gray-500 text-xs mt-1">{item.venue} {item.year && `• ${item.year}`}</p>
                    )}
                  </div>
                  
                  {/* Learn More - appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-accent/90 hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transform transition-transform group-hover:scale-105 shadow-lg">
                      Learn More →
                    </div>
                  </div>
                </div>
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