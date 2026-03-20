import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import '../style.css';

/**
 * Reusable Image Upload Component
 * 
 * @param {Object} props
 * @param {string} props.type - 'category', 'product', or 'banner'
 * @param {string} props.currentImage - Current image URL (for preview)
 * @param {Function} props.onImageUploaded - Callback when image is uploaded (receives file_url)
 * @param {string} props.label - Label text (optional)
 */
function ImageUpload({ type = 'category', currentImage = null, onImageUploaded, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  // Update preview when currentImage prop changes
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, WEBP)');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Upload based on type
      let result;
      if (type === 'product') {
        result = await adminService.uploadProductImage(file);
      } else if (type === 'banner') {
        result = await adminService.uploadBannerImage(file);
      } else {
        result = await adminService.uploadCategoryImage(file);
      }

      console.log('Upload result:', result);
      
      // Get the image path from response
      const imagePath = result.image_url || result.file_url || result.url;
      
      // Construct full URL using server_url if the path is relative
      let imageUrl = imagePath;
      if (imagePath && !imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        const serverUrl = result.server_url || 'http://localhost:8000';
        // Remove leading slash if present to avoid double slashes
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        imageUrl = `${serverUrl}/${cleanPath}`;
      }
      
      console.log('Image URL for preview:', imageUrl);

      // Set preview and file info
      setPreview(imageUrl);
      setFileInfo({
        filename: result.filename,
        size: result.file_size,
        mimeType: result.mime_type
      });

      // Notify parent with the URL
      onImageUploaded(imageUrl);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileInfo(null);
    onImageUploaded(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        fontWeight: '600', 
        marginBottom: '8px', 
        fontSize: '14px' 
      }}>
        {label}
      </label>
      
      <div style={{ 
        border: '2px dashed #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        {preview ? (
          <div>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                borderRadius: '4px', 
                display: 'block', 
                margin: '0 auto 10px',
                border: '1px solid #ddd'
              }} 
            />
            {fileInfo && (
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '10px' 
              }}>
                <div>{fileInfo.filename}</div>
                <div>{formatFileSize(fileInfo.size)} • {fileInfo.mimeType}</div>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
              onMouseOver={(e) => e.target.style.background = '#cc0000'}
              onMouseOut={(e) => e.target.style.background = '#ff4444'}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <input
              type="file"
              id="image-upload-input"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="image-upload-input" 
              style={{
                display: 'inline-block',
                background: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'background 0.3s',
                opacity: uploading ? 0.6 : 1
              }}
              onMouseOver={(e) => !uploading && (e.target.style.background = '#45a049')}
              onMouseOut={(e) => !uploading && (e.target.style.background = '#4CAF50')}
            >
              {uploading ? 'Uploading...' : '📷 Choose Image'}
            </label>
            <p style={{ 
              marginTop: '10px', 
              color: '#777', 
              fontSize: '12px' 
            }}>
              JPG, PNG, GIF, WEBP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ 
          color: '#ff4444', 
          fontSize: '12px', 
          marginTop: '8px' 
        }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;
