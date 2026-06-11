import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ============ IN-MEMORY DATABASE ============
const db = {
  profile: {
    name: 'Aditi',
    photo: '',
    graduation: 'Graduated in 2026',
    title: 'Information Technology Student specializing in Data Analytics & Intelligent Systems',
    subtitle: 'Building data-driven solutions and research-backed systems for real-world impact',
    education: 'BE in Information Technology',
    interests: 'Data Analytics + AI Systems',
    description: "I'm a passionate IT student with a strong research mindset, aiming to solve real-world problems through data.",
    stats: { achievements: 6, projects: 3, certifications: 4, researchPapers: 2 },
    journey: [
      "Passionate about turning data into actionable insights",
      "Experienced in Python, SQL, and Machine Learning",
      "Research-oriented with 2 published papers",
      "Aiming for MSIM to create intelligent systems"
    ]
  },
  projects: [
    { _id: 1, title: "AI-Powered Academic Chatbot", problem: "Students struggle to get instant answers", tools: "Python, Hugging Face, FAISS", results: "87% accuracy, 300+ users", impact: "Reduced response time by 75%", featured: true },
    { _id: 2, title: "Food Waste Analytics Dashboard", problem: "Restaurants waste 30% of food", tools: "Python, Tableau, SQL", results: "Reduced waste by 23%", impact: "Saved $45k annually", featured: true },
    { _id: 3, title: "Real-time Sales Analytics Dashboard", problem: "No real-time visibility", tools: "Python, Power BI, SQL", results: "15% efficiency increase", impact: "Adopted by 3 retail chains", featured: true }
  ],
  experience: [
    { _id: 1, title: "Data Analyst Intern", company: "Tech Solutions Inc.", period: "June 2024 - Aug 2024", achievements: ["Analyzed 50,000+ transactions", "Built Tableau dashboards"], technologies: ["Python", "SQL", "Tableau"] },
    { _id: 2, title: "MERN Stack Developer Intern", company: "WebCraft Innovations", period: "Jan 2024 - Apr 2024", achievements: ["Built full-stack apps", "Optimized API responses"], technologies: ["React", "Node.js", "MongoDB"] }
  ],
  currentProjects: [
    { _id: 1, title: "Career Intelligence Platform", description: "AI-powered job market analysis", progress: "70%", technologies: ["Python", "React", "MongoDB"] }
  ],
  research: [
    { _id: 1, title: "Optimizing Food Supply Chains", type: "Conference Paper", status: "Under Review", description: "LSTM-XGBoost model reduces error by 32%" }
  ],
  certifications: [
    { _id: 1, name: "Google Data Analytics", issuer: "Google", date: "2024", skills: ["SQL", "Tableau", "R"] }
  ],
  achievements: [
    { _id: 1, title: "CGPA: 9.2/10", description: "Top 5% of class", category: "Academic" }
  ],
  skills: {
    programming: ["Python", "SQL", "JavaScript", "R"],
    dataTools: ["Pandas", "Tableau", "Power BI"],
    mlTools: ["Scikit-learn", "TensorFlow"],
    databases: ["PostgreSQL", "MySQL", "MongoDB"],
    web: ["React", "Flask", "Streamlit"]
  },
  contact: {
    linkedin: "https://linkedin.com/in/yourusername",
    github: "https://github.com/yourusername",
    email: "your.email@university.edu",
    resume: ""
  }
};

let counters = { projects: 4, experience: 3, currentProjects: 2, research: 2, certifications: 2, achievements: 2 };

// Profile Routes
app.get('/api/profile', (req, res) => res.json(db.profile));
app.put('/api/profile', (req, res) => { db.profile = { ...db.profile, ...req.body }; res.json(db.profile); });

// Projects Routes
app.get('/api/projects', (req, res) => res.json(db.projects));
app.post('/api/projects', (req, res) => { const newProject = { ...req.body, _id: counters.projects++ }; db.projects.push(newProject); res.json(newProject); });
app.put('/api/projects/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.projects.findIndex(p => p._id === id); if (idx !== -1) { db.projects[idx] = { ...db.projects[idx], ...req.body }; res.json(db.projects[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/projects/:id', (req, res) => { const id = parseInt(req.params.id); db.projects = db.projects.filter(p => p._id !== id); res.json({ message: 'Deleted' }); });

