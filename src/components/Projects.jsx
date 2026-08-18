import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ============================================
// SIMPLIFIED PROJECT MODAL - Trailer Philosophy
// ============================================
const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!project) return null;
  
  const images = project.images && project.images.length > 0 ? project.images : [];
  const hasMultipleImages = images.length > 1;
  
  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, hasMultipleImages]);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  
  const techStack = project.tools?.split(',').map(t => t.trim()).filter(Boolean) || [];
  const features = project.features?.split(',').map(f => f.trim()).filter(Boolean) || [];
  
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
        {/* Image Slider */}
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={images[currentImageIndex]} 
                    alt={project.title}
                    className="w-full h-full object-contain bg-gray-900"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                    >
                      ▶
                    </button>
                    
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                          className={`w-2.5 h-2.5 rounded-full transition ${
                            currentImageIndex === idx ? 'bg-accent w-6' : 'bg-gray-500/50 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">📊</div>
            </div>
          )}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition z-10"
          >
            ✕
          </button>
        </div>
        
        {/* Title & Subtitle */}
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h2>
          {project.subtitle && (
            <p className="text-gray-400 text-sm md:text-base mt-1">{project.subtitle}</p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-700">
          {project.deployedLink && (
            <a 
              href={project.deployedLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              🌐 Live Demo
            </a>
          )}
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          {project.documentation?.link && (
            <a 
              href={project.documentation.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              📘 Documentation
            </a>
          )}
        </div>
        
        {/* Overview */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📝 Overview</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {project.overview || project.problem || "A data-driven project solving real-world problems."}
          </p>
        </div>
        
        {/* Key Features */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">✨ Key Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {features.length > 0 ? (
              features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  {feature}
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  Data-driven insights
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  Machine learning models
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  Interactive visualizations
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  Real-time analytics
                </li>
              </>
            )}
          </ul>
        </div>
        
        {/* Tech Stack */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">🛠 Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.length > 0 ? (
              techStack.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-medium border border-accent/30"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No tech stack specified</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// CURRENT PROJECT DETAILS MODAL - For Current Projects
// ============================================
const CurrentProjectModal = ({ project, onClose }) => {
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
        {/* Header with Icon */}
        <div className="relative h-48 md:h-56 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl flex items-center justify-center">
          <div className="text-7xl md:text-8xl">🔨</div>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition z-10"
          >
            ✕
          </button>
        </div>
        
        {/* Title */}
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h2>
          {project.timeline && (
            <p className="text-gray-400 text-sm mt-1">📅 {project.timeline}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📝 Description</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {project.description || "A project I'm currently building."}
          </p>
        </div>
        
        {/* Progress */}
        {project.progress && (
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">📊 Progress</h3>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Completion</span>
              <span className="text-accent font-bold">{project.progress}</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-1000"
                style={{ width: project.progress }}
              />
            </div>
          </div>
        )}
        
        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">✨ Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-0.5">▸</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="p-5 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">🛠 Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="bg-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-medium border border-accent/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Links */}
        {(project.githubLink || project.demoLink) && (
          <div className="p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">🔗 Links</h3>
            <div className="flex flex-wrap gap-3">
              {project.githubLink && (
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  🐙 GitHub
                </a>
              )}
              {project.demoLink && (
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  🚀 Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ============================================
// CURRENT PROJECTS SUBSECTION - With "Learn More" Hover
// ============================================
const CurrentProjectsSubsection = ({ projects, onProjectClick }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          🔨 <span className="text-accent">Currently Building</span>
        </h3>
        <div className="w-16 h-0.5 bg-accent/50 mx-auto rounded-full mt-2"></div>
        <p className="text-gray-400 text-sm mt-2">Active projects I'm working on right now</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group cursor-pointer"
            onClick={() => onProjectClick(project)}
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[220px]">
              {/* Background gradient */}
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-500/10 flex items-center justify-center">
                <div className="text-5xl opacity-50">🔨</div>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="text-lg font-bold text-white group-hover:text-accent transition line-clamp-1">
                  {project.title}
                </h4>
                <p className="text-gray-300 text-sm line-clamp-2 mt-1">
                  {project.description}
                </p>
                
                {/* Progress Bar - Compact */}
                {project.progress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                      <span>Progress</span>
                      <span className="text-accent font-semibold">{project.progress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: project.progress }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Tech Stack Tags - Compact */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech, tIdx) => (
                      <span key={tIdx} className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px]">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-gray-500 text-[10px]">+{project.technologies.length - 3}</span>
                    )}
                  </div>
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
    </div>
  );
};

// ============================================
// MAIN PROJECTS COMPONENT
// ============================================
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCurrentProject, setSelectedCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [projectsRes, currentRes] = await Promise.all([
        axios.get('/api/projects'),
        axios.get('/api/current-projects')
      ]);
      setProjects(projectsRes.data);
      setCurrentProjects(currentRes.data);
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
      <section id="projects" className="py-16 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold">My <span className="text-accent">Projects</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4"
            >
              <div className="relative inline-block">
                <div className="absolute -top-4 -left-4 text-3xl text-accent/20">"</div>
                <div className="absolute -bottom-4 -right-4 text-3xl text-accent/20">"</div>
                <p className="text-lg md:text-xl font-light text-gray-300 px-4">
                  <span className="text-accent font-medium">From Ideas</span> to{' '}
                  <span className="text-accent font-medium">Impactful Solutions</span>
                </p>
                <div className="w-16 h-0.5 bg-accent/50 mx-auto rounded-full mt-2"></div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[280px]">
                  <div className="w-full h-full">
                    {project.images && project.images.length > 0 ? (
                      <img 
                        src={project.images[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                        <div className="text-6xl">📊</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition line-clamp-2">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-gray-300 text-sm line-clamp-1 mt-1">{project.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-accent/90 hover:bg-accent text-white px-6 py-3 rounded-lg font-semibold transform transition-transform group-hover:scale-105 shadow-lg">
                      Learn More →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current Projects Subsection */}
          <CurrentProjectsSubsection 
            projects={currentProjects} 
            onProjectClick={setSelectedCurrentProject}
          />
        </div>
      </section>
      
      {/* Featured Project Modal */}
      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
      
      {/* Current Project Modal - Detailed View */}
      <AnimatePresence>
        {selectedCurrentProject && (
          <CurrentProjectModal 
            project={selectedCurrentProject} 
            onClose={() => setSelectedCurrentProject(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;