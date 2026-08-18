import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy load components for faster initial load
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About')); // Now includes Skills
const Projects = lazy(() => import('./components/Projects')); // Now includes Current Projects
const Research = lazy(() => import('./components/Research'));
const Certifications = lazy(() => import('./components/Certifications'));
const Achievements = lazy(() => import('./components/Achievements'));
const Contact = lazy(() => import('./components/Contact'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

// REMOVED: Experience import

// Professional Loading Component with Rolling Box
const LoadingSpinner = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark">
      <div className="relative mb-8">
        <div className="w-16 h-16 bg-accent rounded-lg animate-rolling-box shadow-[0_0_30px_rgba(79,140,255,0.3)]"></div>
        <div className="w-20 h-2 bg-accent/20 rounded-full mx-auto mt-4 animate-shadow-pulse"></div>
      </div>
      
      <p className="text-gray-400 text-lg font-light tracking-wider animate-pulse">
        Loading<span className="animate-dots">...</span>
      </p>
      
      {showTimeout && (
        <p className="text-gray-500 text-sm mt-6">
          Taking longer than usual? <br />
          <span className="text-accent hover:underline cursor-pointer" onClick={() => window.location.reload()}>
            Refresh the page
          </span>
        </p>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="bg-dark min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={
              <>
                <Navbar />
                <Hero />
                <About /> {/* Skills are now inside About */}
                {/* REMOVED: <Experience /> */}
                <Projects /> {/* Current Projects are now inside Projects */}
                <Research />
                <Certifications />
                <Achievements />
                <Contact />
                <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800">
                  <p>© 2024 Aditi Dhumal | Built with React & Tailwind CSS</p>
                </footer>
              </>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;