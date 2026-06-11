const CLOUD_NAME = 'drmv85wsw';
const UPLOAD_PRESET = 'portfolio_preset';  // Must match exactly what you created

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};