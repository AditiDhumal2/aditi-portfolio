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
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-accent px-4 py-2 rounded-lg transition flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-accent px-4 py-2 rounded-lg transition flex items-center gap-2">
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

  // Sort by order
  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      <section id="building" className="py-16 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold">🚀 What I'm <span className="text-accent">Currently Building</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
              Active projects that showcase my passion for innovation and continuous learning
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[280px]">
                  {/* Background Image or Gradient */}
                  <div className="w-full h-full">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                        <div className="text-6xl">🚀</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Badge - Top Right */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/90 text-white">
                      {project.progress}
                    </span>
                  </div>
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Content overlay - bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies?.slice(0, 3).map(tech => (
                        <span key={tech} className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="text-gray-500 text-xs">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                    {/* Progress bar at bottom */}
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div 
                        className="bg-accent h-1 rounded-full transition-all duration-500"
                        style={{ width: project.progress }}
                      ></div>
                    </div>
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
        {selectedProject && <CurrentProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default CurrentProjects;