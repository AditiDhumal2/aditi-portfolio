import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import CurrentProjects from './components/CurrentProjects';
import Research from './components/Research';
import Certifications from './components/Certifications';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="bg-dark min-h-screen">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <About />
              <Experience />
              <Projects />
              <CurrentProjects />
              <Research />
              <Certifications />
              <Achievements />
              <Skills />
              <Contact />
              <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800">
                <p>© 2024 Aditi | Built with React & Tailwind CSS</p>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;