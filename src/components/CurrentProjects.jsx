import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CurrentProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const getProgressColor = (progress) => {
    const num = parseInt(progress);
    if (num >= 75) return 'bg-green-500';
    if (num >= 50) return 'bg-yellow-500';
    if (num >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

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
          <button onClick={onClose} className="float-right text-gray-400 hover:text-white">✕</button>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-accent">{project.title}</h2>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{project.progress}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`${getProgressColor(project.progress)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: project.progress }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">📝 Overview</h3>
              <p className="text-gray-300">{project.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">✨ Key Features</h3>
              <ul className="space-y-2">
                {project.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-accent mt-1">⚡</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">🛠️ Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <span key={tech} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-accent mb-2">📅 Timeline</h3>
              <p className="text-gray-300">{project.timeline}</p>
            </div>
            
            <div className="flex gap-3 pt-4">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-accent px-4 py-2 rounded-lg transition">
                  🐙 GitHub
                </a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-accent px-4 py-2 rounded-lg transition">
                  🚀 Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CurrentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/current-projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading current projects:', error);
      setLoading(false);
    }
  };

  if (loading) return null;
  if (projects.length === 0) return null;

  return (
    <>
      <section id="building" className="py-20 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              🚀 What I'm <span className="text-accent">Currently Building</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Active projects that showcase my passion for innovation and continuous learning
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id || project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedProject(project)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-accent transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-accent group-hover:text-blue-400 transition">
                    {project.title}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-accent">
                    {project.progress}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 4).map(tech => (
                    <span key={tech} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-accent h-1.5 rounded-full transition-all duration-500"
                    style={{ width: project.progress }}
                  ></div>
                </div>
                
                <button className="text-accent text-sm mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Details →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedProject && <CurrentProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default CurrentProjects;