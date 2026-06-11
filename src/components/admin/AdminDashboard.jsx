import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AboutTab from './AboutTab';
import ExperienceTab from './ExperienceTab';
import ProjectsTab from './ProjectsTab';
import CurrentProjectsTab from './CurrentProjectsTab';
import ResearchTab from './ResearchTab';
import CertificationsTab from './CertificationsTab';
import AchievementsTab from './AchievementsTab';
import SkillsTab from './SkillsTab';
import ContactTab from './ContactTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [research, setResearch] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [skills, setSkills] = useState({});
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchAllData = async () => {
    try {
      const [profileRes, projectsRes, experienceRes, currentProjectsRes, researchRes, certsRes, achievementsRes, skillsRes, contactRes] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/projects'),
        axios.get('/api/experience'),
        axios.get('/api/current-projects'),
        axios.get('/api/research'),
        axios.get('/api/certifications'),
        axios.get('/api/achievements'),
        axios.get('/api/skills'),
        axios.get('/api/contact')
      ]);
      setProfile(profileRes.data);
      setProjects(projectsRes.data);
      setExperience(experienceRes.data);
      setCurrentProjects(currentProjectsRes.data);
      setResearch(researchRes.data);
      setCertifications(certsRes.data);
      setAchievements(achievementsRes.data);
      setSkills(skillsRes.data);
      setContact(contactRes.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'about', name: '📝 About / Profile', component: AboutTab },
    { id: 'experience', name: '💼 Experience', component: ExperienceTab },
    { id: 'projects', name: '📊 Projects', component: ProjectsTab },
    { id: 'currentProjects', name: '🚀 Current Projects', component: CurrentProjectsTab },
    { id: 'research', name: '📚 Research', component: ResearchTab },
    { id: 'certifications', name: '📜 Certifications', component: CertificationsTab },
    { id: 'achievements', name: '🏆 Achievements', component: AchievementsTab },
    { id: 'skills', name: '💻 Skills', component: SkillsTab },
    { id: 'contact', name: '📧 Contact', component: ContactTab }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-dark text-white pt-20">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">Manage all your portfolio content</p>
        
        {message && (
          <div className={`fixed top-24 right-6 z-50 px-4 py-2 rounded-lg shadow-lg ${
            message.includes('❌') ? 'bg-red-500' : 'bg-green-500'
          } text-white`}>
            {message}
          </div>
        )}
        
        {uploading && (
          <div className="fixed top-24 right-6 z-50 px-4 py-2 rounded-lg shadow-lg bg-blue-500 text-white">
            ⬆️ Uploading...
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id ? 'bg-accent text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        {ActiveComponent && (
          <ActiveComponent
            profile={profile}
            setProfile={setProfile}
            projects={projects}
            setProjects={setProjects}
            experience={experience}
            setExperience={setExperience}
            currentProjects={currentProjects}
            setCurrentProjects={setCurrentProjects}
            research={research}
            setResearch={setResearch}
            certifications={certifications}
            setCertifications={setCertifications}
            achievements={achievements}
            setAchievements={setAchievements}
            skills={skills}
            setSkills={setSkills}
            contact={contact}
            setContact={setContact}
            showMessage={showMessage}
            uploading={uploading}
            setUploading={setUploading}
            fetchAllData={fetchAllData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;