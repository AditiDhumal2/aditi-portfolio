import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const ProjectsTab = ({ projects, setProjects, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImages, setUploadingImages] = useState({});

  const addProject = async () => {
    const newProject = {
      title: "New Project",
      problem: "",
      dataset: "",
      methodology: "",
      tools: "",
      results: "",
      impact: "",
      images: [],
      githubLink: "",
      deployedLink: "",
      documentation: {
        title: "",
        link: "",
        description: ""
      },
      preprint: {
        title: "",
        doi: "",
        link: ""
      },
      publication: {
        title: "",
        doi: "",
        link: "",
        conference: ""
      },
      challenges: "",
      futureWork: "",
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

  const updateProject = async (id, updatedProject) => {
    try {
      const response = await axios.put(`/api/projects/${id}`, updatedProject);
      await fetchAllData();
      showMessage('Project updated!');
      setEditingProject(null);
    } catch (error) {
      showMessage('Error updating project', true);
    }
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
      const project = projects.find(p => p._id === projectId);
      const updatedImages = [...(project.images || []), imageUrl];
      await updateProject(projectId, { ...project, images: updatedImages });
      showMessage('✅ Image uploaded!');
    } catch (error) {
      showMessage('❌ Upload failed', true);
    } finally {
      setUploading(false);
      setUploadingImages(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const removeProjectImage = async (projectId, imageIndex) => {
    const project = projects.find(p => p._id === projectId);
    const updatedImages = project.images.filter((_, idx) => idx !== imageIndex);
    await updateProject(projectId, { ...project, images: updatedImages });
    showMessage('Image removed');
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
              <h3 className="text-lg font-bold text-accent">
                {editingProject === project._id ? 'Editing:' : '📊'} {project.title || 'Untitled Project'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(editingProject === project._id ? null : project._id)}
                  className="bg-blue-500 px-3 py-1 rounded text-sm"
                >
                  {editingProject === project._id ? 'Cancel' : 'Edit'}
                </button>
                <button onClick={() => deleteProject(project._id)} className="bg-red-500 px-3 py-1 rounded text-sm">
                  Delete
                </button>
              </div>
            </div>
            
            {editingProject === project._id ? (
              <div className="grid grid-cols-1 gap-4">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-blue-400">Project Title *</label>
                    <input
                      value={project.title || ''}
                      onChange={(e) => updateProject(project._id, {...project, title: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Project Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-purple-400">Tech Stack</label>
                    <input
                      value={project.tools || ''}
                      onChange={(e) => updateProject(project._id, {...project, tools: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="Python, Pandas, Scikit-learn, Tableau"
                    />
                  </div>
                </div>
                
                {/* Problem Statement */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-red-400">🎯 Problem Statement</label>
                  <textarea
                    value={project.problem || ''}
                    onChange={(e) => updateProject(project._id, {...project, problem: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="What problem does this solve?"
                    rows="3"
                  />
                </div>
                
                {/* Dataset */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-blue-400">📊 Dataset Used</label>
                  <input
                    value={project.dataset || ''}
                    onChange={(e) => updateProject(project._id, {...project, dataset: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Describe dataset: size, source, features"
                  />
                </div>
                
                {/* Methodology */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">⚙️ Methodology & Approach</label>
                  <textarea
                    value={project.methodology || ''}
                    onChange={(e) => updateProject(project._id, {...project, methodology: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Explain your approach, algorithms used, data processing steps"
                    rows="3"
                  />
                </div>
                
                {/* Results */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-yellow-400">📈 Results & Insights</label>
                  <textarea
                    value={project.results || ''}
                    onChange={(e) => updateProject(project._id, {...project, results: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Include specific metrics: accuracy, precision, recall, business impact"
                    rows="3"
                  />
                </div>
                
                {/* Impact */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-orange-400">🚀 Real-World Impact</label>
                  <textarea
                    value={project.impact || ''}
                    onChange={(e) => updateProject(project._id, {...project, impact: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Quantify the impact (e.g., reduced waste by 23%, saved $45k annually)"
                    rows="2"
                  />
                </div>
                
                {/* Links */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">🐙 GitHub Repository</label>
                    <input
                      value={project.githubLink || ''}
                      onChange={(e) => updateProject(project._id, {...project, githubLink: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">🌐 Deployed / Live Demo Link</label>
                    <input
                      value={project.deployedLink || ''}
                      onChange={(e) => updateProject(project._id, {...project, deployedLink: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="https://project-demo.vercel.app"
                    />
                  </div>
                </div>
                
                {/* Documentation Section */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <h4 className="text-md font-bold text-blue-400 mb-3">📄 Documentation</h4>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        value={project.documentation?.title || ''}
                        onChange={(e) => updateProject(project._id, {...project, documentation: { ...project.documentation, title: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Documentation Title"
                      />
                      <input
                        value={project.documentation?.link || ''}
                        onChange={(e) => updateProject(project._id, {...project, documentation: { ...project.documentation, link: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Link to documentation"
                      />
                      <input
                        value={project.documentation?.description || ''}
                        onChange={(e) => updateProject(project._id, {...project, documentation: { ...project.documentation, description: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Short description"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Add project documentation, report, or detailed write-up</p>
                  </div>
                </div>
                
                {/* Publication Details */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <h4 className="text-md font-bold text-accent mb-3">📄 Publication & Preprint Details</h4>
                  
                  {/* Preprint */}
                  <div className="bg-gray-700/30 p-3 rounded-lg mb-3">
                    <label className="block text-sm font-semibold mb-2 text-blue-400">📑 Preprint</label>
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        value={project.preprint?.title || ''}
                        onChange={(e) => updateProject(project._id, {...project, preprint: { ...project.preprint, title: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Preprint Title"
                      />
                      <input
                        value={project.preprint?.doi || ''}
                        onChange={(e) => updateProject(project._id, {...project, preprint: { ...project.preprint, doi: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="DOI (e.g., 10.xxxx/xxxxx)"
                      />
                      <input
                        value={project.preprint?.link || ''}
                        onChange={(e) => updateProject(project._id, {...project, preprint: { ...project.preprint, link: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Link to preprint"
                      />
                    </div>
                  </div>
                  
                  {/* Publication */}
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <label className="block text-sm font-semibold mb-2 text-green-400">📖 Published Paper</label>
                    <div className="grid md:grid-cols-4 gap-2">
                      <input
                        value={project.publication?.title || ''}
                        onChange={(e) => updateProject(project._id, {...project, publication: { ...project.publication, title: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Paper Title"
                      />
                      <input
                        value={project.publication?.conference || ''}
                        onChange={(e) => updateProject(project._id, {...project, publication: { ...project.publication, conference: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Conference/Journal"
                      />
                      <input
                        value={project.publication?.doi || ''}
                        onChange={(e) => updateProject(project._id, {...project, publication: { ...project.publication, doi: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="DOI"
                      />
                      <input
                        value={project.publication?.link || ''}
                        onChange={(e) => updateProject(project._id, {...project, publication: { ...project.publication, link: e.target.value }})}
                        className="w-full bg-gray-700 p-2 rounded"
                        placeholder="Link to paper"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Multiple Images Upload */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <label className="block text-sm font-semibold mb-2">🖼️ Project Images / Screenshots</label>
                  
                  {/* Display existing images */}
                  {project.images && project.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt={`Project ${idx + 1}`} className="w-24 h-24 object-cover rounded" />
                          <button
                            onClick={() => removeProjectImage(project._id, idx)}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs"
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
                          uploadProjectImage(e.target.files[0], project._id);
                        }
                      }}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:bg-accent file:text-white file:cursor-pointer"
                    />
                    {uploadingImages[project._id] && (
                      <span className="text-accent text-sm">Uploading...</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload multiple screenshots, graphs, or visualizations from your project</p>
                </div>
                
                {/* Challenges & Future Work */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">⚠️ Challenges Faced</label>
                    <textarea
                      value={project.challenges || ''}
                      onChange={(e) => updateProject(project._id, {...project, challenges: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="What challenges did you encounter and how did you overcome them?"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">🔮 Future Work</label>
                    <textarea
                      value={project.futureWork || ''}
                      onChange={(e) => updateProject(project._id, {...project, futureWork: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded"
                      placeholder="What improvements or extensions could be made?"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-red-400">Problem:</strong> {project.problem?.substring(0, 100)}...</p>
                <p><strong className="text-green-400">Methodology:</strong> {project.methodology?.substring(0, 100)}...</p>
                <p><strong className="text-purple-400">Tech Stack:</strong> {project.tools}</p>
                <p><strong className="text-yellow-400">Results:</strong> {project.results?.substring(0, 100)}...</p>
                {project.images && project.images.length > 0 && (
                  <p><strong>Images:</strong> {project.images.length} uploaded</p>
                )}
                {project.githubLink && <p><strong>GitHub:</strong> <a href={project.githubLink} target="_blank" className="text-accent">Repository</a></p>}
                {project.deployedLink && <p><strong>Live Demo:</strong> <a href={project.deployedLink} target="_blank" className="text-accent">View Project</a></p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;