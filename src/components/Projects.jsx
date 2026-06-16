import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProjectModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!project) return null;
  
  // Dynamically determine which tabs to show
  const hasGallery = project.images && project.images.length > 0;
  const hasDocumentation = project.documentation?.title || project.documentation?.link;
  const hasPreprint = project.preprint?.title || project.preprint?.doi || project.preprint?.link;
  const hasPublication = project.publication?.title || project.publication?.doi || project.publication?.link;
  const hasTechnical = project.methodology || project.tools || project.challenges || project.futureWork;
  
  const tabs = [
    { id: 'overview', name: '📋 Overview', show: true },
    { id: 'technical', name: '⚙️ Technical', show: hasTechnical },
    { id: 'gallery', name: '🖼️ Gallery', show: hasGallery },
    { id: 'documentation', name: '📄 Documentation', show: hasDocumentation },
    { id: 'preprint', name: '📑 Preprint', show: hasPreprint },
    { id: 'publication', name: '📖 Publication', show: hasPublication },
  ].filter(tab => tab.show);
  
  // Set default active tab to first available
  React.useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [project]);
  
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
        className="bg-gradient-to-br from-gray-900 to-dark border border-gray-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
          {project.images && project.images.length > 0 ? (
            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl">📊</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition z-10">✕</button>
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tools?.split(',').map((tool, idx) => (
                <span key={idx} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs">{tool.trim()}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-700">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-accent text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {project.deployedLink && (
            <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-accent text-white px-4 py-2 rounded-lg transition flex items-center gap-2">
              🚀 Live Demo
            </a>
          )}
        </div>
        
        {/* Tabs - Only show tabs with data */}
        {tabs.length > 1 && (
          <div className="flex flex-wrap border-b border-gray-700 px-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-bold text-red-400 mb-2">🎯 Problem Statement</h3>
                <p className="text-gray-300">{project.problem}</p>
              </div>
              {project.dataset && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">📊 Dataset</h3>
                  <p className="text-gray-300">{project.dataset}</p>
                </div>
              )}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">📈 Results</h3>
                <p className="text-gray-300">{project.results}</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-bold text-orange-400 mb-2">🚀 Impact</h3>
                <p className="text-gray-300">{project.impact}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'technical' && (
            <div className="space-y-5">
              {project.methodology && (
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-bold text-green-400 mb-2">⚙️ Methodology</h3>
                  <p className="text-gray-300">{project.methodology}</p>
                </div>
              )}
              {project.tools && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">🛠️ Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.split(',').map((tool, idx) => (
                      <span key={idx} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{tool.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {project.challenges && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">⚠️ Challenges</h3>
                  <p className="text-gray-300">{project.challenges}</p>
                </div>
              )}
              {project.futureWork && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">🔮 Future Work</h3>
                  <p className="text-gray-300">{project.futureWork}</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'gallery' && project.images && project.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Screenshot ${idx + 1}`} className="rounded-lg border border-gray-700 hover:scale-105 transition cursor-pointer" onClick={() => window.open(img, '_blank')} />
              ))}
            </div>
          )}
          
          {activeTab === 'documentation' && (
            <div className="space-y-4">
              {project.documentation?.title && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">📄 {project.documentation.title}</h3>
                  {project.documentation.description && <p className="text-gray-300 mb-3">{project.documentation.description}</p>}
                  {project.documentation.link && (
                    <a href={project.documentation.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-block">
                      📄 View Documentation →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'preprint' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-blue-400 mb-2">📑 Preprint</h3>
                {project.preprint?.title && <p className="text-gray-300 font-medium mb-1">{project.preprint.title}</p>}
                {project.preprint?.doi && <p className="text-sm text-gray-400">DOI: {project.preprint.doi}</p>}
                {project.preprint?.link && (
                  <a href={project.preprint.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm mt-2 inline-block">
                    Read Preprint →
                  </a>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'publication' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-bold text-green-400 mb-2">📖 Published Paper</h3>
                {project.publication?.title && <p className="text-gray-300 font-medium mb-1">{project.publication.title}</p>}
                {project.publication?.conference && <p className="text-sm text-gray-400">{project.publication.conference}</p>}
                {project.publication?.doi && <p className="text-sm text-gray-400">DOI: {project.publication.doi}</p>}
                {project.publication?.link && (
                  <a href={project.publication.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm mt-2 inline-block">
                    View Publication →
                  </a>
                )}
              </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-accent">Projects</span></h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">Each project follows a research-style structure: Problem → Approach → Results → Impact</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-accent transition-all cursor-pointer group"
              >
                <div className="h-48 overflow-hidden relative">
                  {project.images && project.images[0] ? (
                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                      <div className="text-6xl">📊</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">🎯 {project.problem?.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tools?.split(',').slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">{tool.trim()}</span>
                    ))}
                  </div>
                  {project.results && <p className="text-green-400 text-xs mb-3">📈 {project.results.substring(0, 60)}...</p>}
                  <button className="text-accent hover:underline text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Full Project →</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Projects;