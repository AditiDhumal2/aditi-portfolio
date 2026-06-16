import React, { useState } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

const CertificationsTab = ({ certifications, setCertifications, showMessage, setUploading, uploading, fetchAllData }) => {
  const [editingCert, setEditingCert] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    issuer: '',
    link: '',           // Course link
    certificateLink: '', // Certificate verification link
    date: '',
    image: '',
    description: '',
    skills: [],
    credentialId: '',
    validity: '',
    grade: ''
  });
  const [uploadProgress, setUploadProgress] = useState(false);

  const addCertification = async () => {
    const newCert = {
      name: "New Certification",
      issuer: "",
      link: "",
      certificateLink: "",
      date: "",
      image: "",
      description: "",
      skills: [],
      credentialId: "",
      validity: "",
      grade: "",
      order: certifications.length
    };
    try {
      await axios.post('/api/certifications', newCert);
      await fetchAllData();
      showMessage('Certification added!');
    } catch (error) {
      showMessage('Error adding certification', true);
    }
  };

  const startEdit = (cert) => {
    setEditingCert(cert._id);
    setEditForm({
      name: cert.name || '',
      issuer: cert.issuer || '',
      link: cert.link || '',
      certificateLink: cert.certificateLink || '',
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
      await axios.put(`/api/certifications/${id}`, editForm);
      await fetchAllData();
      showMessage('Certification updated!');
      setEditingCert(null);
    } catch (error) {
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
        showMessage('Error deleting certification', true);
      }
    }
  };

  const uploadCertImage = async (file, certId) => {
    if (!file) return;
    
    setUploadProgress(true);
    setUploading(true);
    showMessage('📤 Uploading certificate image to Cloudinary...');
    
    try {
      const imageUrl = await uploadToCloudinary(file);
      console.log('Upload successful! URL:', imageUrl);
      
      setEditForm({...editForm, image: imageUrl});
      await axios.put(`/api/certifications/${certId}`, { ...editForm, image: imageUrl });
      await fetchAllData();
      
      showMessage('✅ Certificate image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('❌ Failed to upload image. Check Cloudinary settings.', true);
    } finally {
      setUploadProgress(false);
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={addCertification} className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition">
        + Add Certification
      </button>
      
      <div className="space-y-6">
        {certifications.map(cert => (
          <div key={cert._id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-accent">
                {editingCert === cert._id ? 'Editing:' : '📜'} {cert.name || 'Untitled Certification'}
              </h3>
              <div className="flex gap-2">
                {editingCert === cert._id ? (
                  <>
                    <button onClick={() => saveEdit(cert._id)} className="bg-green-500 px-3 py-1 rounded text-sm">
                      💾 Save All
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(cert)} className="bg-blue-500 px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => deleteCertification(cert._id)} className="bg-red-500 px-3 py-1 rounded text-sm">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Display current certificate image */}
            {cert.image && editingCert !== cert._id && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-400 mb-1">Certificate Image</label>
                <img 
                  src={cert.image} 
                  alt={cert.name} 
                  className="w-40 h-40 object-cover rounded-lg border border-gray-600"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/160?text=No+Image';
                  }}
                />
              </div>
            )}
            
            {editingCert === cert._id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Certification Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="e.g., Google Data Analytics Professional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Issuer</label>
                  <input
                    value={editForm.issuer}
                    onChange={(e) => setEditForm({...editForm, issuer: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Google, IBM, Stanford, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date Earned</label>
                  <input
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Grade / Score</label>
                  <input
                    value={editForm.grade}
                    onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="92%, Honors, Distinction"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Credential ID</label>
                  <input
                    value={editForm.credentialId}
                    onChange={(e) => setEditForm({...editForm, credentialId: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="ABCD-1234-EFGH-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Valid Until</label>
                  <input
                    value={editForm.validity}
                    onChange={(e) => setEditForm({...editForm, validity: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="No Expiry / 2026"
                  />
                </div>
                
                {/* Two separate link fields */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-green-400">✅ Certificate Verification Link</label>
                  <input
                    value={editForm.certificateLink}
                    onChange={(e) => setEditForm({...editForm, certificateLink: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://verify.certificate.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Direct link to verify this certificate</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-blue-400">📚 Course Link</label>
                  <input
                    value={editForm.link}
                    onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="https://www.coursera.org/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Link to the course (if no verification link)</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                    rows="3"
                    placeholder="What you learned, key takeaways from this certification"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Skills (comma-separated)</label>
                  <input
                    value={editForm.skills?.join(', ') || ''}
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full bg-gray-700 p-2 rounded"
                    placeholder="Data Analysis, SQL, Python, Tableau"
                  />
                </div>
                
                {/* Certificate Image Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">📸 Certificate Image / Logo</label>
                  
                  {editForm.image && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Current Image:</p>
                      <img 
                        src={editForm.image} 
                        alt="Certificate preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/128?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          uploadCertImage(e.target.files[0], cert._id);
                        }
                      }}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-accent file:text-white file:cursor-pointer hover:file:bg-blue-600"
                    />
                    {uploadProgress && (
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                        <span>Uploading to Cloudinary...</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload a certificate image, logo, or badge (JPG, PNG, WEBP). 
                      Will be uploaded to Cloudinary automatically.
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Or paste image URL directly:</label>
                    <input
                      type="text"
                      value={editForm.image || ''}
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                      className="w-full bg-gray-700 p-2 rounded text-sm"
                      placeholder="https://res.cloudinary.com/your-image.jpg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-300">
                <p><strong className="text-blue-400">Issuer:</strong> {cert.issuer || 'Not specified'}</p>
                <p><strong className="text-blue-400">Date:</strong> {cert.date || 'Not specified'}</p>
                {cert.grade && <p><strong className="text-blue-400">Grade:</strong> {cert.grade}</p>}
                {cert.credentialId && <p><strong className="text-blue-400">Credential ID:</strong> {cert.credentialId}</p>}
                <p><strong className="text-blue-400">Skills:</strong> {cert.skills?.join(', ') || 'Not specified'}</p>
                
                {/* Two separate link display */}
                {cert.certificateLink && cert.certificateLink !== "#" && (
                  <p className="mt-2">
                    <a href={cert.certificateLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                      ✅ Verify Certificate →
                    </a>
                  </p>
                )}
                {cert.link && cert.link !== "#" && !cert.certificateLink && (
                  <p className="mt-2">
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                      📚 View Course →
                    </a>
                  </p>
                )}
                {cert.link && cert.link !== "#" && cert.certificateLink && (
                  <p className="mt-2">
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      📚 View Course →
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsTab;