import React, { useState } from 'react';
import axios from 'axios';

const SkillsTab = ({ skills, setSkills, showMessage }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  const updateSkills = async (category, value) => {
    const newSkills = { ...skills, [category]: value.split(',').map(s => s.trim()) };
    setSkills(newSkills);
    try {
      const response = await axios.put('/api/skills', newSkills);
      setSkills(response.data);
      showMessage('Skills updated!');
      setEditingCategory(null);
    } catch (error) {
      showMessage('Error updating skills', true);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const newSkills = { ...skills, [newCategory]: [] };
    setSkills(newSkills);
    try {
      const response = await axios.put('/api/skills', newSkills);
      setSkills(response.data);
      showMessage('Category added!');
      setNewCategory('');
    } catch (error) {
      showMessage('Error adding category', true);
    }
  };

  const deleteCategory = async (category) => {
    if (window.confirm(`Delete category "${category}"?`)) {
      const newSkills = { ...skills };
      delete newSkills[category];
      setSkills(newSkills);
      try {
        const response = await axios.put('/api/skills', newSkills);
        setSkills(response.data);
        showMessage('Category deleted!');
      } catch (error) {
        showMessage('Error deleting category', true);
      }
    }
  };

  const skillCategories = [
    { name: 'programming', label: '💻 Programming Languages', icon: '💻', color: 'text-blue-400' },
    { name: 'dataTools', label: '📊 Data Tools', icon: '📊', color: 'text-green-400' },
    { name: 'mlTools', label: '🤖 Machine Learning', icon: '🤖', color: 'text-purple-400' },
    { name: 'databases', label: '🗄️ Databases', icon: '🗄️', color: 'text-orange-400' },
    { name: 'web', label: '🌐 Web Technologies', icon: '🌐', color: 'text-pink-400' }
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">💻 Edit Skills</h2>
      <p className="text-gray-400 mb-6">Separate skills with commas. Add new categories as needed.</p>
      
      {/* Add New Category */}
      <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">Add New Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Cloud Platforms, Soft Skills"
            className="flex-1 p-2 rounded bg-gray-700"
          />
          <button onClick={addCategory} className="bg-accent px-4 py-2 rounded hover:bg-blue-600">
            Add Category
          </button>
        </div>
      </div>
      
      {/* Existing Categories */}
      <div className="space-y-6">
        {skillCategories.map(({ name, label, icon, color }) => (
          skills[name] && (
            <div key={name} className="border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-semibold text-lg">
                  <span className={color}>{icon}</span> {label}
                </label>
                <button
                  onClick={() => setEditingCategory(editingCategory === name ? null : name)}
                  className="text-accent text-sm"
                >
                  {editingCategory === name ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {editingCategory === name ? (
                <textarea
                  value={skills[name] ? skills[name].join(', ') : ''}
                  onChange={(e) => updateSkills(name, e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-accent outline-none"
                  rows="3"
                  placeholder="Python, SQL, JavaScript, React, Tableau"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills[name] && skills[name].length > 0 ? (
                    skills[name].map((skill, idx) => (
                      <span key={idx} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">No skills added yet. Click Edit to add.</p>
                  )}
                </div>
              )}
            </div>
          )
        ))}
        
        {/* Dynamic Categories (user-added) */}
        {Object.keys(skills).filter(key => !skillCategories.some(c => c.name === key)).map(category => (
          <div key={category} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold text-lg capitalize">
                📁 {category}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(editingCategory === category ? null : category)}
                  className="text-accent text-sm"
                >
                  {editingCategory === category ? 'Cancel' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {editingCategory === category ? (
              <textarea
                value={skills[category] ? skills[category].join(', ') : ''}
                onChange={(e) => updateSkills(category, e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-accent outline-none"
                rows="3"
                placeholder="Skill 1, Skill 2, Skill 3"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills[category] && skills[category].length > 0 ? (
                  skills[category].map((skill, idx) => (
                    <span key={idx} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No skills added yet. Click Edit to add.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;