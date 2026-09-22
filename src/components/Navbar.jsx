import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Research', path: '/research' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Contact', path: '/contact' }
  ];
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold text-accent hover:text-blue-400 transition">
          Aditi Dhumal
        </Link>
        
        <div className="hidden md:flex gap-5 items-center">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`transition font-medium text-sm lg:text-base whitespace-nowrap ${
                location.pathname === item.path 
                  ? 'text-accent' 
                  : 'text-gray-300 hover:text-accent'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-2xl"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md py-4 px-6 flex flex-col gap-4 border-t border-gray-800">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`transition py-2 ${
                location.pathname === item.path 
                  ? 'text-accent' 
                  : 'text-gray-300 hover:text-accent'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;