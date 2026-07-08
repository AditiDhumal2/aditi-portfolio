import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ExperienceTab = ({ experience, setExperience, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingExp, setEditingExp] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    type: 'Internship',
    roleDescription: '',
    achievements: [],
    technologies: [],
    image: '',
    certificateLink: ''
  });

  const addExperience = async () => {
    const newExp = {
      title: "New Position",
      company: "Company Name",
      location: "Location",
      period: "Month Year - Month Year",
      type: "Internship",
      roleDescription: "",
      achievements: ["Achievement 1", "Achievement 2"],
      technologies: ["Tech 1", "Tech 2"],
      image: "",
      certificateLink: "",
      order: experience.length
    };
    try {
      await axios.post('/api/experience', newExp);
      await fetchAllData();
      showMessage('Experience added!');
    } catch (error) {
      showMessage('Error adding experience', true);
    }
  };

  const startEdit = (exp) => {
    setEditingExp(exp._id);
    setEditForm({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      period: exp.period || '',
      type: exp.type || 'Internship',
      roleDescription: exp.roleDescription || '',
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
      image: exp.image || '',
      certificateLink: exp.certificateLink || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/experience/${id}`, editForm);
      await fetchAllData();
      showMessage('Experience updated!');
      setEditingExp(null);
    } catch (error) {
      showMessage('Error updating experience', true);
    }
  };

  const cancelEdit = () => {
    setEditingExp(null);
  };

  const deleteExperience = async (id) => {
    if (window.confirm('Delete this experience?')) {
      try {
        await axios.delete(`/api/experience/${id}`);
        await fetchAllData();
        showMessage('Experience deleted!');
      } catch (error) {
        showMessage('Error deleting experience', true);
      }
    }
  };

  const uploadExperienceImage = async (file, expId) => {
    setUploading(true);
    showMessage('📤 Uploading image...');
    try {
      const imageUrl = await uploadToCloudinary(file);
      setEditForm({...editForm, image: imageUrl});
      showMessage('✅ Image uploaded!');
    } catch (error) {
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={addExperience} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Experience
      </button>
      
      <div className="space-y-6">
        {experience.map(exp => (
          <div key={exp._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">
                {editingExp === exp._id ? 'Editing:' : '💼'} {exp.title}
              </h3>
              <div className="flex gap-2">
                {editingExp === exp._id ? (
                  <>
                    <button onClick={() => saveEdit(exp._id)} className="bg-green-500 px-3 py-1 rounded text-sm">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(exp)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                    <button onClick={() => deleteExperience(exp._id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
            
            {editingExp === exp._id ? (
              <div className="grid grid-cols-1 gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Company</label>
                    <input value={editForm.company} onChange={(e) => setEditForm({...editForm, company: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Location</label>
                    <input value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Period</label>
                    <input value={editForm.period} onChange={(e) => setEditForm({...editForm, period: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Type</label>
                    <select value={editForm.type} onChange={(e) => setEditForm({...editForm, type: e.target.value})} className="w-full bg-gray-700 p-2 rounded">
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Experience Image</label>
                    {editForm.image && <img src={editForm.image} alt="Experience" className="w-24 h-24 object-cover rounded mb-2" />}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadExperienceImage(e.target.files[0], exp._id)} className="block w-full text-sm text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1 text-blue-400">📋 Role Description</label>
                  <textarea
                    value={editForm.roleDescription}
                    onChange={(e) => setEditForm({...editForm, roleDescription: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Brief description of your role and responsibilities..."
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">🏆 Achievements (one per line)</label>
                  <textarea
                    value={editForm.achievements.join('\n')}
                    onChange={(e) => setEditForm({...editForm, achievements: e.target.value.split('\n').filter(a => a.trim())})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">🛠️ Technologies (comma-separated)</label>
                  <input
                    value={editForm.technologies.join(', ')}
                    onChange={(e) => setEditForm({...editForm, technologies: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">📄 Certificate / Offer Letter Link</label>
                  <input
                    value={editForm.certificateLink}
                    onChange={(e) => setEditForm({...editForm, certificateLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://drive.google.com/your-certificate.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload PDF to Google Drive or Cloudinary and paste link here</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                {exp.image && <img src={exp.image} alt={exp.company} className="w-24 h-24 object-cover rounded mb-2" />}
                <p><strong className="text-blue-400">Company:</strong> {exp.company}</p>
                <p><strong className="text-blue-400">Period:</strong> {exp.period}</p>
                <p><strong className="text-blue-400">Type:</strong> {exp.type}</p>
                {exp.roleDescription && (
                  <p><strong className="text-blue-400">Role:</strong> {exp.roleDescription.substring(0, 100)}...</p>
                )}
                <p><strong className="text-blue-400">Achievements:</strong> {exp.achievements?.length} items</p>
                {exp.certificateLink && <p><strong>Certificate:</strong> <a href={exp.certificateLink} target="_blank" className="text-accent">View →</a></p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;