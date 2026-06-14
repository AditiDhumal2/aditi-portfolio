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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate Image - Clean and prominent */}
        <div className="relative">
          {cert.image && cert.image !== "" ? (
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full rounded-t-2xl"
            />
          ) : (
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl flex items-center justify-center">
              <div className="text-8xl">📜</div>
            </div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl transition z-10"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{cert.name}</h2>
          <p className="text-gray-600 mb-4">{cert.issuer} • {cert.date}</p>
          
          {cert.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">About this Certification</h3>
              <p className="text-gray-600">{cert.description}</p>
            </div>
          )}
          
          {cert.skills && cert.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Skills Gained</h3>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {cert.link && cert.link !== "#" && (
            <a 
              href={cert.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              View Certificate →
            </a>
          )}
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
      <section id="certifications" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              📜 Certifications
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCert(cert)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200"
              >
                {/* Certificate Image */}
                <div className="h-48 overflow-hidden bg-gray-100">
                  {cert.image && cert.image !== "" ? (
                    <img 
                      src={cert.image} 
                      alt={cert.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">📜</div>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {cert.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{cert.issuer}</p>
                  <p className="text-gray-400 text-xs">{cert.date}</p>
                  <div className="mt-3">
                    <span className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1">
                      View Details →
                    </span>
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