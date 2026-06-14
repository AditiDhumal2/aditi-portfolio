import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Certificate Image at top */}
        {cert.image && (
          <div className="p-6 border-b border-gray-200">
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full max-h-80 object-contain mx-auto"
            />
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{cert.name}</h2>
          <p className="text-gray-600 mb-4">{cert.issuer} • {cert.date}</p>
          
          {cert.description && (
            <p className="text-gray-700 mb-4">{cert.description}</p>
          )}
          
          {cert.skills && cert.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Close
            </button>
            {cert.link && cert.link !== "#" && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Certificate →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📜 Certifications</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-200"
            >
              {/* Image at top */}
              {cert.image && (
                <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.issuer}</p>
                <p className="text-gray-400 text-xs mt-1">{cert.date}</p>
                <div className="mt-3 text-blue-600 text-sm">Click to view details →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedCert && <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
    </section>
  );
};

export default Certifications;