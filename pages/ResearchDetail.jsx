import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ResearchDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadResearch();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadResearch = async () => {
    try {
      const response = await axios.get(`/api/research/slug/${slug}`);
      setResearch(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading research:', error);
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
        <div className="text-white">Loading research...</div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center pt-20">
        <div className="text-white text-2xl mb-4">Research not found</div>
        <Link to="/research" className="text-accent hover:underline">← Back to Research</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-24 pb-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <button 
          onClick={() => navigate('/research')}
          className="text-gray-400 hover:text-accent transition mb-6 flex items-center gap-2"
        >
          ← Back to All Research
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700"
        >
          {/* Header with Image */}
          <div className="relative h-56 bg-gradient-to-r from-accent/20 to-purple-500/20 flex items-center justify-center">
            {research.image ? (
              <img src={research.image} alt={research.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl">📚</div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {/* Title & Meta */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">{research.title}</h1>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm border border-accent/30">
                {research.type || 'Research'}
              </span>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                {research.status || 'Published'}
              </span>
              {research.year && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  📅 {research.year}
                </span>
              )}
            </div>

            {research.authors && (
              <p className="text-gray-400 mt-3">
                <span className="font-semibold">Authors:</span> {research.authors}
              </p>
            )}
            {research.venue && (
              <p className="text-gray-400">
                <span className="font-semibold">Venue:</span> {research.venue}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {research.paperLink && (
                <a href={research.paperLink} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  📄 View Paper
                </a>
              )}
              {research.pdfLink && (
                <a href={research.pdfLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  📑 Download PDF
                </a>
              )}
              {research.arxivLink && (
                <a href={research.arxivLink} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  📚 ArXiv
                </a>
              )}
              {research.doi && (
                <a href={`https://doi.org/${research.doi}`} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition font-medium">
                  🔗 DOI
                </a>
              )}
            </div>

            {/* Theme */}
            {research.theme && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📌 Research Focus</h2>
                <p className="text-gray-300">{research.theme}</p>
              </div>
            )}

            {/* Abstract */}
            {research.abstract && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📝 Abstract</h2>
                <p className="text-gray-300 leading-relaxed">{research.abstract}</p>
              </div>
            )}

            {/* Key Contributions */}
            {research.description && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-3">💡 Key Contributions</h2>
                <ul className="space-y-2">
                  {research.description.split('\n').map((line, idx) => (
                    line.trim() && (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-accent mt-1">▸</span>
                        <span>{line}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {/* Impact */}
            {research.impact && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                  <h2 className="text-lg font-semibold text-blue-400 mb-2">🔥 Impact</h2>
                  <p className="text-gray-300 leading-relaxed">{research.impact}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {research.skills && research.skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-3">🛠️ Skills Used</h2>
                <div className="flex flex-wrap gap-2">
                  {research.skills.map(skill => (
                    <span key={skill} className="bg-accent/20 text-accent px-3 py-1.5 rounded-full text-sm border border-accent/30">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citations */}
            {research.citations && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h2 className="text-lg font-semibold text-accent mb-2">📊 Citations</h2>
                <p className="text-gray-300">{research.citations} citations</p>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">🔗 Share this research:</p>
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

export default ResearchDetail;