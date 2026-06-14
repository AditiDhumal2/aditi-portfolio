import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;
  
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
        {/* Certificate Image - Clear and prominent */}
        {cert.image && cert.image !== "" ? (
          <div className="relative">
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full max-h-80 object-contain bg-gray-800 p-4 rounded-t-2xl"
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white transition z-10"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-t-2xl flex items-center justify-center">
            <div className="text-8xl">📜</div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 text-white transition"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-accent">{cert.name}</h2>
              <p className="text-gray-400 mt-1">
                {cert.issuer} • {cert.date}
              </p>
            </div>
            {cert.link && cert.link !== "#" && (
              <a 
                href={cert.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <span>🔗</span> View Course
              </a>
            )}
          </div>
          
          <div className="space-y-6">
            {cert.description && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                  <span>📝</span> About this Certification
                </h3>
                <p className="text-gray-300 leading-relaxed">{cert.description}</p>
              </div>
            )}
            
            {cert.skills && cert.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-3 flex items-center gap-2">
                  <span>🛠️</span> Skills Gained
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, idx) => (
                    <span key={idx} className="bg-accent/20 text-accent px-3 py-1.5 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {cert.credentialId && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                  <span>🔑</span> Credential ID
                </h3>
                <code className="bg-gray-800 px-3 py-2 rounded text-sm text-gray-300">{cert.credentialId}</code>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCertifications();
  }, []);
  
  const loadCertifications = async () => {
    try {
      const response = await axios.get('/api/certifications');
      setCertifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading certifications:', error);
      setLoading(false);
    }
  };
  
  if (loading) return null;
  if (certifications.length === 0) return null;
  
  return (
    <>
      <section id="certifications" className="py-20 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              📜 <span className="text-accent">Certifications</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional certifications that validate my skills and expertise
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer"
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-accent transition-all duration-300 h-full">
                  {/* Card Image - Clear and visible */}
                  <div className="h-48 overflow-hidden bg-gray-700">
                    {cert.image && cert.image !== "" ? (
                      <img 
                        src={cert.image} 
                        alt={cert.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl group-hover:scale-110 transition-transform">📜</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-accent group-hover:text-blue-400 transition line-clamp-1">
                      {cert.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{cert.issuer}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{cert.date}</span>
                      <span className="text-accent text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Explore <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <AnimatePresence>
        {selectedCert && (
          <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;