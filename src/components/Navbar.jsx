import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Main navigation items (section anchors on homepage)
  const navItems = [
    { name: 'Home', id: 'home', path: '/' },
    { name: 'About', id: 'about', path: '/#about' },
    { name: 'Projects', id: 'projects', path: '/#projects' },
    { name: 'Research', id: 'research', path: '/#research' },
    { name: 'Certifications', id: 'certifications', path: '/#certifications' },
    { name: 'Achievements', id: 'achievements', path: '/#achievements' },
    { name: 'Contact', id: 'contact', path: '/#contact' }
  ];

  // Handle navigation - if on homepage, scroll to section; else, navigate to homepage with anchor
  const handleNavClick = (e, item) => {
    e.preventDefault();
    
    if (isHomePage) {
      // On homepage - smooth scroll to section
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      // On other page - navigate to homepage with anchor
      window.location.href = item.path;
    }
  };
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Name/Logo - Left Side */}
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-bold text-accent hover:text-blue-400 transition"
        >
          Aditi Dhumal
        </Link>
        
        {/* Desktop Menu - Center */}
        <div className="hidden md:flex gap-4 lg:gap-5 items-center">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className="text-gray-300 hover:text-accent transition font-medium text-sm lg:text-base whitespace-nowrap cursor-pointer"
            >
              {item.name}
            </a>
          ))}
          
          {/* Divider */}
          <span className="text-gray-600 hidden lg:inline">|</span>
          
          {/* NEW: View All Links */}
          <Link 
            to="/projects" 
            className="text-accent hover:text-accent/80 transition font-medium text-sm lg:text-base whitespace-nowrap"
          >
            📂 All Projects
          </Link>
          <Link 
            to="/research" 
            className="text-accent hover:text-accent/80 transition font-medium text-sm lg:text-base whitespace-nowrap"
          >
            📚 All Research
          </Link>
          <Link 
            to="/achievements" 
            className="text-accent hover:text-accent/80 transition font-medium text-sm lg:text-base whitespace-nowrap"
          >
            🏆 All Achievements
          </Link>
        </div>
        
        {/* Right side spacer for balance */}
        <div className="w-20 md:w-0"></div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-2xl"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md py-4 px-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto border-t border-gray-800">
          {/* Section Links */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sections</p>
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className="text-gray-300 hover:text-accent transition py-2 cursor-pointer"
            >
              {item.name}
            </a>
          ))}
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-2"></div>
          
          {/* View All Links */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Browse All</p>
          <Link 
            to="/projects" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-accent hover:text-accent/80 transition py-2"
          >
            📂 All Projects
          </Link>
          <Link 
            to="/research" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-accent hover:text-accent/80 transition py-2"
          >
            📚 All Research
          </Link>
          <Link 
            to="/achievements" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-accent hover:text-accent/80 transition py-2"
          >
            🏆 All Achievements
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;