import React, { useState } from 'react';
import axios from 'axios';

const ResearchTab = ({ research, setResearch, showMessage, fetchAllData }) => {
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
    impact: ''
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
      impact: item.impact || ''
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

  return (
    <div>
      <button onClick={addResearch} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Research Paper
      </button>
      
      <div className="space-y-4">
        {research.map(item => (
          <div key={item._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">
                {editingResearch === item._id ? 'Editing:' : '📚'} {item.title || 'Untitled Research'}
              </h3>
              <div className="flex gap-2">
                {editingResearch === item._id ? (
                  <>
                    <button onClick={() => saveEdit(item._id)} className="bg-green-500 px-3 py-1 rounded text-sm">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="bg-blue-500 px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteResearch(item._id)} className="bg-red-500 px-3 py-1 rounded text-sm">
                      Delete
                    </button>
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
                  <label className="block text-sm font-semibold mb-1">Authors</label>
                  <input
                    value={editForm.authors}
                    onChange={(e) => setEditForm({...editForm, authors: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <input
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
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
                  <input
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">DOI (Digital Object Identifier)</label>
                  <input
                    value={editForm.doi}
                    onChange={(e) => setEditForm({...editForm, doi: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="10.xxxx/xxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">Visitors can click this to go directly to the paper</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Citations Count</label>
                  <input
                    value={editForm.citations}
                    onChange={(e) => setEditForm({...editForm, citations: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Number of citations"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Abstract / Summary</label>
                  <textarea
                    value={editForm.abstract}
                    onChange={(e) => setEditForm({...editForm, abstract: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="4"
                    placeholder="Brief summary of the research..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Detailed Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                    placeholder="More detailed description of the research..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Paper Link (URL)</label>
                  <input
                    value={editForm.paperLink}
                    onChange={(e) => setEditForm({...editForm, paperLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://ieeexplore.ieee.org/document/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">PDF Link</label>
                  <input
                    value={editForm.pdfLink}
                    onChange={(e) => setEditForm({...editForm, pdfLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://arxiv.org/pdf/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ArXiv Link</label>
                  <input
                    value={editForm.arxivLink}
                    onChange={(e) => setEditForm({...editForm, arxivLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://arxiv.org/abs/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Research Impact</label>
                  <input
                    value={editForm.impact}
                    onChange={(e) => setEditForm({...editForm, impact: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="e.g., 50+ citations, Featured in journal cover"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-blue-400">Authors:</strong> {item.authors || 'Not specified'}</p>
                <p><strong className="text-blue-400">Venue:</strong> {item.venue || 'Not specified'}</p>
                <p><strong className="text-blue-400">Year:</strong> {item.year || 'Not specified'}</p>
                <p><strong className="text-blue-400">Status:</strong> {item.status}</p>
                {item.doi && (
                  <p><strong className="text-blue-400">DOI:</strong> 
                    <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      {item.doi}
                    </a>
                  </p>
                )}
                {item.paperLink && (
                  <p><strong className="text-blue-400">Link:</strong> 
                    <a href={item.paperLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                      View Publication →
                    </a>
                  </p>
                )}
                {item.citations && <p><strong className="text-blue-400">Citations:</strong> {item.citations}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchTab;