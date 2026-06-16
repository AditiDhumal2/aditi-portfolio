import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CertificateModal = ({ cert, onClose }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  
  if (!cert) return null;
  
  return (
    <>
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
          {/* Certificate Image Section - Horizontal Rectangle */}
          <div className="relative h-72 md:h-80 lg:h-96 bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-t-2xl overflow-hidden">
            {cert.image && cert.image !== "" ? (
              <>
                <img 
                  src={cert.image} 
                  alt={cert.name}
                  className="w-full h-full object-contain p-6 bg-gray-900"
                />
                <button
                  onClick={() => setShowFullImage(true)}
                  className="absolute bottom-4 right-4 bg-black/70 hover:bg-accent text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  View Full Certificate
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl">📜</div>
              </div>
            )}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 rounded-full p-2 text-white transition z-10"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-accent">{cert.name}</h2>
                <p className="text-gray-400 mt-1">{cert.issuer} • {cert.date}</p>
              </div>
              {/* Two separate link options */}
              <div className="flex gap-2 flex-wrap">
                {cert.certificateLink && cert.certificateLink !== "#" && (
                  <a 
                    href={cert.certificateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span>✅</span> Verify Certificate
                  </a>
                )}
                {cert.link && cert.link !== "#" && !cert.certificateLink && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span>🔗</span> View Course
                  </a>
                )}
                {cert.link && cert.link !== "#" && cert.certificateLink && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span>📚</span> View Course
                  </a>
                )}
              </div>
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
                  <code className="bg-gray-800 px-3 py-2 rounded text-sm text-gray-300 break-all">{cert.credentialId}</code>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Full Image Modal */}
      <AnimatePresence>
        {showFullImage && cert.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-8 cursor-pointer"
            onClick={() => setShowFullImage(false)}
          >
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={cert.image} 
              alt={cert.name}
              className="max-w-full max-h-full object-contain"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">📜 <span className="text-accent">Certifications</span></h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">Professional certifications that validate my skills and expertise</p>
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
                  <div className="h-48 bg-gradient-to-r from-accent/10 to-purple-500/10 relative overflow-hidden">
                    {cert.image && cert.image !== "" ? (
                      <img 
                        src={cert.image} 
                        alt={cert.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl group-hover:scale-110 transition-transform">📜</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-accent group-hover:text-blue-400 transition line-clamp-1">{cert.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{cert.issuer}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{cert.date}</span>
                      <span className="text-accent text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Explore →
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
        {selectedCert && <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
      </AnimatePresence>
    </>
  );
};

export default Certifications;