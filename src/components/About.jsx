import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [certificationsCount, setCertificationsCount] = useState(0);
  const [researchCount, setResearchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [profileData, achievementsData, projectsData, certificationsData, researchData] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/achievements'),
        axios.get('/api/projects'),
        axios.get('/api/certifications'),
        axios.get('/api/research')
      ]);
      console.log('Profile data:', profileData.data); // Debug log
      setProfile(profileData.data);
      setAchievements(achievementsData.data);
      setProjectsCount(projectsData.data.length);
      setCertificationsCount(certificationsData.data.length);
      setResearchCount(researchData.data.length);
      setLoading(false);
    } catch (error) {
      console.error('Error loading about data:', error);
      setLoading(false);
    }
  };
  
  if (loading) return null;
  
  // Get stats from profile or calculate dynamically
  const stats = profile?.stats || {
    achievements: achievements.length,
    projects: projectsCount,
    certifications: certificationsCount,
    researchPapers: researchCount
  };
  
  // Get journey from profile or use default
  const journeyPoints = profile?.journey || [
    "Passionate about turning data into actionable insights",
    "Experienced in Python, SQL, and Machine Learning",
    "Research-oriented with published papers",
    "Aiming for MSIM to create intelligent systems"
  ];
  
  // Get highlights from profile
  const highlights = profile?.highlights || [
    "🏆 Final Year SGPA: 9.46 (Top 5% of Class)",
    "📚 Overall CGPA: 8.02",
    "🏅 Academic Excellence Award",
    "🔬 2 Research Papers Published"
  ];
  
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-dark to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get to know <span className="text-accent">About Me</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Stats & Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Profile Summary Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
                  {profile?.photo ? (
                    <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-accent">{profile?.name || 'Aditi Dhumal'}</h3>
                  <p className="text-gray-400">{profile?.interests || 'Data Analytics + AI Systems'}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {profile?.description || ''}
              </p>
            </div>
            
            {/* Education Card with SGPA and CGPA */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🎓</div>
                <h3 className="text-xl font-bold text-accent">Education</h3>
              </div>
              <p className="text-gray-300 font-semibold">{profile?.education || 'BE in Information Technology'}</p>
              <p className="text-gray-400 text-sm mt-1">{profile?.graduation || 'Graduated in 2026'}</p>
              
              {/* SGPA and CGPA Display */}
              {(profile?.sgpa || profile?.cgpa) && (
                <div className="mt-3 bg-accent/10 border border-accent/30 rounded-lg p-3">
                  <p className="text-accent font-semibold text-sm">🏆 Academic Excellence</p>
                  {profile?.sgpa && (
                    <p className="text-gray-300 text-sm mt-1">
                      Final Year SGPA: <span className="text-accent font-bold">{profile.sgpa}</span> 
                      {profile.sgpa.includes('9.46') && <span className="text-green-400 text-xs ml-2">(Top 5% of Class)</span>}
                    </p>
                  )}
                  {profile?.cgpa && (
                    <p className="text-gray-400 text-xs mt-1">Overall CGPA: {profile.cgpa}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-center border border-gray-700 hover:border-accent transition">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-accent">{stats.achievements}</div>
                <div className="text-sm text-gray-400">Achievements</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-center border border-gray-700 hover:border-accent transition">
                <div className="text-3xl mb-2">💻</div>
                <div className="text-2xl font-bold text-accent">{stats.projects}</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-center border border-gray-700 hover:border-accent transition">
                <div className="text-3xl mb-2">📜</div>
                <div className="text-2xl font-bold text-accent">{stats.certifications}</div>
                <div className="text-sm text-gray-400">Certifications</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 text-center border border-gray-700 hover:border-accent transition">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-bold text-accent">{stats.researchPapers}</div>
                <div className="text-sm text-gray-400">Research Papers</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Side - Journey & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* My Journey */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🚀</div>
                <h3 className="text-xl font-bold text-accent">My Journey</h3>
              </div>
              <div className="space-y-4">
                {journeyPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3 group">
                    <div className="text-accent mt-1 group-hover:translate-x-1 transition">➤</div>
                    <p className="text-gray-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Key Highlights - Controlled by Admin */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">⭐</div>
                <h3 className="text-xl font-bold text-accent">Key Highlights</h3>
              </div>
              <div className="space-y-3">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="text-accent mt-1 group-hover:scale-110 transition">✓</div>
                    <p className="text-gray-300 text-sm">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;