import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hero = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [profile, setProfile] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [profileData, contactData] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/contact')
      ]);
      setProfile(profileData.data);
      setContact(contactData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };
  
  const fullText = profile?.title || "Loading...";
  
  useEffect(() => {
    if (profile && index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(text + fullText[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [index, text, profile, fullText]);
  
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </section>
    );
  }
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-accent shadow-xl transition-transform duration-300 group-hover:scale-105 bg-gray-700 flex items-center justify-center">
              {profile?.photo ? (
                <img 
                  src={profile.photo} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">📸</div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          {/* Text Content */}
          <div className="text-center md:text-left max-w-2xl">
            <div className="mb-6 inline-block md:inline-block">
              <span className="bg-accent/20 text-accent px-4 py-2 rounded-full text-sm">
                Welcome to my portfolio
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hi, I'm <span className="text-accent">{profile?.name || 'Aditi'}</span>
            </h1>
            <div className="h-28 mb-6">
              <p className="text-xl md:text-2xl text-gray-300">{text}<span className="animate-pulse text-accent">|</span></p>
            </div>
            <p className="text-gray-400 text-lg mb-8">{profile?.subtitle || ''}</p>
            
            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start mb-8">
              {contact?.linkedin && contact.linkedin !== "#" && (
                <a 
                  href={contact.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-800 hover:bg-[#0077B5] flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                  </svg>
                </a>
              )}
              {contact?.github && contact.github !== "#" && (
                <a 
                  href={contact.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-600 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              )}
              {contact?.email && contact.email !== "#" && (
                <a 
                  href={`mailto:${contact.email}`}
                  className="w-12 h-12 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4 justify-center md:justify-start flex-wrap">
              <a href="#projects" className="bg-accent px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 inline-block">
                View Projects
              </a>
              <a 
                href={contact?.resume || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-accent px-8 py-3 rounded-lg font-semibold hover:bg-accent/10 transition transform hover:scale-105 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;