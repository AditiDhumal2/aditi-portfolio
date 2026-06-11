import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  
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
        className="bg-gradient-to-br from-gray-900 to-dark border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-64 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
          {project.image && project.image !== "" ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl">📊</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition z-10"
          >
            ✕
          </button>
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tools?.split(',').map((tool, idx) => (
                <span key={idx} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">
                  {tool.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Problem Statement */}
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
              <span>🎯</span> Problem Statement
            </h3>
            <p className="text-gray-300 leading-relaxed">{project.problem}</p>
          </div>
          
          {/* Dataset */}
          {project.dataset && (
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                <span>📊</span> Dataset Used
              </h3>
              <p className="text-gray-300">{project.dataset}</p>
            </div>
          )}
          
          {/* Approach / Methodology */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2">
              <span>⚙️</span> Approach & Methodology
            </h3>
            <p className="text-gray-300">{project.methodology}</p>
          </div>
          
          {/* Tech Stack */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
              <span>🛠️</span> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools?.split(',').map((tool, idx) => (
                <span key={idx} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {tool.trim()}
                </span>
              ))}
            </div>
          </div>
          
          {/* Results / Insights */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
              <span>📈</span> Results & Insights
            </h3>
            <p className="text-gray-300">{project.results}</p>
          </div>
          
          {/* Impact */}
          {project.impact && (
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
                <span>🚀</span> Real-World Impact
              </h3>
              <p className="text-gray-300">{project.impact}</p>
            </div>
          )}
          
          {/* GitHub Link */}
          {(project.githubLink || project.deployedLink) && (
            <div className="flex gap-4 pt-4">
              {project.githubLink && (
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-700 hover:bg-accent text-white px-6 py-3 rounded-lg transition"
                >
                  <span>🐙</span> GitHub
                </a>
              )}
              {project.deployedLink && (
                <a 
                  href={project.deployedLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-700 hover:bg-accent text-white px-6 py-3 rounded-lg transition"
                >
                  <span>🚀</span> Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };
  
  if (loading) return null;
  
  const featuredProjects = projects.filter(p => p.featured !== false);
  
  return (
    <>
      <section id="projects" className="py-20 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-accent">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Each project follows a research-style structure: Problem → Approach → Results → Impact
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project._id || project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-accent transition-all cursor-pointer group"
              >
                {/* Project Image */}
                <div className="h-48 overflow-hidden relative">
                  {project.image && project.image !== "" ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                      <div className="text-6xl">📊</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition">
                    {project.title}
                  </h3>
                  
                  {/* Problem Preview */}
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    🎯 {project.problem?.substring(0, 100)}...
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tools?.split(',').slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                        {tool.trim()}
                      </span>
                    ))}
                  </div>
                  
                  {/* Results Preview */}
                  {project.results && (
                    <p className="text-green-400 text-xs mb-3">
                      📈 {project.results.substring(0, 60)}...
                    </p>
                  )}
                  
                  <button className="text-accent hover:underline text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Full Project →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;