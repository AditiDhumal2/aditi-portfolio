import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AchievementsTab = ({ achievements, setAchievements, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingAch, setEditingAch] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '💼 Leadership & Community',
    date: '',
    link: '',
    images: [],
    certificateLink: '',
    order: 0
  });
  const [uploadingImages, setUploadingImages] = useState(false);

  const addAchievement = async () => {
    const newAchievement = {
      title: "New Achievement",
      description: "Achievement description",
      category: "💼 Leadership & Community",
      date: "",
      link: "",
      images: [],
      certificateLink: "",
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
      category: ach.category || '💼 Leadership & Community',
      date: ach.date || '',
      link: ach.link || '',
      images: ach.images || [],
      certificateLink: ach.certificateLink || '',
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

  // Upload multiple images
  const uploadAchievementImage = async (file) => {
    if (!file) return;
    
    setUploadingImages(true);
    setUploading(true);
    showMessage('📤 Uploading image...');
    
    try {
      const imageUrl = await uploadToCloudinary(file);
      console.log('Uploaded image URL:', imageUrl);
      
      // Add new image to the images array
      const updatedImages = [...(editForm.images || []), imageUrl];
      setEditForm({...editForm, images: updatedImages});
      
      showMessage('✅ Image uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('❌ Upload failed. Check Cloudinary settings.', true);
    } finally {
      setUploadingImages(false);
      setUploading(false);
    }
  };

  // Remove image from the array
  const removeImage = (index) => {
    const updatedImages = editForm.images.filter((_, i) => i !== index);
    setEditForm({...editForm, images: updatedImages});
    showMessage('Image removed');
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
    '💼 Leadership & Community',
    '🏅 Awards'
  ];

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
              <div className="grid grid-cols-1 gap-3">
                <div className="grid md:grid-cols-2 gap-3">
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
                    <label className="block text-sm font-semibold mb-1">Date / Year</label>
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
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                    placeholder="Detailed description of the achievement"
                  />
                </div>
                
                {/* Multiple Images Upload Section */}
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <label className="block text-sm font-semibold mb-2">📸 Images / Photos</label>
                  
                  {/* Display existing images */}
                  {editForm.images && editForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editForm.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img 
                            src={img} 
                            alt={`Image ${idx + 1}`} 
                            className="w-24 h-24 object-cover rounded border border-gray-600" 
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload new image */}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          uploadAchievementImage(e.target.files[0]);
                        }
                      }}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:bg-accent file:text-white file:cursor-pointer"
                    />
                    {uploadingImages && (
                      <span className="text-accent text-sm animate-pulse">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload multiple images. They will auto-slide in the modal.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">📄 Certificate Link</label>
                  <input
                    value={editForm.certificateLink}
                    onChange={(e) => setEditForm({...editForm, certificateLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://drive.google.com/your-certificate.pdf"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-yellow-400">Category:</strong> {ach.category || '💼 Leadership & Community'}</p>
                {ach.date && <p><strong className="text-yellow-400">Date:</strong> {ach.date}</p>}
                <p><strong className="text-yellow-400">Description:</strong> {ach.description}</p>
                {ach.images && ach.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong className="text-yellow-400">Images:</strong> {ach.images.length} uploaded</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ach.images.slice(0, 3).map((img, idx) => (
                        <img key={idx} src={img} alt={`Achievement ${idx + 1}`} className="w-12 h-12 object-cover rounded" />
                      ))}
                      {ach.images.length > 3 && (
                        <span className="text-gray-500 text-xs">+{ach.images.length - 3} more</span>
                      )}
                    </div>
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