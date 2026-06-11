import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ExperienceModal = ({ exp, onClose }) => {
  if (!exp) return null;

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
        className="bg-gradient-to-br from-gray-900 to-dark border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <button onClick={onClose} className="float-right text-gray-400 hover:text-white">✕</button>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-accent">{exp.title}</h2>
            <p className="text-gray-400">{exp.company} • {exp.location}</p>
            <p className="text-sm text-gray-500">{exp.period}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">Key Achievements</h3>
              <ul className="space-y-2">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-accent mt-1">▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map(tech => (
                  <span key={tech} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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
      <section id="experience" className="py-20 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              💼 Professional <span className="text-accent">Experience</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From analytics to leadership - delivering impact through data-driven decisions
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-accent/30"></div>

            {experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-4 mb-12 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                onClick={() => setSelectedExp(exp)}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 rounded-full bg-accent mt-2"></div>
                
                {/* Content */}
                <div className={`w-full md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${
                  idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                }`}>
                  <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-accent transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-accent group-hover:text-blue-400 transition">
                          {exp.title}
                        </h3>
                        <p className="text-gray-400">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                        {exp.period}
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      {exp.achievements.slice(0, 2).map((achievement, aidx) => (
                        <p key={aidx} className="text-sm text-gray-300">
                          {achievement.substring(0, 100)}...
                        </p>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 3 && (
                        <span className="text-gray-500 text-xs">+{exp.technologies.length - 3}</span>
                      )}
                    </div>
                    
                    <button className="text-accent text-sm mt-3 hover:underline">
                      Read more →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {selectedExp && <ExperienceModal exp={selectedExp} onClose={() => setSelectedExp(null)} />}
    </>
  );
};

export default Experience;