// Experience Routes
app.get('/api/experience', (req, res) => res.json(db.experience));
app.post('/api/experience', (req, res) => { const newExp = { ...req.body, _id: counters.experience++ }; db.experience.push(newExp); res.json(newExp); });
app.put('/api/experience/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.experience.findIndex(e => e._id === id); if (idx !== -1) { db.experience[idx] = { ...db.experience[idx], ...req.body }; res.json(db.experience[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/experience/:id', (req, res) => { const id = parseInt(req.params.id); db.experience = db.experience.filter(e => e._id !== id); res.json({ message: 'Deleted' }); });

// Current Projects Routes
app.get('/api/current-projects', (req, res) => res.json(db.currentProjects));
app.post('/api/current-projects', (req, res) => { const newProject = { ...req.body, _id: counters.currentProjects++ }; db.currentProjects.push(newProject); res.json(newProject); });
app.put('/api/current-projects/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.currentProjects.findIndex(p => p._id === id); if (idx !== -1) { db.currentProjects[idx] = { ...db.currentProjects[idx], ...req.body }; res.json(db.currentProjects[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/current-projects/:id', (req, res) => { const id = parseInt(req.params.id); db.currentProjects = db.currentProjects.filter(p => p._id !== id); res.json({ message: 'Deleted' }); });

// Research Routes
app.get('/api/research', (req, res) => res.json(db.research));
app.post('/api/research', (req, res) => { const newResearch = { ...req.body, _id: counters.research++ }; db.research.push(newResearch); res.json(newResearch); });
app.put('/api/research/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.research.findIndex(r => r._id === id); if (idx !== -1) { db.research[idx] = { ...db.research[idx], ...req.body }; res.json(db.research[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/research/:id', (req, res) => { const id = parseInt(req.params.id); db.research = db.research.filter(r => r._id !== id); res.json({ message: 'Deleted' }); });

// Certifications Routes
app.get('/api/certifications', (req, res) => res.json(db.certifications));
app.post('/api/certifications', (req, res) => { const newCert = { ...req.body, _id: counters.certifications++ }; db.certifications.push(newCert); res.json(newCert); });
app.put('/api/certifications/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.certifications.findIndex(c => c._id === id); if (idx !== -1) { db.certifications[idx] = { ...db.certifications[idx], ...req.body }; res.json(db.certifications[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/certifications/:id', (req, res) => { const id = parseInt(req.params.id); db.certifications = db.certifications.filter(c => c._id !== id); res.json({ message: 'Deleted' }); });

// Achievements Routes
app.get('/api/achievements', (req, res) => res.json(db.achievements));
app.post('/api/achievements', (req, res) => { const newAchievement = { ...req.body, _id: counters.achievements++ }; db.achievements.push(newAchievement); res.json(newAchievement); });
app.put('/api/achievements/:id', (req, res) => { const id = parseInt(req.params.id); const idx = db.achievements.findIndex(a => a._id === id); if (idx !== -1) { db.achievements[idx] = { ...db.achievements[idx], ...req.body }; res.json(db.achievements[idx]); } else { res.status(404).json({ error: 'Not found' }); } });
app.delete('/api/achievements/:id', (req, res) => { const id = parseInt(req.params.id); db.achievements = db.achievements.filter(a => a._id !== id); res.json({ message: 'Deleted' }); });

// Skills Routes
app.get('/api/skills', (req, res) => res.json(db.skills));
app.put('/api/skills', (req, res) => { db.skills = { ...db.skills, ...req.body }; res.json(db.skills); });

// Contact Routes
app.get('/api/contact', (req, res) => res.json(db.contact));
app.put('/api/contact', (req, res) => { db.contact = { ...db.contact, ...req.body }; res.json(db.contact); });

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 ========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💾 Using IN-MEMORY database (No MongoDB needed)`);
  console.log(`✅ Your portfolio is ready to use!`);
  console.log(`🚀 ========================================\n`);
});