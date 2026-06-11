import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ProjectsTab = ({ projects, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({});

  const addProject = async () => {
    const newProject = {
      title: "New Project",
      problem: "",
      dataset: "",
      methodology: "",
      tools: "",
      results: "",
      impact: "",
      image: "",
      githubLink: "",
      deployedLink: "",
      featured: true
    };
    try {
      await axios.post('/api/projects', newProject);
      await fetchAllData();
      showMessage('Project added!');
    } catch (error) {
      showMessage('Error adding project', true);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project._id);
    setEditForm({ ...project });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`/api/projects/${id}`, editForm);
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
        await axios.delete(`/api/projects/${id}`);
        await fetchAllData();
        showMessage('Project deleted!');
      } catch (error) {
        showMessage('Error deleting project', true);
      }
    }
  };

  const uploadProjectImage = async (file, projectId) => {
    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setEditForm({ ...editForm, image: imageUrl });
      await axios.put(`/api/projects/${projectId}`, { ...editForm, image: imageUrl });
      await fetchAllData();
      showMessage('✅ Image uploaded!');
    } catch (error) {
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={addProject} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add New Project
      </button>
      
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">📊 {project.title}</h3>
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
                    <input value={editForm.title || ''} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tech Stack</label>
                    <input value={editForm.tools || ''} onChange={(e) => setEditForm({...editForm, tools: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-red-400">Problem Statement</label>
                  <textarea value={editForm.problem || ''} onChange={(e) => setEditForm({...editForm, problem: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Dataset Used</label>
                  <input value={editForm.dataset || ''} onChange={(e) => setEditForm({...editForm, dataset: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">Methodology</label>
                  <textarea value={editForm.methodology || ''} onChange={(e) => setEditForm({...editForm, methodology: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-yellow-400">Results</label>
                  <textarea value={editForm.results || ''} onChange={(e) => setEditForm({...editForm, results: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-orange-400">Impact</label>
                  <textarea value={editForm.impact || ''} onChange={(e) => setEditForm({...editForm, impact: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">GitHub Link</label>
                  <input value={editForm.githubLink || ''} onChange={(e) => setEditForm({...editForm, githubLink: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Project Image</label>
                  {editForm.image && <img src={editForm.image} alt="Project" className="w-48 h-32 object-cover rounded mb-2" />}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadProjectImage(e.target.files[0], project._id)} className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:bg-accent file:text-white file:cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong>Problem:</strong> {project.problem?.substring(0, 100)}...</p>
                <p><strong>Tech:</strong> {project.tools}</p>
                <p><strong>Results:</strong> {project.results?.substring(0, 80)}...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;