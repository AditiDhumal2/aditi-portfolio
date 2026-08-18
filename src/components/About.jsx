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
  
  const stats = profile?.stats || {
    achievements: achievements.length,
    projects: projectsCount,
    certifications: certificationsCount,
    researchPapers: researchCount
  };
  
  const journeyPoints = profile?.journey || [
    "Passionate about turning data into actionable insights",
    "Experienced in Python, SQL, and Machine Learning",
    "Research-oriented with published papers",
    "Aiming for MSIM to create intelligent systems"
  ];
  
  const highlights = profile?.highlights || [
    "🏆 Final Year SGPA: 9.46 (Top 5% of Class)",
    "📚 Overall CGPA: 8.02",
    "🏅 Academic Excellence Award",
    "🔬 2 Research Papers Published"
  ];

  // ============ SKILLS DATA - 14 Skills with Levels ============
  const skillsData = [
    // Advanced - Your strongest skills
    { name: "Python", level: "Advanced" },
    { name: "SQL", level: "Advanced" },
    { name: "Pandas", level: "Advanced" },
    { name: "Scikit-learn", level: "Advanced" },
    { name: "Excel", level: "Advanced" },
    { name: "Data Analysis", level: "Advanced" },
    
    // Proficient - You can work independently
    { name: "JavaScript", level: "Proficient" },
    { name: "React", level: "Proficient" },
    { name: "Power BI", level: "Proficient" },
    { name: "Tableau", level: "Proficient" },
    { name: "Machine Learning", level: "Proficient" },
    { name: "Research Methodology", level: "Proficient" },
    
    // Familiar - You understand and can use
    { name: "NLP", level: "Familiar" },
    { name: "AWS", level: "Familiar" }
  ];

  // Get color based on level
  const getLevelColor = (level) => {
    switch(level) {
      case 'Advanced':
        return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
      case 'Proficient':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
      case 'Familiar':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLevelSymbol = (level) => {
    switch(level) {
      case 'Advanced':
        return '★';
      case 'Proficient':
        return '●';
      case 'Familiar':
        return '○';
      default:
        return '○';
    }
  };

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
            
            {/* Education Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🎓</div>
                <h3 className="text-xl font-bold text-accent">Education</h3>
              </div>
              <p className="text-gray-300 font-semibold">{profile?.education || 'BE in Information Technology'}</p>
              <p className="text-gray-400 text-sm mt-1">{profile?.graduation || 'Graduated in 2026'}</p>
              
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
          
          {/* Right Side - Journey & Skills */}
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
            
            {/* Key Highlights */}
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

            {/* ============ SKILLS - 14 Skills with Levels ============ */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">💪</div>
                  <h3 className="text-xl font-bold text-accent">Skills</h3>
                </div>
                <span className="text-xs text-gray-500">{skillsData.length} skills</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {skillsData.map((skill) => (
                  <motion.span 
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition hover:scale-105 cursor-default ${getLevelColor(skill.level)}`}
                  >
                    {skill.name}
                    <span className="ml-1 text-[10px] opacity-70">
                      {getLevelSymbol(skill.level)}
                    </span>
                  </motion.span>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-700/50 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">★</span> Advanced
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">●</span> Proficient
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">○</span> Familiar
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;