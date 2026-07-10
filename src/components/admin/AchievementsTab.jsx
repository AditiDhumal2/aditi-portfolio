import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AchievementsTab = ({ achievements, setAchievements, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingAch, setEditingAch] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '🏆 Achievements',
    date: '',
    link: '',
    image: '',
    certificateLink: '',
    subcategory: '',
    type: '',
    order: 0
  });

  const addAchievement = async () => {
    const newAchievement = {
      title: "New Achievement",
      description: "Achievement description",
      category: "🏆 Achievements",
      date: "",
      link: "",
      image: "",
      certificateLink: "",
      subcategory: "",
      type: "",
      order: achievements.length
    };
    try {
      const response = await axios.post('/api/achievements', newAchievement);
      await fetchAllData();
      showMessage('Achievement added!');
    } catch (error) {
      console.error('Add error:', error);
      showMessage('Error adding achievement', true);
    }
  };

  const startEdit = (ach) => {
    setEditingAch(ach._id);
    setEditForm({
      title: ach.title || '',
      description: ach.description || '',
      category: ach.category || '🏆 Achievements',
      date: ach.date || '',
      link: ach.link || '',
      image: ach.image || '',
      certificateLink: ach.certificateLink || '',
      subcategory: ach.subcategory || '',
      type: ach.type || '',
      order: ach.order || 0
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/achievements/${id}`, editForm);
      await fetchAllData();
      showMessage('Achievement updated!');
      setEditingAch(null);
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Error updating achievement', true);
    }
  };

  const cancelEdit = () => {
    setEditingAch(null);
  };

  const deleteAchievement = async (id) => {
    if (window.confirm('Delete this achievement?')) {
      try {
        await axios.delete(`/api/achievements/${id}`);
        await fetchAllData();
        showMessage('Achievement deleted!');
      } catch (error) {
        console.error('Delete error:', error);
        showMessage('Error deleting achievement', true);
      }
    }
  };

  const uploadImage = async (file, field) => {
    setUploading(true);
    showMessage('📤 Uploading image...');
    try {
      const imageUrl = await uploadToCloudinary(file);
      setEditForm({...editForm, [field]: imageUrl});
      showMessage('✅ Image uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
    }
  };

  // Save order function
  const saveOrder = async (orderedAchievements) => {
    try {
      for (const ach of orderedAchievements) {
        await axios.put(`/api/achievements/${ach._id}`, { order: ach.order });
      }
      showMessage('Order updated!');
    } catch (error) {
      console.error('Order save error:', error);
      showMessage('Error saving order', true);
    }
  };

  // Categories
  const categories = [
    '🏆 Achievements',
    '💼 Leadership & Community',
    '🏅 Awards'
  ];

  const subcategories = {
    '🏆 Achievements': ['Academic', 'Competition', 'Professional', 'Skill Based'],
    '💼 Leadership & Community': ['Leadership', 'Community Service', 'Volunteer', 'Event Coordination'],
    '🏅 Awards': ['Academic Award', 'Competition Award', 'Recognition', 'Scholarship']
  };

  // Sort achievements by order
  const sortedAchievements = [...achievements].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={addAchievement} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
          + Add Achievement
        </button>
        <p className="text-sm text-gray-400">⬆⬇ Use arrows to reorder</p>
      </div>
      
      <div className="space-y-4">
        {sortedAchievements.map((ach, index) => (
          <div key={ach._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-mono">#{index + 1}</span>
                <h3 className="text-lg font-bold text-accent">
                  {editingAch === ach._id ? '✏️ Editing:' : '🏆'} {ach.title || 'Untitled Achievement'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <div className="flex flex-col mr-2">
                  <button
                    onClick={() => {
                      const newAch = [...achievements];
                      const idx = newAch.findIndex(a => a._id === ach._id);
                      if (idx > 0) {
                        [newAch[idx], newAch[idx - 1]] = [newAch[idx - 1], newAch[idx]];
                        newAch.forEach((a, i) => a.order = i);
                        setAchievements(newAch);
                        saveOrder(newAch);
                      }
                    }}
                    disabled={index === 0}
                    className={`text-xs px-2 py-0.5 rounded ${
                      index === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-accent text-white'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => {
                      const newAch = [...achievements];
                      const idx = newAch.findIndex(a => a._id === ach._id);
                      if (idx < newAch.length - 1) {
                        [newAch[idx], newAch[idx + 1]] = [newAch[idx + 1], newAch[idx]];
                        newAch.forEach((a, i) => a.order = i);
                        setAchievements(newAch);
                        saveOrder(newAch);
                      }
                    }}
                    disabled={index === sortedAchievements.length - 1}
                    className={`text-xs px-2 py-0.5 rounded ${
                      index === sortedAchievements.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-accent text-white'
                    }`}
                  >
                    ↓
                  </button>
                </div>
                
                {editingAch === ach._id ? (
                  <>
                    <button onClick={() => saveEdit(ach._id)} className="bg-green-500 px-3 py-1 rounded text-sm">
                      💾 Save
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(ach)} className="bg-blue-500 px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteAchievement(ach._id)} className="bg-red-500 px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {editingAch === ach._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Achievement Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Subcategory</label>
                  <input
                    value={editForm.subcategory}
                    onChange={(e) => setEditForm({...editForm, subcategory: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="e.g., Academic, Leadership, Competition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date / Year</label>
                  <input
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="2024"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                    placeholder="Detailed description of the achievement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Link (Optional)</label>
                  <input
                    value={editForm.link}
                    onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">📸 Photo / Image</label>
                  {editForm.image && (
                    <img src={editForm.image} alt="Achievement" className="w-24 h-24 object-cover rounded mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'image')}
                    className="block w-full text-sm text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload achievement photo (JPG, PNG)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">📄 Certificate Link</label>
                  <input
                    value={editForm.certificateLink}
                    onChange={(e) => setEditForm({...editForm, certificateLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://drive.google.com/your-certificate.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload PDF to Google Drive or Cloudinary</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-yellow-400">Category:</strong> {ach.category || '🏆 Achievements'}</p>
                {ach.subcategory && <p><strong className="text-yellow-400">Subcategory:</strong> {ach.subcategory}</p>}
                {ach.date && <p><strong className="text-yellow-400">Date:</strong> {ach.date}</p>}
                <p><strong className="text-yellow-400">Description:</strong> {ach.description}</p>
                {ach.image && (
                  <div className="mt-2">
                    <img src={ach.image} alt={ach.title} className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
                {ach.certificateLink && (
                  <p className="mt-2">
                    <a href={ach.certificateLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                      📄 View Certificate →
                    </a>
                  </p>
                )}
                {ach.link && (
                  <a href={ach.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm mt-2 inline-block">
                    Learn more →
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsTab;