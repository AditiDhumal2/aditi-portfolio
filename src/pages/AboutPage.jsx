import React from 'react';
import About from '../components/About';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-dark pt-20">
      <About standalone={true} />
    </div>
  );
};

export default AboutPage;