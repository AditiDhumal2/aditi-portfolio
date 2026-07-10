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
    theme: 'Decision Support Systems',
    featured: false,
    image: '',
    skills: [],
    projectLink: '',
    order: 0
  });

  const addResearch = async () => {
    const newResearch = {
      title: "New Research Paper",
      type: "Conference Paper",
      status: "Under Review",
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
      theme: "Decision Support Systems",
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
      theme: item.theme || 'Decision Support Systems',
      featured: item.featured || false,
      image: item.image || '',
      skills: item.skills || [],
      projectLink: item.projectLink || '',
      order: item.order || 0
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/research/${id}`, editForm);
      await fetchAllData();
      showMessage('Research updated!');
      setEditingResearch(null);
    } catch (error) {
      showMessage('Error updating research', true);
    }
  };

  const cancelEdit = () => {
    setEditingResearch(null);
  };

  const deleteResearch = async (id) => {
    if (window.confirm('Delete this research?')) {
      try {
        await axios.delete(`/api/research/${id}`);
        await fetchAllData();
        showMessage('Research deleted!');
      } catch (error) {
        showMessage('Error deleting research', true);
      }
    }
  };

  const uploadResearchImage = async (file) => {
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

  const themes = [
    'Human-Centered AI Systems',
    'Decision Support Systems',
    'Early Systems Exploration',
    'Information Systems',
    'Data Analytics'
  ];

  const statusOptions = [
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
      
      <div className="space-y-4">
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
                  <label className="block text-sm font-semibold mb-1">Venue / Journal</label>
                  <input
                    value={editForm.venue}
                    onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
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
                <div>
                  <label className="block text-sm font-semibold mb-1">Research Theme</label>
                  <select
                    value={editForm.theme}
                    onChange={(e) => setEditForm({...editForm, theme: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  >
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
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
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">📸 Research Image / Certificate</label>
                  {editForm.image && (
                    <img src={editForm.image} alt="Research" className="w-32 h-32 object-cover rounded mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && uploadResearchImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">🛠️ Skills / Technologies (comma-separated)</label>
                  <input
                    value={editForm.skills?.join(', ') || ''}
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Next.js, TypeScript, MongoDB, Research Methodology"
                  />
                </div>
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
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">🔥 Impact Statement</label>
                  <textarea
                    value={editForm.impact}
                    onChange={(e) => setEditForm({...editForm, impact: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="2"
                    placeholder="e.g., Improves career decision-making for engineering students..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Abstract</label>
                  <textarea
                    value={editForm.abstract}
                    onChange={(e) => setEditForm({...editForm, abstract: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description / Contribution</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-blue-400">Theme:</strong> {item.theme || 'Not specified'}</p>
                <p><strong className="text-blue-400">Authors:</strong> {item.authors || 'Not specified'}</p>
                <p><strong className="text-blue-400">Venue:</strong> {item.venue || 'Not specified'}</p>
                <p><strong className="text-blue-400">Status:</strong> {item.status}</p>
                {item.featured && <p className="text-yellow-400 font-bold">⭐ Featured Research</p>}
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