import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// ============ SCHEMAS ============
const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Aditi' },
  photo: { type: String, default: '' },
  graduation: { type: String, default: '' },
  title: { type: String, default: 'Information Technology Student specializing in Data Analytics & Intelligent Systems' },
  subtitle: { type: String, default: 'Building data-driven solutions and research-backed systems for real-world impact' },
  education: { type: String, default: 'BE in Information Technology' },
  interests: { type: String, default: 'Data Analytics + AI Systems' },
  description: { type: String, default: '' },
  stats: {
    achievements: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    certifications: { type: Number, default: 0 },
    researchPapers: { type: Number, default: 0 }
  },
  journey: [{ type: String }]
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problem: { type: String, default: '' },
  dataset: { type: String, default: '' },
  methodology: { type: String, default: '' },
  tools: { type: String, default: '' },
  results: { type: String, default: '' },
  impact: { type: String, default: '' },
  image: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  deployedLink: { type: String, default: '' },
  featured: { type: Boolean, default: true }
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  period: { type: String, default: '' },
  type: { type: String, default: 'Internship' },
  achievements: [{ type: String }],
  technologies: [{ type: String }]
});

const currentProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  progress: { type: String, default: '0%' },
  features: [{ type: String }],
  technologies: [{ type: String }],
  timeline: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' }
});

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Conference Paper' },
  status: { type: String, default: 'Submitted' },
  description: { type: String, default: '' },
  authors: { type: String, default: '' },
  venue: { type: String, default: '' },
  year: { type: String, default: '' },
  paperLink: { type: String, default: '' }
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  skills: [{ type: String }],
  link: { type: String, default: '' },
  credentialId: { type: String, default: '' }
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Academic' },
  date: { type: String, default: '' }
});

const skillsSchema = new mongoose.Schema({
  programming: [{ type: String }],
  dataTools: [{ type: String }],
  mlTools: [{ type: String }],
  databases: [{ type: String }],
  web: [{ type: String }]
});

const contactSchema = new mongoose.Schema({
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  instagram: { type: String, default: '' },
  email: { type: String, default: '' },
  resume: { type: String, default: '' }
});

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
        name: 'Aditi',
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

// Connect to MongoDB
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
    await seedInitialData();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
}

// ============ ROUTES ============
app.get('/api/health', async (req, res) => {
  await connectToDatabase();
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/profile', async (req, res) => {
  await connectToDatabase();
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({ name: 'Aditi' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile', async (req, res) => {
  await connectToDatabase();
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

app.get('/api/projects', async (req, res) => {
  await connectToDatabase();
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  await connectToDatabase();
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/experience', async (req, res) => {
  await connectToDatabase();
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experience', async (req, res) => {
  await connectToDatabase();
  try {
    const exp = await Experience.create(req.body);
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experience/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experience/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/current-projects', async (req, res) => {
  await connectToDatabase();
  try {
    const projects = await CurrentProject.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/current-projects', async (req, res) => {
  await connectToDatabase();
  try {
    const project = await CurrentProject.create(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/current-projects/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const project = await CurrentProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/current-projects/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await CurrentProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/research', async (req, res) => {
  await connectToDatabase();
  try {
    const research = await Research.find().sort({ year: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/research', async (req, res) => {
  await connectToDatabase();
  try {
    const research = await Research.create(req.body);
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/research/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const research = await Research.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/research/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/certifications', async (req, res) => {
  await connectToDatabase();
  try {
    const certs = await Certification.find().sort({ date: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/certifications', async (req, res) => {
  await connectToDatabase();
  try {
    const cert = await Certification.create(req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/certifications/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certifications/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/achievements', async (req, res) => {
  await connectToDatabase();
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/achievements', async (req, res) => {
  await connectToDatabase();
  try {
    const achievement = await Achievement.create(req.body);
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/achievements/:id', async (req, res) => {
  await connectToDatabase();
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/achievements/:id', async (req, res) => {
  await connectToDatabase();
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/skills', async (req, res) => {
  await connectToDatabase();
  try {
    let skills = await Skills.findOne();
    if (!skills) skills = await Skills.create({});
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills', async (req, res) => {
  await connectToDatabase();
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
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/contact', async (req, res) => {
  await connectToDatabase();
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contact', async (req, res) => {
  await connectToDatabase();
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

// Export the Express app for Vercel
export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}