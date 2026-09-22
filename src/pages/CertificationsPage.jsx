import React from 'react';
import Certifications from '../components/Certifications';

const CertificationsPage = () => {
  return (
    <div className="min-h-screen bg-dark pt-20">
      <Certifications standalone={true} />
    </div>
  );
};

export default CertificationsPage;