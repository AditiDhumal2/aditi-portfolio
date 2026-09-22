import React from 'react';
import Contact from '../components/Contact';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-dark pt-20">
      <Contact standalone={true} />
    </div>
  );
};

export default ContactPage;