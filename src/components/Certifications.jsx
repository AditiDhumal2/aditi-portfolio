import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Certificate Image */}
        {cert.image && (
          <div className="bg-white p-8">
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full rounded-lg shadow-lg border border-gray-200"
            />
          </div>
        )}
        
        {/* Certificate Details */}
        <div className="p-8 border-t border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{cert.name}</h2>
            <p className="text-gray-600 text-lg">{cert.issuer}</p>
            <p className="text-gray-500">Completed: {cert.date}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 mb-4">{cert.description}</p>
            
            {cert.skills && cert.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Skills Covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Close
              </button>
              {cert.link && cert.link !== "#" && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Verify Certificate →
                </a>
              )}
            </div>
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
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📜 Certifications</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Professional certifications that validate my skills</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-1"
            >
              {/* Certificate Image */}
              <div className="h-56 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                {cert.image ? (
                  <img 
                    src={cert.image} 
                    alt={cert.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-2">📜</div>
                    <p className="text-gray-400 text-sm">Certificate Image</p>
                  </div>
                )}
              </div>
              
              {/* Certificate Info */}
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">{cert.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">{cert.date}</p>
                  <span className="text-blue-600 text-sm font-medium">View Details →</span>
                </div>
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