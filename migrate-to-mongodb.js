import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Your current in-memory data
const currentData = {
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
    { title: "AI-Powered Academic Chatbot", problem: "Students struggle to get instant answers", tools: "Python, Hugging Face, FAISS", results: "87% accuracy, 300+ users", impact: "Reduced response time by 75%", featured: true },
    { title: "Food Waste Analytics Dashboard", problem: "Restaurants waste 30% of food", tools: "Python, Tableau, SQL", results: "Reduced waste by 23%", impact: "Saved $45k annually", featured: true },
    { title: "Real-time Sales Analytics Dashboard", problem: "No real-time visibility", tools: "Python, Power BI, SQL", results: "15% efficiency increase", impact: "Adopted by 3 retail chains", featured: true }
  ],
  experience: [
    { title: "Data Analyst Intern", company: "Tech Solutions Inc.", period: "June 2024 - Aug 2024", achievements: ["Analyzed 50,000+ transactions", "Built Tableau dashboards"], technologies: ["Python", "SQL", "Tableau"] },
    { title: "MERN Stack Developer Intern", company: "WebCraft Innovations", period: "Jan 2024 - Apr 2024", achievements: ["Built full-stack apps", "Optimized API responses"], technologies: ["React", "Node.js", "MongoDB"] }
  ],
  currentProjects: [
    { title: "Career Intelligence Platform", description: "AI-powered job market analysis", progress: "70%", technologies: ["Python", "React", "MongoDB"] }
  ],
  research: [
    { title: "Optimizing Food Supply Chains", type: "Conference Paper", status: "Under Review", description: "LSTM-XGBoost model reduces error by 32%" }
  ],
  certifications: [
    { name: "Google Data Analytics", issuer: "Google", date: "2024", skills: ["SQL", "Tableau", "R"] }
  ],
  achievements: [
    { title: "CGPA: 9.2/10", description: "Top 5% of class", category: "Academic" }
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

// ============ SCHEMAS ============
const profileSchema = new mongoose.Schema({
  name: String, photo: String, graduation: String, title: String, subtitle: String,
  education: String, interests: String, description: String, stats: Object, journey: [String]
});

const projectSchema = new mongoose.Schema({
  title: String, problem: String, tools: String, results: String, impact: String, featured: Boolean
});

const experienceSchema = new mongoose.Schema({
  title: String, company: String, period: String, achievements: [String], technologies: [String]
});

const currentProjectSchema = new mongoose.Schema({
  title: String, description: String, progress: String, technologies: [String]
});

const researchSchema = new mongoose.Schema({
  title: String, type: String, status: String, description: String
});

const certificationSchema = new mongoose.Schema({
  name: String, issuer: String, date: String, skills: [String]
});

const achievementSchema = new mongoose.Schema({
  title: String, description: String, category: String
});

const skillsSchema = new mongoose.Schema({
  programming: [String], dataTools: [String], mlTools: [String], databases: [String], web: [String]
});

const contactSchema = new mongoose.Schema({
  linkedin: String, github: String, email: String, resume: String
});

const Profile = mongoose.model('Profile', profileSchema);
const Project = mongoose.model('Project', projectSchema);
const Experience = mongoose.model('Experience', experienceSchema);
const CurrentProject = mongoose.model('CurrentProject', currentProjectSchema);
const Research = mongoose.model('Research', researchSchema);
const Certification = mongoose.model('Certification', certificationSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const Skills = mongoose.model('Skills', skillsSchema);
const Contact = mongoose.model('Contact', contactSchema);

async function migrate() {
  try {
    // USE DIRECT CONNECTION (NO SRV - Bypasses DNS issue)
    // Format: mongodb://username:password@host:port/database?options
    const MONGODB_URI = 'mongodb://aditidhumal704_db_user:kaqJeBFcCKabk2k6@cluster0.1iqtkir.mongodb.net:27017/aditi_portfolio?retryWrites=true&w=majority&ssl=true&authSource=admin';
    
    console.log('📡 Connecting to MongoDB Atlas (DIRECT CONNECTION - No DNS SRV)...');
    console.log('📍 This bypasses the ECONNREFUSED DNS error');
    console.log('👤 Username: aditidhumal704_db_user');
    console.log('💾 Database: aditi_portfolio');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Atlas successfully!');

    // Clear existing data (if any)
    console.log('🗑️ Clearing existing collections...');
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await CurrentProject.deleteMany({});
    await Research.deleteMany({});
    await Certification.deleteMany({});
    await Achievement.deleteMany({});
    await Skills.deleteMany({});
    await Contact.deleteMany({});

    // Insert new data
    console.log('📝 Inserting Profile...');
    await Profile.create(currentData.profile);

    console.log('📝 Inserting Projects...');
    for (const project of currentData.projects) {
      await Project.create(project);
    }

    console.log('📝 Inserting Experience...');
    for (const exp of currentData.experience) {
      await Experience.create(exp);
    }

    console.log('📝 Inserting Current Projects...');
    for (const project of currentData.currentProjects) {
      await CurrentProject.create(project);
    }

    console.log('📝 Inserting Research...');
    for (const paper of currentData.research) {
      await Research.create(paper);
    }

    console.log('📝 Inserting Certifications...');
    for (const cert of currentData.certifications) {
      await Certification.create(cert);
    }

    console.log('📝 Inserting Achievements...');
    for (const ach of currentData.achievements) {
      await Achievement.create(ach);
    }

    console.log('📝 Inserting Skills...');
    await Skills.create(currentData.skills);

    console.log('📝 Inserting Contact...');
    await Contact.create(currentData.contact);

    console.log('\n✅✅✅ MIGRATION COMPLETED SUCCESSFULLY! ✅✅✅');
    console.log('📊 Your portfolio data is now in MongoDB Atlas!');
    console.log('📍 Cluster: cluster0.1iqtkir.mongodb.net');
    console.log('💾 Database: aditi_portfolio');
    console.log('\n🔍 Verify at: https://cloud.mongodb.com/');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Add your IP to MongoDB Atlas whitelist (Network Access → Add IP → 0.0.0.0/0)');
    console.error('2. Make sure the username and password are correct');
    console.error('3. Check cluster is active');
    process.exit(1);
  }
}

migrate();