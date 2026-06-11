import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactTab = ({ contact, setContact, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    linkedin: '',
    github: '',
    instagram: '',
    email: '',
    resume: ''
  });

  useEffect(() => {
    if (contact) {
      setEditForm({
        linkedin: contact.linkedin || '',
        github: contact.github || '',
        instagram: contact.instagram || '',
        email: contact.email || '',
        resume: contact.resume || ''
      });
    }
  }, [contact]);

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/contact', editForm);
      setContact(response.data);
      showMessage('✅ Contact information updated!');
      setIsEditing(false);
    } catch (error) {
      showMessage('❌ Error updating contact', true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      linkedin: contact.linkedin || '',
      github: contact.github || '',
      instagram: contact.instagram || '',
      email: contact.email || '',
      resume: contact.resume || ''
    });
  };

  const contactFields = [
    { field: 'linkedin', label: '🔗 LinkedIn', placeholder: 'https://linkedin.com/in/yourusername', type: 'text' },
    { field: 'github', label: '🐙 GitHub', placeholder: 'https://github.com/yourusername', type: 'text' },
    { field: 'instagram', label: '📷 Instagram', placeholder: 'https://instagram.com/yourusername', type: 'text' },
    { field: 'email', label: '✉️ Email', placeholder: 'your.email@university.edu', type: 'email' },
    { field: 'resume', label: '📄 Resume Link', placeholder: 'https://drive.google.com/your-resume.pdf', type: 'text' }
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📧 Contact Information</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-accent px-4 py-2 rounded-lg hover:bg-blue-600">
            Edit Contact
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">💾 Save</button>
            <button onClick={handleCancel} className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          {contactFields.map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label className="block mb-2 font-semibold">{label}</label>
              <input
                type={type}
                value={editForm[field]}
                onChange={(e) => setEditForm({...editForm, [field]: e.target.value})}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-accent outline-none"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {contactFields.map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-400">{label}</label>
              <p className="text-white break-all">{contact?.[field] || 'Not set'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTab;