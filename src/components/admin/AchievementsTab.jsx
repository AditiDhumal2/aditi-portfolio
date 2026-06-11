import React, { useState } from 'react';
import axios from 'axios';

const AchievementsTab = ({ achievements, setAchievements, showMessage, fetchAllData }) => {
  const [editingAch, setEditingAch] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'Academic',
    date: '',
    link: ''
  });

  const addAchievement = async () => {
    const newAchievement = {
      title: "New Achievement",
      description: "Achievement description",
      category: "Academic",
      date: "",
      link: "",
      order: achievements.length
    };
    try {
      const response = await axios.post('/api/achievements', newAchievement);
      await fetchAllData();
      showMessage('Achievement added!');
    } catch (error) {
      showMessage('Error adding achievement', true);
    }
  };

  const startEdit = (ach) => {
    setEditingAch(ach._id);
    setEditForm({
      title: ach.title || '',
      description: ach.description || '',
      category: ach.category || 'Academic',
      date: ach.date || '',
      link: ach.link || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/achievements/${id}`, editForm);
      await fetchAllData();
      showMessage('Achievement updated!');
      setEditingAch(null);
    } catch (error) {
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
        showMessage('Error deleting achievement', true);
      }
    }
  };

  const categories = ['Academic', 'Competition', 'Professional', 'Leadership', 'Research'];

  return (
    <div>
      <button onClick={addAchievement} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Achievement
      </button>
      
      <div className="space-y-4">
        {achievements.map(ach => (
          <div key={ach._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">
                🏆 {ach.title || 'Untitled Achievement'}
              </h3>
              <div className="flex gap-2">
                {editingAch === ach._id ? (
                  <>
                    <button onClick={() => saveEdit(ach._id)} className="bg-green-500 px-3 py-1 rounded text-sm">
                      Save
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
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="2024"
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
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-yellow-400">Category:</strong> {ach.category || 'Academic'}</p>
                <p><strong className="text-yellow-400">Description:</strong> {ach.description}</p>
                {ach.date && <p><strong className="text-yellow-400">Date:</strong> {ach.date}</p>}
                {ach.link && (
                  <a href={ach.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    🔗 Learn More →
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