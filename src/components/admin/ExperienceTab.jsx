import React, { useState } from 'react';
import axios from 'axios';

const ExperienceTab = ({ experience, setExperience, showMessage, fetchAllData }) => {
  const [editingExp, setEditingExp] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    type: 'Internship',
    achievements: [],
    technologies: []
  });

  const addExperience = async () => {
    const newExp = {
      title: "New Position",
      company: "Company Name",
      location: "Location",
      period: "Month Year - Month Year",
      type: "Internship",
      achievements: ["Achievement 1", "Achievement 2"],
      technologies: ["Tech 1", "Tech 2"],
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
      achievements: exp.achievements || [],
      technologies: exp.technologies || []
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

  return (
    <div>
      <button onClick={addExperience} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Experience
      </button>
      
      <div className="space-y-6">
        {experience.map(exp => (
          <div key={exp._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">💼 {exp.title}</h3>
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
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Achievements (one per line)</label>
                  <textarea value={editForm.achievements.join('\n')} onChange={(e) => setEditForm({...editForm, achievements: e.target.value.split('\n').filter(a => a.trim())})} className="w-full bg-gray-700 p-2 rounded" rows="4" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Technologies (comma-separated)</label>
                  <input value={editForm.technologies.join(', ')} onChange={(e) => setEditForm({...editForm, technologies: e.target.value.split(',').map(t => t.trim())})} className="w-full bg-gray-700 p-2 rounded" />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong>Company:</strong> {exp.company}</p>
                <p><strong>Period:</strong> {exp.period}</p>
                <p><strong>Achievements:</strong> {exp.achievements?.length} items</p>
                <p><strong>Tech Stack:</strong> {exp.technologies?.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;