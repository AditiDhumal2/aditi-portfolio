import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ResearchTab = ({ research, setResearch, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingResearch, setEditingResearch] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'Conference Paper',
    status: 'Submitted',
    description: '',
    abstract: '',
    doi: '',
    authors: '',
    venue: '',
    year: '',
    paperLink: '',
    pdfLink: '',
    arxivLink: '',
    citations: '',
    impact: '',
    theme: 'Information Systems',
    featured: false,
    image: '',
    skills: [],
    projectLink: '',
    order: 0
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customTheme, setCustomTheme] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);

  const addResearch = async () => {
    const newResearch = {
      title: "New Research Paper",
      type: "Conference Paper",
      status: "Submitted",
      description: "",
      abstract: "",
      doi: "",
      authors: "",
      venue: "",
      year: new Date().getFullYear().toString(),
      paperLink: "",
      pdfLink: "",
      arxivLink: "",
      citations: "",
      impact: "",
      theme: "Information Systems",
      featured: false,
      image: "",
      skills: [],
      projectLink: "",
      order: research.length
    };
    try {
      await axios.post('/api/research', newResearch);
      await fetchAllData();
      showMessage('Research added!');
    } catch (error) {
      console.error('Add error:', error);
      showMessage('Error adding research', true);
    }
  };

  const startEdit = (item) => {
    setEditingResearch(item._id);
    setEditForm({
      title: item.title || '',
      type: item.type || 'Conference Paper',
      status: item.status || 'Submitted',
      description: item.description || '',
      abstract: item.abstract || '',
      doi: item.doi || '',
      authors: item.authors || '',
      venue: item.venue || '',
      year: item.year || '',
      paperLink: item.paperLink || '',
      pdfLink: item.pdfLink || '',
      arxivLink: item.arxivLink || '',
      citations: item.citations || '',
      impact: item.impact || '',
      theme: item.theme || 'Information Systems',
      featured: item.featured || false,
      image: item.image || '',
      skills: item.skills || [],
      projectLink: item.projectLink || '',
      order: item.order || 0
    });
    // Check if the current theme is in the preset list
    const presetThemes = [
      'Information Systems',
      'Decision Support',
      'Artificial Intelligence',
      'Computer Vision',
      'Natural Language Processing',
      'Data Analytics',
      'Human-Computer Interaction',
      'Educational Technology',
      'Social Computing',
      'Sustainable Systems'
    ];
    if (item.theme && !presetThemes.includes(item.theme)) {
      setShowCustomTheme(true);
      setCustomTheme(item.theme);
    } else {
      setShowCustomTheme(false);
      setCustomTheme('');
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/research/${id}`, editForm);
      await fetchAllData();
      showMessage('Research updated!');
      setEditingResearch(null);
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Error updating research', true);
    }
  };

  const cancelEdit = () => {
    setEditingResearch(null);
    setShowCustomTheme(false);
    setCustomTheme('');
  };

  const deleteResearch = async (id) => {
    if (window.confirm('Delete this research?')) {
      try {
        await axios.delete(`/api/research/${id}`);
        await fetchAllData();
        showMessage('Research deleted!');
      } catch (error) {
        console.error('Delete error:', error);
        showMessage('Error deleting research', true);
      }
    }
  };

  const uploadResearchImage = async (file) => {
    setUploadingImage(true);
    setUploading(true);
    showMessage('📤 Uploading image...');
    try {
      const imageUrl = await uploadToCloudinary(file);
      setEditForm({...editForm, image: imageUrl});
      showMessage('✅ Image uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('❌ Upload failed', true);
    } finally {
      setUploadingImage(false);
      setUploading(false);
    }
  };

  const removeImage = () => {
    setEditForm({...editForm, image: ''});
    showMessage('Image removed');
  };

  // Save order function
  const saveOrder = async (orderedResearch) => {
    try {
      for (const item of orderedResearch) {
        await axios.put(`/api/research/${item._id}`, { order: item.order });
      }
      showMessage('Order updated!');
    } catch (error) {
      console.error('Order save error:', error);
      showMessage('Error saving order', true);
    }
  };

  const presetThemes = [
    'Information Systems',
    'Decision Support',
    'Artificial Intelligence',
    'Computer Vision',
    'Natural Language Processing',
    'Data Analytics',
    'Human-Computer Interaction',
    'Educational Technology',
    'Social Computing',
    'Sustainable Systems',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Reinforcement Learning',
    'Knowledge Representation',
    'Human-AI Interaction',
    'AI Ethics',
    'Explainable AI',
    'Data Science',
    'Big Data',
    'Cloud Computing',
    'Edge Computing',
    'IoT',
    'Cybersecurity',
    'Software Engineering',
    'Web Development',
    'Mobile Computing',
    'Database Systems',
    'Information Retrieval',
    'Recommendation Systems'
  ];

  const statusOptions = [
    'Under Peer Review – Discover Education (Springer Nature)',
    'Peer-Reviewed Journal Publication',
    'Under Review (Indexed Journal)',
    'Preprint (Research Dissemination Stage)',
    'Conference Proceedings',
    'Submitted',
    'In Progress',
    'Published'
  ];

  const typeOptions = [
    'Conference Paper',
    'Journal Article',
    'Literature Review',
    'Preprint',
    'Research Report',
    'Book Chapter'
  ];

  // Handle theme selection - if "Other" is selected, show custom input
  const handleThemeChange = (value) => {
    if (value === 'other') {
      setShowCustomTheme(true);
      setEditForm({...editForm, theme: ''});
    } else {
      setShowCustomTheme(false);
      setEditForm({...editForm, theme: value});
      setCustomTheme('');
    }
  };

  const handleCustomThemeChange = (value) => {
    setCustomTheme(value);
    setEditForm({...editForm, theme: value});
  };

  // Sort by order
  const sortedResearch = [...research].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={addResearch} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
          + Add Research Paper
        </button>
        <p className="text-sm text-gray-400">⬆⬇ Use arrows to reorder</p>
      </div>
      
      <div className="space-y-6">
        {sortedResearch.map((item, index) => (
          <div key={item._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-mono">#{index + 1}</span>
                <h3 className="text-lg font-bold text-accent">
                  {editingResearch === item._id ? '✏️ Editing:' : '📚'} {item.title || 'Untitled Research'}
                  {item.featured && <span className="ml-2 text-yellow-400 text-sm">⭐ Featured</span>}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <div className="flex flex-col mr-2">
                  <button
                    onClick={() => {
                      const newResearch = [...research];
                      const idx = newResearch.findIndex(r => r._id === item._id);
                      if (idx > 0) {
                        [newResearch[idx], newResearch[idx - 1]] = [newResearch[idx - 1], newResearch[idx]];
                        newResearch.forEach((r, i) => r.order = i);
                        setResearch(newResearch);
                        saveOrder(newResearch);
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
                      const newResearch = [...research];
                      const idx = newResearch.findIndex(r => r._id === item._id);
                      if (idx < newResearch.length - 1) {
                        [newResearch[idx], newResearch[idx + 1]] = [newResearch[idx + 1], newResearch[idx]];
                        newResearch.forEach((r, i) => r.order = i);
                        setResearch(newResearch);
                        saveOrder(newResearch);
                      }
                    }}
                    disabled={index === sortedResearch.length - 1}
                    className={`text-xs px-2 py-0.5 rounded ${
                      index === sortedResearch.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-accent text-white'
                    }`}
                  >
                    ↓
                  </button>
                </div>
                
                {editingResearch === item._id ? (
                  <>
                    <button onClick={() => saveEdit(item._id)} className="bg-green-500 px-3 py-1 rounded text-sm">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                    <button onClick={() => deleteResearch(item._id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
            
            {editingResearch === item._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Authors (Role)</label>
                  <input
                    value={editForm.authors}
                    onChange={(e) => setEditForm({...editForm, authors: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="First Author, Co-author"
                  />
                </div>
                
                {/* Type and Status */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                {/* Theme with Custom Option */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Research Theme</label>
                  <select
                    value={showCustomTheme ? 'other' : editForm.theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    {presetThemes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                    <option value="other">✏️ Other (Type manually)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">⭐ Featured Research</label>
                  <select
                    value={editForm.featured ? 'true' : 'false'}
                    onChange={(e) => setEditForm({...editForm, featured: e.target.value === 'true'})}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    <option value="false">No</option>
                    <option value="true">⭐ Yes (Featured)</option>
                  </select>
                </div>
                
                {/* Custom Theme Input - shows when "Other" is selected */}
                {showCustomTheme && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-1">Custom Theme</label>
                    <input
                      type="text"
                      value={customTheme}
                      onChange={(e) => handleCustomThemeChange(e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded border border-accent/50"
                      placeholder="Enter your custom research theme..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Type your own research theme (e.g., "Explainable AI in Healthcare")</p>
                  </div>
                )}
                
                {/* Venue and Year */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Venue / Journal</label>
                  <input
                    value={editForm.venue}
                    onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Discover Education (Springer Nature)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Year</label>
                  <input
                    value={editForm.year}
                    onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                </div>
                
                {/* DOI and Citations */}
                <div>
                  <label className="block text-sm font-semibold mb-1">DOI</label>
                  <input
                    value={editForm.doi}
                    onChange={(e) => setEditForm({...editForm, doi: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Citations</label>
                  <input
                    value={editForm.citations}
                    onChange={(e) => setEditForm({...editForm, citations: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Number of citations"
                  />
                </div>
                
                {/* Abstract */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Abstract / Research Focus</label>
                  <textarea
                    value={editForm.abstract}
                    onChange={(e) => setEditForm({...editForm, abstract: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                    placeholder="Brief summary of the research..."
                  />
                </div>
                
                {/* Description / Key Contributions */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Key Contributions (one per line)</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="4"
                    placeholder="Designed and developed the platform&#10;Conducted mixed-method user evaluation&#10;Analyzed student perceptions"
                  />
                  <p className="text-xs text-gray-500 mt-1">Each contribution will appear as a bullet point</p>
                </div>
                
                {/* Impact */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">🔥 Impact Statement</label>
                  <textarea
                    value={editForm.impact}
                    onChange={(e) => setEditForm({...editForm, impact: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="2"
                    placeholder="How does this research make an impact?"
                  />
                </div>
                
                {/* Skills */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">🛠️ Skills (comma-separated)</label>
                  <input
                    value={editForm.skills?.join(', ') || ''}
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Information Systems, Research Methodology, User Research"
                  />
                </div>
                
                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">📸 Research Image</label>
                  {editForm.image && (
                    <div className="relative inline-block mb-2">
                      <img src={editForm.image} alt="Research" className="w-32 h-32 object-cover rounded" />
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && uploadResearchImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:bg-accent file:text-white file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a research image, diagram, or certificate</p>
                </div>
                
                {/* Links */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Paper Link</label>
                  <input
                    value={editForm.paperLink}
                    onChange={(e) => setEditForm({...editForm, paperLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">PDF Link</label>
                  <input
                    value={editForm.pdfLink}
                    onChange={(e) => setEditForm({...editForm, pdfLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ArXiv Link</label>
                  <input
                    value={editForm.arxivLink}
                    onChange={(e) => setEditForm({...editForm, arxivLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">💻 Project Link</label>
                  <input
                    value={editForm.projectLink}
                    onChange={(e) => setEditForm({...editForm, projectLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://github.com/your-project"
                  />
                </div>
              </div>
            ) : (
              // View Mode
              <div className="text-sm text-gray-300">
                {item.featured && <p className="text-yellow-400 font-bold">⭐ Featured Research</p>}
                <p><strong className="text-blue-400">Theme:</strong> {item.theme || 'Not specified'}</p>
                <p><strong className="text-blue-400">Authors:</strong> {item.authors || 'Not specified'}</p>
                <p><strong className="text-blue-400">Venue:</strong> {item.venue || 'Not specified'}</p>
                <p><strong className="text-blue-400">Year:</strong> {item.year || 'Not specified'}</p>
                <p><strong className="text-blue-400">Status:</strong> {item.status}</p>
                {item.image && (
                  <div className="mt-2">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                  </div>
                )}
                {item.skills && item.skills.length > 0 && (
                  <p><strong className="text-blue-400">Skills:</strong> {item.skills.join(', ')}</p>
                )}
                {item.impact && (
                  <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/30">
                    <strong className="text-blue-400">🔥 Impact:</strong> {item.impact}
                  </div>
                )}
                {item.doi && (
                  <p><strong className="text-blue-400">DOI:</strong> 
                    <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      {item.doi}
                    </a>
                  </p>
                )}
                {item.paperLink && <p><strong>Paper:</strong> <a href={item.paperLink} target="_blank" className="text-accent">View →</a></p>}
                {item.projectLink && <p><strong>Project:</strong> <a href={item.projectLink} target="_blank" className="text-accent">View →</a></p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchTab;