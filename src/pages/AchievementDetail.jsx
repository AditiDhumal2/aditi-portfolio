import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AchievementDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAchievement();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadAchievement = async () => {
    try {
      const response = await axios.get(`/api/achievements/slug/${slug}`);
      setAchievement(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading achievement:', error);
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
        <div className="text-white">Loading achievement...</div>
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center pt-20">
        <div className="text-white text-2xl mb-4">Achievement not found</div>
        <Link to="/achievements" className="text-accent hover:underline">← Back to Achievements</Link>
      </div>
    );
  }

  const images = achievement.images || [];

  return (
    <div className="min-h-screen bg-dark pt-24 pb-10">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/achievements')}
          className="text-gray-400 hover:text-accent transition mb-6 flex items-center gap-2"
        >
          ← Back to All Achievements
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700"
        >
          {/* Header with Icon/Image */}
          <div className="relative h-56 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            {images.length > 0 ? (
              <>
                <img 
                  src={images[currentImageIndex]} 
                  alt={achievement.title}
                  className="w-full h-full object-contain bg-gray-900"
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
              </>
            ) : (
              <div className="text-8xl">🏆</div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">{achievement.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mt-3">
              {achievement.category && (
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-500/30">
                  {achievement.category}
                </span>
              )}
              {achievement.date && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  📅 {achievement.date}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {achievement.link && (
                <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  🔗 View Details
                </a>
              )}
              {achievement.certificateLink && (
                <a href={achievement.certificateLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  📜 View Certificate
                </a>
              )}
            </div>

            {/* Description */}
            {achievement.description && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📝 Description</h2>
                <p className="text-gray-300 leading-relaxed">{achievement.description}</p>
              </div>
            )}

            {/* Images Gallery */}
            {images.length > 1 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-3">🖼️ Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt={`Achievement ${idx + 1}`} 
                      className="rounded-lg border border-gray-700 hover:scale-105 transition cursor-pointer"
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">🔗 Share this achievement:</p>
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

export default AchievementDetail;