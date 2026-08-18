import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const AboutTab = ({ profile, setProfile, showMessage, setUploading, uploading, fetchAllData }) => {
  const [journeyInput, setJourneyInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [editingJourneyIndex, setEditingJourneyIndex] = useState(null);
  const [editingJourneyText, setEditingJourneyText] = useState('');
  const [editingHighlightIndex, setEditingHighlightIndex] = useState(null);
  const [editingHighlightText, setEditingHighlightText] = useState('');
  
  // Skills state
  const [skillsData, setSkillsData] = useState([
    { name: "HTML | CSS", percentage: 90 },
    { name: "Python", percentage: 80 },
    { name: "SQL | NoSQL", percentage: 75 },
    { name: "Excel | Power BI | Tableau", percentage: 90 },
    { name: "AWS Cloud", percentage: 85 },
    { name: "Machine Learning", percentage: 75 },
    { name: "Data Cleaning | Preparation", percentage: 90 },
    { name: "Data Analysis | Modeling", percentage: 80 },
    { name: "Data Visualization | Reporting", percentage: 75 },
    { name: "Business Intelligence", percentage: 90 },
    { name: "Communication | Storytelling", percentage: 85 },
    { name: "Critical Thinking | Problem-Solving", percentage: 75 }
  ]);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState('');
  const [editingSkillPercentage, setEditingSkillPercentage] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPercentage, setNewSkillPercentage] = useState('');

  // Local state for edit form
  const [editForm, setEditForm] = useState({
    name: '',
    education: '',
    graduation: '',
    interests: '',
    title: '',
    subtitle: '',
    description: '',
    sgpa: '',
    cgpa: '',
    stats: { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
    journey: [],
    highlights: []
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Load profile data into edit form
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
        sgpa: profile.sgpa || '',
        cgpa: profile.cgpa || '',
        stats: profile.stats || { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
        journey: profile.journey || [],
        highlights: profile.highlights || []
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
      console.error('Save error:', error);
      showMessage('❌ Error updating profile', true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: profile.name || '',
      education: profile.education || '',
      graduation: profile.graduation || '',
      interests: profile.interests || '',
      title: profile.title || '',
      subtitle: profile.subtitle || '',
      description: profile.description || '',
      sgpa: profile.sgpa || '',
      cgpa: profile.cgpa || '',
      stats: profile.stats || { achievements: 0, projects: 0, certifications: 0, researchPapers: 0 },
      journey: profile.journey || [],
      highlights: profile.highlights || []
    });
  };

  const updateStat = (statName, value) => {
    setEditForm({
      ...editForm,
      stats: { ...editForm.stats, [statName]: parseInt(value) || 0 }
    });
  };

  // Journey Management
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

  // Highlights Management
  const addHighlight = () => {
    if (!highlightsInput.trim()) return;
    setEditForm({
      ...editForm,
      highlights: [...editForm.highlights, highlightsInput]
    });
    setHighlightsInput('');
  };

  const updateHighlight = (index, newText) => {
    if (!newText.trim()) return;
    const updatedHighlights = [...editForm.highlights];
    updatedHighlights[index] = newText;
    setEditForm({ ...editForm, highlights: updatedHighlights });
    setEditingHighlightIndex(null);
    setEditingHighlightText('');
  };

  const deleteHighlight = (index) => {
    const updatedHighlights = editForm.highlights.filter((_, i) => i !== index);
    setEditForm({ ...editForm, highlights: updatedHighlights });
  };

  // ============ SKILLS MANAGEMENT ============
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const percentage = parseInt(newSkillPercentage) || 0;
    setSkillsData([...skillsData, { name: newSkillName, percentage: Math.min(100, Math.max(0, percentage)) }]);
    setNewSkillName('');
    setNewSkillPercentage('');
    showMessage('✅ Skill added!');
  };

  const updateSkill = (index, name, percentage) => {
    const updatedSkills = [...skillsData];
    updatedSkills[index] = { 
      name: name || updatedSkills[index].name, 
      percentage: Math.min(100, Math.max(0, parseInt(percentage) || 0))
    };
    setSkillsData(updatedSkills);
    setEditingSkillIndex(null);
    setEditingSkillName('');
    setEditingSkillPercentage('');
    showMessage('✅ Skill updated!');
  };

  const deleteSkill = (index) => {
    if (window.confirm('Delete this skill?')) {
      const updatedSkills = skillsData.filter((_, i) => i !== index);
      setSkillsData(updatedSkills);
      showMessage('✅ Skill deleted!');
    }
  };

  const startEditSkill = (index) => {
    setEditingSkillIndex(index);
    setEditingSkillName(skillsData[index].name);
    setEditingSkillPercentage(skillsData[index].percentage.toString());
  };

  const cancelEditSkill = () => {
    setEditingSkillIndex(null);
    setEditingSkillName('');
    setEditingSkillPercentage('');
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
      
      {/* Profile Photo */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-semibold">Profile Photo</label>
        {profile?.photo && <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-accent mb-3" />}
        <input type="file" accept="image/*" onChange={uploadProfilePhoto} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-accent file:text-white file:cursor-pointer" />
      </div>
      
      {isEditing ? (
        // Edit Mode
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
          
          {/* SGPA and CGPA Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-sm font-semibold text-accent">🎓 Final Year SGPA</label>
              <input 
                type="text" 
                value={editForm.sgpa || ''} 
                onChange={(e) => setEditForm({...editForm, sgpa: e.target.value})} 
                className="w-full p-3 rounded bg-gray-700" 
                placeholder="9.46"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-accent">📚 Overall CGPA</label>
              <input 
                type="text" 
                value={editForm.cgpa || ''} 
                onChange={(e) => setEditForm({...editForm, cgpa: e.target.value})} 
                className="w-full p-3 rounded bg-gray-700" 
                placeholder="8.02"
              />
            </div>
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

          {/* Key Highlights Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-2">⭐ Key Highlights</h3>
            <p className="text-sm text-gray-400 mb-4">Short, impactful statements that appear on your About page (keep them brief!)</p>
            
            <div className="space-y-2 mb-4">
              {editForm.highlights?.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-700/50 p-2 rounded">
                  {editingHighlightIndex === idx ? (
                    <>
                      <input 
                        type="text" 
                        value={editingHighlightText} 
                        onChange={(e) => setEditingHighlightText(e.target.value)} 
                        className="flex-1 p-2 rounded bg-gray-600" 
                        autoFocus 
                      />
                      <button 
                        onClick={() => updateHighlight(idx, editingHighlightText)} 
                        className="bg-green-500 px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingHighlightIndex(null)} 
                        className="bg-gray-500 px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-300 text-sm">✓ {highlight}</span>
                      <button 
                        onClick={() => { 
                          setEditingHighlightIndex(idx); 
                          setEditingHighlightText(highlight); 
                        }} 
                        className="bg-blue-500 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteHighlight(idx)} 
                        className="bg-red-500 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
              {editForm.highlights?.length === 0 && (
                <p className="text-gray-500 text-sm italic">No highlights added yet. Add your achievements below.</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={highlightsInput} 
                onChange={(e) => setHighlightsInput(e.target.value)} 
                placeholder="Add a new highlight..." 
                className="flex-1 p-2 rounded bg-gray-700" 
                onKeyPress={(e) => e.key === 'Enter' && addHighlight()} 
              />
              <button 
                onClick={addHighlight} 
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Add Highlight
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: "🏆 Final Year SGPA: 9.46 (Top 5% of Class)" or "📚 Overall CGPA: 8.02"
            </p>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-400">Name</label><p className="text-white">{profile?.name || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Education</label><p className="text-white">{profile?.education || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Graduation</label><p className="text-white">{profile?.graduation || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Interests</label><p className="text-white">{profile?.interests || 'Not set'}</p></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-sm font-semibold text-gray-400">🎓 SGPA</label><p className="text-white">{profile?.sgpa || 'Not set'}</p></div>
            <div><label className="block text-sm font-semibold text-gray-400">📚 CGPA</label><p className="text-white">{profile?.cgpa || 'Not set'}</p></div>
          </div>
          <div><label className="block text-sm font-semibold text-gray-400">Hero Title</label><p className="text-white">{profile?.title || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Hero Subtitle</label><p className="text-white">{profile?.subtitle || 'Not set'}</p></div>
          <div><label className="block text-sm font-semibold text-gray-400">Description</label><p className="text-white">{profile?.description || 'Not set'}</p></div>
          <div>
            <label className="block text-sm font-semibold text-gray-400">⭐ Key Highlights</label>
            {profile?.highlights && profile.highlights.length > 0 ? (
              <ul className="text-gray-300 space-y-1 mt-1">
                {profile.highlights.map((h, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No highlights added</p>
            )}
          </div>
        </div>
      )}

      {/* ============ SKILLS MANAGEMENT - ALWAYS VISIBLE ============ */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-xl font-bold mb-4">💪 Skills (with Percentages)</h3>
        <p className="text-sm text-gray-400 mb-4">Manage your skills with percentage bars (like "Meet Mali" style)</p>
        
        {/* Skills List */}
        <div className="space-y-2 mb-4">
          {skillsData.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg">
              {editingSkillIndex === idx ? (
                <>
                  <input 
                    type="text" 
                    value={editingSkillName} 
                    onChange={(e) => setEditingSkillName(e.target.value)} 
                    className="flex-1 p-2 rounded bg-gray-600 text-sm"
                    placeholder="Skill name"
                  />
                  <input 
                    type="number" 
                    value={editingSkillPercentage} 
                    onChange={(e) => setEditingSkillPercentage(e.target.value)} 
                    className="w-20 p-2 rounded bg-gray-600 text-sm text-center"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                  <button 
                    onClick={() => updateSkill(idx, editingSkillName, parseInt(editingSkillPercentage))} 
                    className="bg-green-500 px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button 
                    onClick={cancelEditSkill} 
                    className="bg-gray-500 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-accent font-bold">{skill.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                  <button onClick={() => startEditSkill(idx)} className="bg-blue-500 px-3 py-1 rounded text-sm ml-2">
                    Edit
                  </button>
                  <button onClick={() => deleteSkill(idx)} className="bg-red-500 px-3 py-1 rounded text-sm">
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
          {skillsData.length === 0 && (
            <p className="text-gray-500 text-sm italic">No skills added yet. Add your skills below.</p>
          )}
        </div>
        
        {/* Add New Skill */}
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newSkillName} 
            onChange={(e) => setNewSkillName(e.target.value)} 
            placeholder="Skill name (e.g., Python, HTML | CSS)" 
            className="flex-1 p-2 rounded bg-gray-700 text-sm"
          />
          <input 
            type="number" 
            value={newSkillPercentage} 
            onChange={(e) => setNewSkillPercentage(e.target.value)} 
            placeholder="%" 
            className="w-20 p-2 rounded bg-gray-700 text-sm text-center"
            min="0"
            max="100"
          />
          <button onClick={addSkill} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-sm">
            + Add Skill
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Add your skills with percentage values (e.g., "Python" → 80%). These will appear as progress bars.
        </p>
      </div>
    </div>
  );
};

export default AboutTab;