import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
      <section id="certifications" className="py-16 bg-gradient-to-b from-dark to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold">📜 <span className="text-accent">Certifications</span></h2>
            <div className="w-16 h-0.5 bg-accent mx-auto rounded-full mt-2"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-accent transition-all h-[220px]">
                  {/* Certificate Image */}
                  <div className="w-full h-full">
                    {cert.image && cert.image !== "" ? (
                      <img 
                        src={cert.image} 
                        alt={cert.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                        <div className="text-6xl">📜</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Content overlay - bottom aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-bold text-white group-hover:text-accent transition line-clamp-2">
                      {cert.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{cert.issuer}</p>
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
      
      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCert(null)}>
            <div className="bg-dark border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedCert(null)} className="float-right text-gray-400 hover:text-white text-2xl">✕</button>
              
              <div className="mb-4">
                {selectedCert.image && (
                  <img src={selectedCert.image} alt={selectedCert.name} className="w-full max-h-64 object-contain rounded-lg mb-4" />
                )}
                <h2 className="text-2xl font-bold text-accent">{selectedCert.name}</h2>
                <p className="text-gray-400">{selectedCert.issuer} • {selectedCert.date}</p>
              </div>
              
              {selectedCert.description && (
                <p className="text-gray-300 text-sm mb-4">{selectedCert.description}</p>
              )}
              
              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-accent text-sm font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedCert.skills.map(skill => (
                      <span key={skill} className="bg-accent/20 text-accent px-2 py-0.5 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedCert.credentialId && (
                <p className="text-gray-500 text-xs">ID: {selectedCert.credentialId}</p>
              )}
              
              {selectedCert.certificateLink && selectedCert.certificateLink !== "#" && (
                <a href={selectedCert.certificateLink} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm hover:underline mt-3 inline-block">
                  ✅ Verify Certificate
                </a>
              )}
              
              {selectedCert.link && selectedCert.link !== "#" && !selectedCert.certificateLink && (
                <a href={selectedCert.link} target="_blank" rel="noopener noreferrer" className="text-accent text-sm hover:underline mt-3 inline-block">
                  📚 View Course
                </a>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certifications;