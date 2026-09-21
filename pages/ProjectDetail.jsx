import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProject();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/slug/${slug}`);
      setProject(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading project:', error);
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-20">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center pt-20">
        <div className="text-white text-2xl mb-4">Project not found</div>
        <Link to="/projects" className="text-accent hover:underline">← Back to Projects</Link>
      </div>
    );
  }

  const images = project.images || [];
  const features = project.features?.split(',').map(f => f.trim()).filter(Boolean) || [];
  const techStack = project.tools?.split(',').map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-dark pt-24 pb-10">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/projects')}
          className="text-gray-400 hover:text-accent transition mb-6 flex items-center gap-2"
        >
          ← Back to All Projects
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700"
        >
          {/* Image Slider */}
          {images.length > 0 && (
            <div className="relative h-72 md:h-96 bg-gray-900">
              <img 
                src={images[currentImageIndex]} 
                alt={project.title}
                className="w-full h-full object-contain"
              />
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    ◀
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    ▶
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition ${
                          currentImageIndex === idx ? 'bg-accent w-4' : 'bg-gray-500/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h1>
            {project.subtitle && (
              <p className="text-gray-400 mt-2 text-lg">{project.subtitle}</p>
            )}

            {/* Tech Stack */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {techStack.map((tech, idx) => (
                  <span key={idx} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm border border-accent/30">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {project.deployedLink && (
                <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  🌐 Live Demo
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  🐙 GitHub
                </a>
              )}
              {project.documentation?.link && (
                <a href={project.documentation.link} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  📘 Documentation
                </a>
              )}
            </div>

            {/* Overview */}
            {project.overview && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📝 Overview</h2>
                <p className="text-gray-300 leading-relaxed">{project.overview}</p>
              </div>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-3">✨ Key Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-accent mt-1">▸</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legacy fields */}
            {project.problem && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">🎯 Problem Statement</h2>
                <p className="text-gray-300">{project.problem}</p>
              </div>
            )}

            {project.methodology && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">⚙️ Methodology</h2>
                <p className="text-gray-300">{project.methodology}</p>
              </div>
            )}

            {project.results && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📈 Results</h2>
                <p className="text-gray-300">{project.results}</p>
              </div>
            )}

            {project.impact && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">🚀 Impact</h2>
                <p className="text-gray-300">{project.impact}</p>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">🔗 Share this project:</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyLink}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  {copied ? '✅ Copied!' : '📋 Copy Link'}
                </button>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0077B5] hover:bg-[#006396] text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  💼 Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;