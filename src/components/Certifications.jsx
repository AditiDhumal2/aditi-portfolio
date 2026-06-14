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
        {/* Hero Image Section - Now fully visible */}
        <div className="relative h-80 bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-t-2xl overflow-hidden">
          {cert.image && cert.image !== "" ? (
            <img 
              src={cert.image} 
              alt={cert.name}
              className="w-full h-full object-contain p-4 bg-gray-900"
            />
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
                <code className="bg-gray-800 px-3 py-2 rounded text-sm text-gray-300 break-all">{cert.credentialId}</code>
              </div>
            )}
            
            {cert.validity && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                  <span>⏰</span> Validity
                </h3>
                <p className="text-gray-300">{cert.validity}</p>
              </div>
            )}
            
            {cert.grade && (
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
                  <span>📊</span> Grade / Score
                </h3>
                <p className="text-gray-300">{cert.grade}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};