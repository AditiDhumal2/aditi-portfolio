import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ OPTIMIZATION MIDDLEWARE ============
// Enable compression (reduces file sizes by 60-80%)
app.use(compression());

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============ MONGODB CONNECTION with Optimizations ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aditidhumal704_db_user:kaqJeBFcCKabk2k6@cluster0.1iqtkir.mongodb.net/aditi_portfolio?retryWrites=true&w=majority&appName=Cluster0';

console.log('📡 Connecting to MongoDB Atlas...');

// Connection options for faster connection
const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 1,
  family: 4, // Force IPv4
};

mongoose.connect(MONGODB_URI, connectionOptions)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ============ SCHEMAS ============
// Profile Schema
const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Aditi Dhumal' },
  photo: { type: String, default: '' },
  graduation: { type: String, default: '' },
  title: { type: String, default: 'Information Technology Student specializing in Data Analytics & Intelligent Systems' },
  subtitle: { type: String, default: 'Building data-driven solutions and research-backed systems for real-world impact' },
  education: { type: String, default: 'BE in Information Technology' },
  interests: { type: String, default: 'Data Analytics + AI Systems' },
  description: { type: String, default: '' },
  sgpa: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  stats: {
    achievements: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    researchPapers: { type: Number, default: 0 }
  },
  journey: [{ type: String }],
  highlights: [{ type: String }]
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problem: { type: String, default: '' },
  dataset: { type: String, default: '' },
  methodology: { type: String, default: '' },
  tools: { type: String, default: '' },
  results: { type: String, default: '' },
  impact: { type: String, default: '' },
  images: [{ type: String }],
  githubLink: { type: String, default: '' },
  deployedLink: { type: String, default: '' },
  documentation: {
    title: { type: String, default: '' },
    link: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  preprint: {
    title: { type: String, default: '' },
    doi: { type: String, default: '' },
    link: { type: String, default: '' }
  },
  publication: {
    title: { type: String, default: '' },
    doi: { type: String, default: '' },
    link: { type: String, default: '' },
    conference: { type: String, default: '' }
  },
  challenges: { type: String, default: '' },
  futureWork: { type: String, default: '' },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  period: { type: String, default: '' },
  type: { type: String, default: 'Internship' },
  roleDescription: { type: String, default: '' },
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  image: { type: String, default: '' },
  certificateLink: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Current Project Schema
const currentProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  progress: { type: String, default: '0%' },
  features: [{ type: String }],
  technologies: [{ type: String }],
  timeline: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Research Schema
const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Conference Paper' },
  status: { type: String, default: 'Submitted' },
  description: { type: String, default: '' },
  abstract: { type: String, default: '' },
  authors: { type: String, default: '' },
  venue: { type: String, default: '' },
  year: { type: String, default: '' },
  paperLink: { type: String, default: '' },
  pdfLink: { type: String, default: '' },
  arxivLink: { type: String, default: '' },
  doi: { type: String, default: '' },
  citations: { type: String, default: '' },
  impact: { type: String, default: '' },
  theme: { type: String, default: 'Information Systems' },
  featured: { type: Boolean, default: false },
  image: { type: String, default: '' },
  skills: [{ type: String }],
  projectLink: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Certification Schema
const certificationSchema = new mongoose.Schema({
  name: { type: String, default: 'New Certification' },
  issuer: { type: String, default: 'Unknown Issuer' },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  link: { type: String, default: '' },
  certificateLink: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  validity: { type: String, default: '' },
  grade: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: '💼 Leadership & Community' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
  images: [{ type: String }],
  certificateLink: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Skills Schema
const skillsSchema = new mongoose.Schema({
  programming: [{ type: String }],
  dataTools: [{ type: String }],
  mlTools: [{ type: String }],
  databases: [{ type: String }],
  web: [{ type: String }]
}, { timestamps: true });

// Contact Schema
const contactSchema = new mongoose.Schema({
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' },
  email: { type: String, default: '' },
  resume: { type: String, default: '' }
}, { timestamps: true });

// ============ MODELS ============
const Profile = mongoose.model('Profile', profileSchema);
const Project = mongoose.model('Project', projectSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const CurrentProject = mongoose.model('CurrentProject', currentProjectSchema);
const Research = mongoose.model('Research', researchSchema);
const Certification = mongoose.model('Certification', certificationSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const Skills = mongoose.model('Skills', skillsSchema);
const Contact = mongoose.model('Contact', contactSchema);

// ============ SEED INITIAL DATA ============
async function seedInitialData() {
  try {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log('🌱 Seeding initial data...');
      
      await Profile.create({
        name: 'Aditi Dhumal',
        title: 'Information Technology Student specializing in Data Analytics & Intelligent Systems',
        subtitle: 'Building data-driven solutions and research-backed systems for real-world impact',
        education: 'BE in Information Technology',
        interests: 'Data Analytics + AI Systems',
        description: "I'm a passionate IT student with a strong research mindset, aiming to solve real-world problems through data.",
        sgpa: '9.46',
        cgpa: '8.02',
        stats: { achievements: 6, projects: 3, certifications: 4, researchPapers: 2 },
        journey: [
          "Passionate about turning data into actionable insights",
          "Experienced in Python, SQL, and Machine Learning",
          "Research-oriented with 2 published papers",
          "Aiming for MSIM to create intelligent systems"
        ],
        highlights: [
          "🏆 Final Year SGPA: 9.46 (Top 5% of Class)",
          "📚 Overall CGPA: 8.02",
          "🏅 Academic Excellence Award",
          "🔬 2 Research Papers Published"
        ]
      });
      
      await Skills.create({
        programming: ['Python', 'SQL', 'JavaScript', 'R'],
        dataTools: ['Pandas', 'Tableau', 'Power BI'],
        mlTools: ['Scikit-learn', 'TensorFlow'],
        databases: ['PostgreSQL', 'MySQL', 'MongoDB'],
        web: ['React', 'Flask', 'Streamlit']
      });
      
      await Contact.create({
        linkedin: 'https://linkedin.com/in/yourusername',
        github: 'https://github.com/yourusername',
        email: 'your.email@university.edu'
      });
      
      console.log('✅ Initial data seeded!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// ============ TEST ENDPOINT ============
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// ============ PROFILE ROUTES ============
app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ name: 'Aditi Dhumal' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = await Profile.create(req.body);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROJECTS ROUTES ============
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ EXPERIENCE ROUTES ============
app.get('/api/experience', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experience', async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experience/:id', async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CURRENT PROJECTS ROUTES ============
app.get('/api/current-projects', async (req, res) => {
  try {
    const projects = await CurrentProject.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/current-projects', async (req, res) => {
  try {
    const project = await CurrentProject.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/current-projects/:id', async (req, res) => {
  try {
    const project = await CurrentProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/current-projects/:id', async (req, res) => {
  try {
    await CurrentProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RESEARCH ROUTES ============
app.get('/api/research', async (req, res) => {
  try {
    const research = await Research.find().sort({ order: 1, year: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/research', async (req, res) => {
  try {
    const research = await Research.create(req.body);
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/research/:id', async (req, res) => {
  try {
    const research = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/research/:id', async (req, res) => {
  try {
    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CERTIFICATIONS ROUTES ============
app.get('/api/certifications', async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1, date: -1 });
    console.log(`📜 Found ${certs.length} certifications`);
    res.json(certs);
  } catch (error) {
    console.error('GET certifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/certifications', async (req, res) => {
  try {
    console.log('📝 Creating certification with data:', req.body);
    
    const certData = {
      name: req.body.name || 'New Certification',
      issuer: req.body.issuer || 'Unknown Issuer',
      date: req.body.date || new Date().getFullYear().toString(),
      image: req.body.image || '',
      description: req.body.description || '',
      skills: req.body.skills || [],
      link: req.body.link || '',
      certificateLink: req.body.certificateLink || '',
      credentialId: req.body.credentialId || '',
      validity: req.body.validity || '',
      grade: req.body.grade || '',
      order: req.body.order || 0
    };
    
    const cert = await Certification.create(certData);
    console.log('✅ Certification created:', cert._id);
    res.json(cert);
  } catch (error) {
    console.error('❌ POST certification error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.put('/api/certifications/:id', async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: false }
    );
    if (!cert) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json(cert);
  } catch (error) {
    console.error('PUT certification error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certifications/:id', async (req, res) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ error: 'Certification not found' });
    }
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('DELETE certification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for certifications
app.post('/api/certifications-test', async (req, res) => {
  try {
    const cert = await Certification.create({
      name: "Test Certification",
      issuer: "Test Issuer",
      date: "2024",
      skills: ["Test Skill"]
    });
    res.json({ success: true, cert });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ACHIEVEMENTS ROUTES ============
app.get('/api/achievements', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/achievements/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SKILLS ROUTES ============
app.get('/api/skills', async (req, res) => {
  try {
    let skills = await Skills.findOne();
    if (!skills) {
      skills = await Skills.create({
        programming: ['Python', 'SQL', 'JavaScript', 'R'],
        dataTools: ['Pandas', 'Tableau', 'Power BI'],
        mlTools: ['Scikit-learn', 'TensorFlow'],
        databases: ['PostgreSQL', 'MySQL', 'MongoDB'],
        web: ['React', 'Flask', 'Streamlit']
      });
    }
    res.json(skills);
  } catch (error) {
    console.error('GET skills error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills', async (req, res) => {
  try {
    let skills = await Skills.findOne();
    if (skills) {
      Object.assign(skills, req.body);
      await skills.save();
    } else {
      skills = await Skills.create(req.body);
    }
    res.json(skills);
  } catch (error) {
    console.error('PUT skills error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ CONTACT ROUTES ============
app.get('/api/contact', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contact', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (contact) {
      Object.assign(contact, req.body);
      await contact.save();
    } else {
      contact = await Contact.create(req.body);
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ENDPOINT ============
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ============ SERVE STATIC FILES (Production) ============
if (process.env.NODE_ENV === 'production') {
  // Cache static files for faster loading
  app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d',
    etag: true,
    lastModified: true,
  }));
  
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'), {
      maxAge: '1d',
    });
  });
}

// ============ START SERVER ============
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`✅ Portfolio ready!`);
  
  await seedInitialData();
});