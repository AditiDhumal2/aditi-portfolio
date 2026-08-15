import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ProjectsTab = ({ projects, setProjects, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadingImages, setUploadingImages] = useState({});

  const addProject = async () => {
    const newProject = {
      title: "New Project",
      subtitle: "Project subtitle",
      overview: "Brief overview of what this project does and why it matters.",
      features: "Feature 1, Feature 2, Feature 3, Feature 4, Feature 5",
      tools: "Python, Pandas, Scikit-learn, Tableau",
      images: [],
      githubLink: "",
      deployedLink: "",
      documentation: {
        title: "",
        link: "",
        description: ""
      },
      featured: true,
      order: projects.length
    };
    try {
      const response = await axios.post('/api/projects', newProject);
      await fetchAllData();
      showMessage('Project added!');
    } catch (error) {
      showMessage('Error adding project', true);
    }
  };

  const startEdit = (project) => {
    setEditingProject(project._id);
    setEditForm(JSON.parse(JSON.stringify(project)));
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`/api/projects/${id}`, editForm);
      await fetchAllData();
      showMessage('Project updated!');
      setEditingProject(null);
      setEditForm({});
    } catch (error) {
      showMessage('Error updating project', true);
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditForm({});
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
    setUploadingImages(prev => ({ ...prev, [projectId]: true }));
    showMessage('Uploading image...');
    try {
      const imageUrl = await uploadToCloudinary(file);
      const updatedImages = [...(editForm.images || []), imageUrl];
      setEditForm({ ...editForm, images: updatedImages });
      showMessage('✅ Image uploaded!');
    } catch (error) {
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
      setUploadingImages(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const removeProjectImage = (imageIndex) => {
    const updatedImages = editForm.images.filter((_, idx) => idx !== imageIndex);
    setEditForm({ ...editForm, images: updatedImages });
    showMessage('Image removed');
  };

  const updateField = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const updateNestedField = (parent, field, value) => {
    setEditForm({
      ...editForm,
      [parent]: { ...editForm[parent], [field]: value }
    });
  };

  // ============ REORDER FUNCTIONS ============
  const moveProjectUp = (index) => {
    if (index === 0) return;
    const newProjects = [...projects];
    [newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]];
    newProjects.forEach((p, i) => p.order = i);
    setProjects(newProjects);
    saveOrder(newProjects);
  };

  const moveProjectDown = (index) => {
    if (index === projects.length - 1) return;
    const newProjects = [...projects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    newProjects.forEach((p, i) => p.order = i);
    setProjects(newProjects);
    saveOrder(newProjects);
  };

  const saveOrder = async (orderedProjects) => {
    try {
      for (const project of orderedProjects) {
        await axios.put(`/api/projects/${project._id}`, { order: project.order });
      }
      showMessage('Project order updated!');
    } catch (error) {
      showMessage('Error saving order', true);
    }
  };

  // Sort projects by order
  const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={addProject} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
          + Add New Project
        </button>
        <p className="text-sm text-gray-400">⬆⬇ Use arrows to reorder</p>
      </div>
      
      <div className="space-y-4">
        {sortedProjects.map((project, index) => (
          <div key={project._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-mono">#{index + 1}</span>
                <h3 className="text-lg font-bold text-accent">
                  {editingProject === project._id ? '✏️ Editing:' : '📊'} {project.title || 'Untitled Project'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <div className="flex flex-col mr-2">
                  <button
                    onClick={() => moveProjectUp(index)}
                    disabled={index === 0}
                    className={`text-xs px-2 py-0.5 rounded ${
                      index === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-accent text-white'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveProjectDown(index)}
                    disabled={index === sortedProjects.length - 1}
                    className={`text-xs px-2 py-0.5 rounded ${
                      index === sortedProjects.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-accent text-white'
                    }`}
                  >
                    ↓
                  </button>
                </div>
                
                {editingProject === project._id ? (
                  <>
                    <button onClick={() => saveEdit(project._id)} className="bg-green-500 px-3 py-1 rounded text-sm">
                      💾 Save
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(project)} className="bg-blue-500 px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteProject(project._id)} className="bg-red-500 px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {editingProject === project._id ? (
              <div className="grid grid-cols-1 gap-4">
                {/* ===== BASIC INFO ===== */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-400">Project Title *</label>
                    <input
                      value={editForm.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Project Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-purple-400">Subtitle</label>
                    <input
                      value={editForm.subtitle || ''}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Brief subtitle (appears under title)"
                    />
                  </div>
                </div>
                
                {/* ===== OVERVIEW ===== */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">📝 Overview</label>
                  <textarea
                    value={editForm.overview || ''}
                    onChange={(e) => updateField('overview', e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="2-3 lines explaining what this project does"
                    rows="2"
                  />
                </div>
                
                {/* ===== KEY FEATURES ===== */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-yellow-400">✨ Key Features (comma-separated)</label>
                  <textarea
                    value={editForm.features || ''}
                    onChange={(e) => updateField('features', e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="AI Career Advisor, Skill Gap Analysis, Resume Analysis, Salary Prediction, Job Market Analytics"
                    rows="2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate features with commas</p>
                </div>
                
                {/* ===== TECH STACK ===== */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-purple-400">🛠 Tech Stack</label>
                  <input
                    value={editForm.tools || ''}
                    onChange={(e) => updateField('tools', e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Python, Pandas, Scikit-learn, Tableau, SQLite"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                </div>
                
                {/* ===== LINKS ===== */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">🐙 GitHub Repository</label>
                    <input
                      value={editForm.githubLink || ''}
                      onChange={(e) => updateField('githubLink', e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">🌐 Live Demo</label>
                    <input
                      value={editForm.deployedLink || ''}
                      onChange={(e) => updateField('deployedLink', e.target.value)}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="https://project-demo.vercel.app"
                    />
                  </div>
                </div>
                
                {/* ===== DOCUMENTATION ===== */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <h4 className="text-md font-bold text-blue-400 mb-3">📄 Documentation</h4>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        value={editForm.documentation?.title || ''}
                        onChange={(e) => updateNestedField('documentation', 'title', e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Documentation Title"
                      />
                      <input
                        value={editForm.documentation?.link || ''}
                        onChange={(e) => updateNestedField('documentation', 'link', e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Link to documentation"
                      />
                      <input
                        value={editForm.documentation?.description || ''}
                        onChange={(e) => updateNestedField('documentation', 'description', e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Short description"
                      />
                    </div>
                  </div>
                </div>
                
                {/* ===== IMAGES ===== */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <label className="block text-sm font-semibold mb-2">🖼️ Project Images / Screenshots</label>
                  
                  {editForm.images && editForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editForm.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt={`Project ${idx + 1}`} className="w-24 h-24 object-cover rounded" />
                          <button
                            onClick={() => removeProjectImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          uploadProjectImage(e.target.files[0], project._id);
                        }
                      }}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:bg-accent file:text-white file:cursor-pointer"
                    />
                    {uploadingImages[project._id] && (
                      <span className="text-accent text-sm">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload screenshots, graphs, or visualizations</p>
                </div>
              </div>
            ) : (
              // ===== VIEW MODE =====
              <div className="text-sm text-gray-300 space-y-1">
                <p><strong className="text-gray-400">Position:</strong> #{index + 1}</p>
                {project.subtitle && <p><strong className="text-gray-400">Subtitle:</strong> {project.subtitle}</p>}
                {project.overview && <p className="text-gray-400"><strong>Overview:</strong> {project.overview}</p>}
                {project.features && <p><strong className="text-gray-400">Features:</strong> {project.features}</p>}
                <p><strong className="text-gray-400">Tech Stack:</strong> {project.tools || 'N/A'}</p>
                {project.images && project.images.length > 0 && (
                  <p><strong className="text-gray-400">Images:</strong> {project.images.length} uploaded</p>
                )}
                <div className="flex gap-3 mt-2">
                  {project.githubLink && <a href={project.githubLink} target="_blank" className="text-accent text-xs">🐙 GitHub</a>}
                  {project.deployedLink && <a href={project.deployedLink} target="_blank" className="text-accent text-xs">🌐 Live Demo</a>}
                  {project.documentation?.link && <a href={project.documentation.link} target="_blank" className="text-accent text-xs">📘 Docs</a>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;