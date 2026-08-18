import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ============================================
// RESEARCH MODAL - Similar to Project Modal
// ============================================
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
        {/* Header with Image or Gradient */}
        <div className="relative h-48 md:h-56 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-t-2xl" />
          ) : (
            <div className="text-7xl md:text-8xl">📚</div>
          )}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition z-10"
          >
            ✕
          </button>
        </div>
        
        {/* Title & Metadata */}
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-accent">{item.title}</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/30">
              {item.type || 'Research'}
            </span>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
              {item.status || 'Published'}
            </span>
            {item.year && (
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                📅 {item.year}
              </span>
            )}
          </div>
          {item.authors && (
            <p className="text-gray-400 text-sm mt-2">
              <span className="font-semibold">Authors:</span> {item.authors}
            </p>
          )}
          {item.venue && (
            <p className="text-gray-400 text-sm">
              <span className="font-semibold">Venue:</span> {item.venue}
            </p>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Theme / Research Focus */}
          {item.theme && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📌 Research Focus</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.theme}</p>
            </div>
          )}
          
          {/* Abstract / Overview */}
          {item.abstract && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📝 Overview</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.abstract}</p>
            </div>
          )}
          
          {/* Description / Key Contributions */}
          {item.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">💡 Key Contributions</h3>
              <ul className="space-y-1">
                {item.description.split('\n').map((line, idx) => (
                  line.trim() && (
                    <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-accent mt-1">▸</span>
                      <span>{line}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
          
          {/* Impact */}
          {item.impact && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">🔥 Impact</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{item.impact}</p>
            </div>
          )}
          
          {/* Skills */}
          {item.skills && item.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">🛠️ Skills</h3>
              <div className="flex flex-wrap gap-2">
                {item.skills.map(skill => (
                  <span key={skill} className="bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-medium border border-accent/30">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* DOI */}
          {item.doi && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">🔗 DOI</h3>
              <a 
                href={`https://doi.org/${item.doi}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm break-all"
              >
                {item.doi}
              </a>
            </div>
          )}
          
          {/* Citations */}
          {item.citations && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📊 Citations</h3>
              <p className="text-gray-300 text-sm">{item.citations} citations</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-700">
            {item.paperLink && (
              <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                📄 View Research
              </a>
            )}
            {item.pdfLink && (
              <a href={item.pdfLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                📑 Download PDF
              </a>
            )}
            {item.arxivLink && (
              <a href={item.arxivLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                📚 ArXiv
              </a>
            )}
            {item.projectLink && (
              <a href={item.projectLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                💻 View Project
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// RESEARCH COMPONENT - Similar hover effect as Projects
// ============================================
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
  const previousResearch = sortedResearch.filter(r => r.featured !== true);
  
  // Research Snapshot Stats
  const totalPublications = research.length;
  
  return (
    <section id="research" className="py-20 bg-gradient-to-b from-dark to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            📚 <span className="text-accent">Research</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Exploring AI, Analytics, Information Systems, and Decision Support through Applied Research
          </p>
          <p className="text-gray-400 text-sm mt-2 max-w-3xl mx-auto">
            Over the past four years, I have transformed academic projects into research publications, allowing me to develop skills in 
            literature review, research methodology, system evaluation, technical writing, and communicating engineering solutions 
            through scholarly work.
          </p>
        </motion.div>
        
        {/* Featured Research - Similar to Projects Learn More */}
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
            
            <motion.div
              className="group cursor-pointer"
              onClick={() => setSelectedItem(featuredPaper)}
            >
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 hover:border-yellow-400 transition-all h-[320px]">
                {/* Background */}
                <div className="w-full h-full bg-gradient-to-br from-yellow-500/5 to-orange-500/5 flex items-center justify-center">
                  <div className="text-6xl opacity-20">⭐</div>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-medium">
                      Featured
                    </span>
                    {featuredPaper.status && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-medium">
                        {featuredPaper.status}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition line-clamp-2">
                    {featuredPaper.title}
                  </h4>
                  
                  {featuredPaper.authors && (
                    <p className="text-gray-300 text-sm mt-1 line-clamp-1">
                      <span className="font-semibold">Authors:</span> {featuredPaper.authors}
                    </p>
                  )}
                  
                  {featuredPaper.venue && (
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {featuredPaper.venue} {featuredPaper.year && `(${featuredPaper.year})`}
                    </p>
                  )}
                  
                  {featuredPaper.abstract && (
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {featuredPaper.abstract}
                    </p>
                  )}
                  
                  {/* Skills Tags */}
                  {featuredPaper.skills && featuredPaper.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {featuredPaper.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px]">
                          {skill}
                        </span>
                      ))}
                      {featuredPaper.skills.length > 3 && (
                        <span className="text-gray-500 text-[10px]">+{featuredPaper.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Hover Overlay - "Learn More →" */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-yellow-500/90 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transform transition-transform group-hover:scale-105 shadow-lg">
                    Learn More →
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Previous Research Grid - Same style as Projects */}
        {previousResearch.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-accent mb-6">Previous Research</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousResearch.map((item, idx) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[220px]">
                    {/* Background gradient */}
                    <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center">
                      <div className="text-5xl opacity-30">📄</div>
                    </div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-accent transition line-clamp-1">
                        {item.title}
                      </h4>
                      
                      {item.venue && (
                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                          {item.venue} {item.year && `• ${item.year}`}
                        </p>
                      )}
                      
                      {item.abstract && (
                        <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                          {item.abstract}
                        </p>
                      )}
                      
                      {/* Skills Tags */}
                      {item.skills && item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px]">
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 3 && (
                            <span className="text-gray-500 text-[10px]">+{item.skills.length - 3}</span>
                          )}
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      {item.type && (
                        <span className="inline-block bg-accent/20 text-accent px-2 py-0.5 rounded text-[10px] mt-1">
                          {item.type}
                        </span>
                      )}
                    </div>
                    
                    {/* Hover Overlay - "Learn More →" */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-accent/90 hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transform transition-transform group-hover:scale-105 shadow-lg">
                        Learn More →
                      </div>
                    </div>
                  </div>
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
              <p className="text-sm font-semibold text-yellow-400 line-clamp-1">
                {featuredPaper?.title || 'Mentorly Decision Support'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Research Modal */}
      <AnimatePresence>
        {selectedItem && <ResearchModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Research;