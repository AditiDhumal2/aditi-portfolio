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
            {item.theme && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📌 Research Focus</h3>
                <p className="text-gray-300">{item.theme}</p>
              </div>
            )}
            
            {item.abstract && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📝 Overview</h3>
                <p className="text-gray-300 leading-relaxed">{item.abstract}</p>
              </div>
            )}
            
            {item.description && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">💡 Key Contributions</h3>
                <ul className="space-y-1">
                  {item.description.split('\n').map((line, idx) => (
                    line.trim() && (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-accent mt-1">▹</span>
                        <span>{line}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
            
            {item.impact && (
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">🔥 Impact</h3>
                <p className="text-gray-300 leading-relaxed">{item.impact}</p>
              </div>
            )}
            
            {item.skills && item.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">🛠️ Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map(skill => (
                    <span key={skill} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {item.venue && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">📅 Publication</h3>
                <p className="text-gray-300">{item.venue} {item.year && `(${item.year})`}</p>
              </div>
            )}
            
            {item.doi && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-1">🔗 DOI</h3>
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
            
            <div className="flex flex-wrap gap-3 pt-2">
              {item.paperLink && (
                <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
                  📄 View Research
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
  
  // Featured Research (Mentorly)
  const featuredPaper = sortedResearch.find(r => r.featured === true);
  const previousResearch = sortedResearch.filter(r => r.featured !== true);
  
  // Research Snapshot Stats
  const totalPublications = research.length;
  const years = ['2022', '2024', '2025', '2026'];
  const domains = ['AI', 'Information Systems', 'Analytics', 'Computer Vision'];
  
  return (
    <section id="research" className="py-20 bg-gradient-to-b from-dark to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">📚 <span className="text-accent">Research</span></h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Exploring AI, Analytics, Information Systems, and Decision Support through Applied Research
          </p>
          <p className="text-gray-400 text-sm mt-2 max-w-3xl">
            Over the past four years, I have transformed academic projects into research publications, allowing me to develop skills in 
            literature review, research methodology, system evaluation, technical writing, and communicating engineering solutions 
            through scholarly work. My research interests have gradually evolved from software engineering to AI, analytics, and 
            information systems.
          </p>
        </motion.div>
        
        {/* Featured Research */}
        {featuredPaper && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              <span>⭐</span> Featured Research
            </h3>
            <div 
              onClick={() => setSelectedItem(featuredPaper)}
              className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-2 border-yellow-500/30 rounded-2xl p-6 cursor-pointer hover:scale-[1.01] transition-all group"
            >
              <h4 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition">
                {featuredPaper.title}
              </h4>
              <p className="text-gray-300 mt-2">
                <span className="font-semibold">Role:</span> {featuredPaper.authors || 'First Author'}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-3">
                {featuredPaper.paperLink && (
                  <span className="text-sm text-gray-400">📄 Research Square Preprint</span>
                )}
                {featuredPaper.status && (
                  <span className="text-sm text-yellow-400">🔄 {featuredPaper.status}</span>
                )}
              </div>
              
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-accent mb-2">Research Focus</h5>
                <p className="text-gray-300 text-sm">{featuredPaper.abstract || 'No abstract available'}</p>
              </div>
              
              {featuredPaper.description && (
                <div className="mt-3">
                  <h5 className="text-sm font-semibold text-accent mb-2">Key Contributions</h5>
                  <ul className="space-y-1">
                    {featuredPaper.description.split('\n').map((line, idx) => (
                      line.trim() && (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-accent mt-1">▹</span>
                          <span>{line}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
              
              {featuredPaper.skills && featuredPaper.skills.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-semibold text-accent mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {featuredPaper.skills.map(skill => (
                      <span key={skill} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="text-yellow-400 hover:underline mt-4 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                📄 View Research →
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Previous Research */}
        {previousResearch.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-accent mb-6">Previous Research</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousResearch.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-accent transition-all cursor-pointer group"
                >
                  <h4 className="text-lg font-bold text-white group-hover:text-accent transition">
                    {item.title}
                  </h4>
                  
                  {item.venue && (
                    <p className="text-sm text-gray-400 mt-1">
                      {item.venue} • {item.year || ''}
                    </p>
                  )}
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">{item.abstract || item.description?.substring(0, 100)}...</p>
                  </div>
                  
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                      {item.skills.length > 3 && (
                        <span className="text-gray-500 text-xs">+{item.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <button className="text-accent text-sm mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Research Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-accent mb-4">📊 Research Snapshot</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Publications</p>
              <p className="text-2xl font-bold text-white">{totalPublications}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Years</p>
              <p className="text-2xl font-bold text-white">2022–2026</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Primary Domains</p>
              <p className="text-sm font-semibold text-white">AI, Information Systems, Analytics</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Featured Research</p>
              <p className="text-sm font-semibold text-yellow-400">Mentorly Decision Support</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {selectedItem && <ResearchModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Research;