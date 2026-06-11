import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AboutTab = ({ profile, setProfile, showMessage, setUploading, uploading, fetchAllData }) => {
  const [journeyInput, setJourneyInput] = useState('');
  const [editingJourneyIndex, setEditingJourneyIndex] = useState(null);
  const [editingJourneyText, setEditingJourneyText] = useState('');
  
  // Local state for edit form - changes only save when user clicks Save
  const [editForm, setEditForm] = useState({
    name: '',
    education: '',
    graduation: '',
    interests: '',
    title: '',
    subtitle: '',
    description: '',
    stats: { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
    journey: []
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Load profile data into edit form when component mounts or profile changes
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        education: profile.education || '',
        graduation: profile.graduation || '',
        interests: profile.interests || '',
        title: profile.title || '',
        subtitle: profile.subtitle || '',
        description: profile.description || '',
        stats: profile.stats || { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
        journey: profile.journey || []
      });
    }
  }, [profile]);

  const uploadProfilePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      const updatedProfile = { ...profile, photo: imageUrl };
      const response = await axios.put('/api/profile', updatedProfile);
      setProfile(response.data);
      showMessage('✅ Photo uploaded!');
    } catch (error) {
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await axios.put('/api/profile', editForm);
      setProfile(response.data);
      showMessage('✅ Profile updated successfully!');
      await fetchAllData();
    } catch (error) {
      showMessage('❌ Error updating profile', true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to current profile data
    setEditForm({
      name: profile.name || '',
      education: profile.education || '',
      graduation: profile.graduation || '',
      interests: profile.interests || '',
      title: profile.title || '',
      subtitle: profile.subtitle || '',
      description: profile.description || '',
      stats: profile.stats || { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
      journey: profile.journey || []
    });
  };

  const updateStat = (statName, value) => {
    setEditForm({
      ...editForm,
      stats: { ...editForm.stats, [statName]: parseInt(value) || 0 }
    });
  };

  const addJourneyPoint = () => {
    if (!journeyInput.trim()) return;
    setEditForm({
      ...editForm,
      journey: [...editForm.journey, journeyInput]
    });
    setJourneyInput('');
  };

  const updateJourneyPoint = (index, newText) => {
    if (!newText.trim()) return;
    const updatedJourney = [...editForm.journey];
    updatedJourney[index] = newText;
    setEditForm({ ...editForm, journey: updatedJourney });
    setEditingJourneyIndex(null);
    setEditingJourneyText('');
  };

  const deleteJourneyPoint = (index) => {
    const updatedJourney = editForm.journey.filter((_, i) => i !== index);
    setEditForm({ ...editForm, journey: updatedJourney });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📝 Edit About Section</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-accent px-4 py-2 rounded-lg hover:bg-blue-600">
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
              💾 Save Changes
            </button>
            <button onClick={handleCancel} className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600">
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {/* Profile Photo - Always editable */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold">Profile Photo</label>
        {profile?.photo && <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-accent mb-3" />}
        <input type="file" accept="image/*" onChange={uploadProfilePhoto} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-accent file:text-white file:cursor-pointer" />
      </div>
      
      {isEditing ? (
        // Edit Mode - Form fields
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold">Name</label>
            <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 rounded bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Education</label>
            <input type="text" value={editForm.education} onChange={(e) => setEditForm({...editForm, education: e.target.value})} className="w-full p-3 rounded bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Graduation Status</label>
            <input type="text" value={editForm.graduation} onChange={(e) => setEditForm({...editForm, graduation: e.target.value})} className="w-full p-3 rounded bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Interests</label>
            <input type="text" value={editForm.interests} onChange={(e) => setEditForm({...editForm, interests: e.target.value})} className="w-full p-3 rounded bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Hero Title</label>
            <textarea value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full p-3 rounded bg-gray-700" rows="2" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Hero Subtitle</label>
            <textarea value={editForm.subtitle} onChange={(e) => setEditForm({...editForm, subtitle: e.target.value})} className="w-full p-3 rounded bg-gray-700" rows="2" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">About Description</label>
            <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full p-3 rounded bg-gray-700" rows="5" />
          </div>

          {/* Stats Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-4">📊 Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Achievements</label>
                <input type="number" value={editForm.stats?.achievements || 0} onChange={(e) => updateStat('achievements', e.target.value)} className="w-full p-2 rounded bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Projects</label>
                <input type="number" value={editForm.stats?.projects || 0} onChange={(e) => updateStat('projects', e.target.value)} className="w-full p-2 rounded bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Certifications</label>
                <input type="number" value={editForm.stats?.certifications || 0} onChange={(e) => updateStat('certifications', e.target.value)} className="w-full p-2 rounded bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Research Papers</label>
                <input type="number" value={editForm.stats?.researchPapers || 0} onChange={(e) => updateStat('researchPapers', e.target.value)} className="w-full p-2 rounded bg-gray-700" />
              </div>
            </div>
          </div>

          {/* My Journey Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-4">🚀 My Journey</h3>
            <div className="space-y-2 mb-4">
              {editForm.journey?.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-700/50 p-2 rounded">
                  {editingJourneyIndex === idx ? (
                    <>
                      <input type="text" value={editingJourneyText} onChange={(e) => setEditingJourneyText(e.target.value)} className="flex-1 p-2 rounded bg-gray-600" autoFocus />
                      <button onClick={() => updateJourneyPoint(idx, editingJourneyText)} className="bg-green-500 px-3 py-1 rounded text-sm">Save</button>
                      <button onClick={() => setEditingJourneyIndex(null)} className="bg-gray-500 px-3 py-1 rounded text-sm">Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-300">{point}</span>
                      <button onClick={() => { setEditingJourneyIndex(idx); setEditingJourneyText(point); }} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteJourneyPoint(idx)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={journeyInput} onChange={(e) => setJourneyInput(e.target.value)} placeholder="Add a new journey point..." className="flex-1 p-2 rounded bg-gray-700" onKeyPress={(e) => e.key === 'Enter' && addJourneyPoint()} />
              <button onClick={addJourneyPoint} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">Add Point</button>
            </div>
          </div>
        </div>
      ) : (
        // View Mode - Display current data
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-400">Name</label><p className="text-white">{profile?.name || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Education</label><p className="text-white">{profile?.education || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Graduation</label><p className="text-white">{profile?.graduation || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Interests</label><p className="text-white">{profile?.interests || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Hero Title</label><p className="text-white">{profile?.title || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Hero Subtitle</label><p className="text-white">{profile?.subtitle || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Description</label><p className="text-white">{profile?.description || 'Not set'}</p></div>
        </div>
      )}
    </div>
  );
};

export default AboutTab;