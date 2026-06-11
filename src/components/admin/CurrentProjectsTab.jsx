import React, { useState } from 'react';
import axios from 'axios';

const CurrentProjectsTab = ({ currentProjects, setCurrentProjects, showMessage, fetchAllData }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    progress: '0%',
    features: [],
    technologies: [],
    timeline: '',
    githubLink: '',
    demoLink: ''
  });

  const addProject = async () => {
    const newProject = {
      title: "New Project",
      description: "Project description",
      progress: "0%",
      features: ["Feature 1", "Feature 2"],
      technologies: ["Tech 1", "Tech 2"],
      timeline: "Launching soon",
      githubLink: "",
      demoLink: "",
      order: currentProjects.length
    };
    try {
      await axios.post('/api/current-projects', newProject);
      await fetchAllData();
      showMessage('Current project added!');
    } catch (error) {
      showMessage('Error adding project', true);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project._id);
    setEditForm({
      title: project.title || '',
      description: project.description || '',
      progress: project.progress || '0%',
      features: project.features || [],
      technologies: project.technologies || [],
      timeline: project.timeline || '',
      githubLink: project.githubLink || '',
      demoLink: project.demoLink || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/current-projects/${id}`, editForm);
      await fetchAllData();
      showMessage('Project updated!');
      setEditingProject(null);
    } catch (error) {
      showMessage('Error updating project', true);
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`/api/current-projects/${id}`);
        await fetchAllData();
        showMessage('Project deleted!');
      } catch (error) {
        showMessage('Error deleting project', true);
      }
    }
  };

  return (
    <div>
      <button onClick={addProject} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Current Project
      </button>
      
      <div className="space-y-6">
        {currentProjects.map(project => (
          <div key={project._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">
                🚀 {project.title}
              </h3>
              <div className="flex gap-2">
                {editingProject === project._id ? (
                  <>
                    <button onClick={() => saveEdit(project._id)} className="bg-green-500 px-3 py-1 rounded text-sm">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(project)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                    <button onClick={() => deleteProject(project._id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
            
            {editingProject === project._id ? (
              <div className="grid grid-cols-1 gap-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Progress (%)</label>
                    <input value={editForm.progress} onChange={(e) => setEditForm({...editForm, progress: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Features (one per line)</label>
                  <textarea value={editForm.features.join('\n')} onChange={(e) => setEditForm({...editForm, features: e.target.value.split('\n').filter(f => f.trim())})} className="w-full bg-gray-700 p-2 rounded" rows="4" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Technologies (comma-separated)</label>
                  <input value={editForm.technologies.join(', ')} onChange={(e) => setEditForm({...editForm, technologies: e.target.value.split(',').map(t => t.trim())})} className="w-full bg-gray-700 p-2 rounded" />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Timeline</label>
                    <input value={editForm.timeline} onChange={(e) => setEditForm({...editForm, timeline: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">GitHub Link</label>
                    <input value={editForm.githubLink} onChange={(e) => setEditForm({...editForm, githubLink: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Demo Link</label>
                    <input value={editForm.demoLink} onChange={(e) => setEditForm({...editForm, demoLink: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong>Progress:</strong> {project.progress}</p>
                <p><strong>Description:</strong> {project.description?.substring(0, 100)}...</p>
                <p><strong>Features:</strong> {project.features?.length} planned</p>
                <p><strong>Tech Stack:</strong> {project.technologies?.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentProjectsTab;