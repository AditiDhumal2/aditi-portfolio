import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    try {
      const response = await axios.get('/api/experience');
      setExperience(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading experience:', error);
      setLoading(false);
    }
  };

  if (loading) return null;
  if (experience.length === 0) return null;

  return (
    <>
      <section id="experience" className="py-16 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold">💼 <span className="text-accent">Experience</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {experience.map((exp, idx) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedExp(exp)}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[220px]">
                  {/* Background Image or Gradient */}
                  <div className="w-full h-full">
                    {exp.image && exp.image !== "" ? (
                      <img 
                        src={exp.image} 
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                        <div className="text-6xl">💼</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Content overlay - bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition line-clamp-1">
                      {exp.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{exp.company}</p>
                    <p className="text-gray-500 text-xs">{exp.period}</p>
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
      
      {/* Experience Modal */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedExp(null)}>
            <div className="bg-dark border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedExp(null)} className="float-right text-gray-400 hover:text-white text-2xl">✕</button>
              
              {/* Company Image/Logo */}
              {selectedExp.image && (
                <div className="mb-4">
                  <img src={selectedExp.image} alt={selectedExp.company} className="w-full max-h-48 object-contain rounded-lg" />
                </div>
              )}
              
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-accent">{selectedExp.title}</h2>
                <p className="text-gray-400 text-lg">{selectedExp.company}</p>
                <p className="text-gray-500 text-sm">{selectedExp.location} • {selectedExp.period}</p>
                <span className="inline-block bg-accent/20 text-accent text-xs px-2 py-1 rounded mt-1">{selectedExp.type}</span>
              </div>
              
              {/* Job Role Description */}
              {selectedExp.roleDescription && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-accent mb-2">📋 Role Overview</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedExp.roleDescription}</p>
                </div>
              )}
              
              {/* Achievements */}
              {selectedExp.achievements && selectedExp.achievements.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-accent mb-2">🏆 Key Achievements</h3>
                  <ul className="space-y-2">
                    {selectedExp.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-accent mt-1">▹</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Technologies */}
              {selectedExp.technologies && selectedExp.technologies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">🛠️ Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.technologies.map(tech => (
                      <span key={tech} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Certificate / Offer Letter Link */}
              {selectedExp.certificateLink && selectedExp.certificateLink !== "#" && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <a href={selectedExp.certificateLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition">
                    📄 View Certificate / Offer Letter
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Experience;