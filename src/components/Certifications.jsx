import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const CertificationsTab = ({ certifications, setCertifications, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingCert, setEditingCert] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    issuer: '',
    link: '',
    date: '',
    image: '',
    description: '',
    skills: [],
    credentialId: '',
    validity: '',
    grade: ''
  });

  const addCertification = async () => {
    const newCert = {
      name: "New Certification",
      issuer: "Issuer Name",
      link: "",
      date: new Date().getFullYear().toString(),
      image: "",
      description: "",
      skills: [],
      credentialId: "",
      validity: "",
      grade: ""
    };
    try {
      const response = await axios.post('/api/certifications', newCert);
      console.log('Add response:', response.data);
      await fetchAllData();
      showMessage('Certification added!');
    } catch (error) {
      console.error('Add error:', error.response?.data || error.message);
      showMessage('Error adding certification: ' + (error.response?.data?.error || error.message), true);
    }
  };

  const startEdit = (cert) => {
    setEditingCert(cert._id);
    setEditForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      link: cert.link || '',
      date: cert.date || '',
      image: cert.image || '',
      description: cert.description || '',
      skills: cert.skills || [],
      credentialId: cert.credentialId || '',
      validity: cert.validity || '',
      grade: cert.grade || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`/api/certifications/${id}`, editForm);
      console.log('Save response:', response.data);
      await fetchAllData();
      showMessage('Certification updated!');
      setEditingCert(null);
    } catch (error) {
      console.error('Save error:', error.response?.data || error.message);
      showMessage('Error updating certification', true);
    }
  };

  const cancelEdit = () => {
    setEditingCert(null);
  };

  const deleteCertification = async (id) => {
    if (window.confirm('Delete this certification?')) {
      try {
        await axios.delete(`/api/certifications/${id}`);
        await fetchAllData();
        showMessage('Certification deleted!');
      } catch (error) {
        console.error('Delete error:', error);
        showMessage('Error deleting certification', true);
      }
    }
  };

  const uploadCertImage = async (file, certId) => {
    if (!file) return;
    
    setUploading(true);
    showMessage('📤 Uploading certificate image to Cloudinary...');
    
    try {
      const imageUrl = await uploadToCloudinary(file);
      console.log('Upload successful! URL:', imageUrl);
      
      const updatedForm = { ...editForm, image: imageUrl };
      setEditForm(updatedForm);
      
      await axios.put(`/api/certifications/${certId}`, updatedForm);
      await fetchAllData();
      
      showMessage('✅ Certificate image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('❌ Failed to upload image', true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={addCertification} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Certification
      </button>
      
      <div className="space-y-6">
        {certifications && certifications.length > 0 ? (
          certifications.map(cert => (
            <div key={cert._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-accent">
                  {editingCert === cert._id ? 'Editing:' : '📜'} {cert.name || 'Untitled Certification'}
                </h3>
                <div className="flex gap-2">
                  {editingCert === cert._id ? (
                    <>
                      <button onClick={() => saveEdit(cert._id)} className="bg-green-500 px-3 py-1 rounded text-sm">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cert)} className="bg-blue-500 px-3 py-1 rounded text-sm">Edit</button>
                      <button onClick={() => deleteCertification(cert._id)} className="bg-red-500 px-3 py-1 rounded text-sm">Delete</button>
                    </>
                  )}
                </div>
              </div>
              
              {cert.image && editingCert !== cert._id && (
                <div className="mb-4">
                  <img src={cert.image} alt={cert.name} className="w-32 h-32 object-cover rounded-lg border border-gray-600" />
                </div>
              )}
              
              {editingCert === cert._id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Issuer</label>
                    <input value={editForm.issuer} onChange={(e) => setEditForm({...editForm, issuer: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Date</label>
                    <input value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Link</label>
                    <input value={editForm.link} onChange={(e) => setEditForm({...editForm, link: e.target.value})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full bg-gray-700 p-2 rounded" rows="3" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Skills (comma-separated)</label>
                    <input value={editForm.skills.join(', ')} onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-gray-700 p-2 rounded" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Certificate Image</label>
                    {editForm.image && <img src={editForm.image} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />}
                    <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadCertImage(e.target.files[0], cert._id)} className="block w-full text-sm text-gray-400" />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-300">
                  <p><strong>Issuer:</strong> {cert.issuer || 'Not specified'}</p>
                  <p><strong>Date:</strong> {cert.date || 'Not specified'}</p>
                  <p><strong>Skills:</strong> {cert.skills?.join(', ') || 'Not specified'}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No certifications yet. Click "+ Add Certification" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsTab;