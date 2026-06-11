import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Dynamic menu items - Updated with all sections
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Building', id: 'building' },
    { name: 'Research', id: 'research' },
    { name: 'Certifications', id: 'certifications' },
    { name: 'Achievements', id: 'achievements' },
    { name: 'Skills', id: 'skills' },
    { name: 'Contact', id: 'contact' }
  ];
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* No logo/text - just empty space for balance */}
        <div className="w-10"></div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-6">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className="text-gray-300 hover:text-accent transition font-medium text-sm lg:text-base whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-md py-4 px-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-accent transition py-2"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;