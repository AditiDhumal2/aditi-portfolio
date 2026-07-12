import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadSkills();
  }, []);
  
  const loadSkills = async () => {
    try {
      console.log('Fetching skills...');
      const response = await axios.get('/api/skills');
      console.log('Skills loaded:', response.data);
      setSkills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading skills:', error);
      setLoading(false);
    }
  };
  
  if (loading) return null;
  
  // If no skills data, show a message
  if (!skills || Object.keys(skills).length === 0) {
    return (
      <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-accent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400">No skills added yet. Add them in the admin dashboard.</p>
        </div>
      </section>
    );
  }
  
  const skillCategories = [
    { name: "Programming Languages", key: "programming", icon: "💻", color: "text-blue-400" },
    { name: "Data Tools", key: "dataTools", icon: "📊", color: "text-green-400" },
    { name: "Machine Learning", key: "mlTools", icon: "🤖", color: "text-purple-400" },
    { name: "Databases", key: "databases", icon: "🗄️", color: "text-orange-400" },
    { name: "Web Technologies", key: "web", icon: "🌐", color: "text-pink-400" }
  ];
  
  // Only show categories that have skills
  const activeCategories = skillCategories.filter(cat => 
    skills[cat.key] && skills[cat.key].length > 0
  );
  
  if (activeCategories.length === 0) {
    return (
      <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-accent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400">No skills added yet. Add them in the admin dashboard.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="text-accent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Technologies and tools I work with to build data-driven solutions
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activeCategories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:bg-gray-800/80 transition border border-gray-700"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className={`text-xl font-semibold mb-4 ${category.color}`}>{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {skills[category.key].map(skill => (
                  <span key={skill} className="bg-dark/50 px-3 py-1.5 rounded-full text-sm text-gray-300 border border-gray-700 hover:border-accent transition">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;