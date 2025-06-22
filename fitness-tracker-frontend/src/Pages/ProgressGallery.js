import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProgressGallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    const res = await axios.get('http://localhost:5000/api/progress/my', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setImages(res.data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    await axios.post('http://localhost:5000/api/progress/upload', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    fetchImages();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/progress/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container py-5">
      <h3 className="text-center mb-4">📷 Progress Gallery</h3>

      <div className="text-center mb-4">
        <input type="file" onChange={handleUpload} className="form-control w-auto d-inline-block" />
      </div>

      <div className="row g-3">
        {images.map((img) => (
          <div key={img._id} className="col-6 col-md-3">
            <div className="card">
              <img
                src={img.imageUrl}
                alt="progress"
                className="card-img-top"
                onClick={() => setSelectedImage(img.imageUrl)}
              />
              <div className="card-body text-center">
                <small>{img.date}</small>
                <button className="btn btn-sm btn-outline-danger w-100 mt-2" onClick={() => handleDelete(img._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal d-block bg-dark bg-opacity-75" onClick={() => setSelectedImage(null)}>
          <div className="modal-dialog modal-dialog-centered">
            <img src={selectedImage} className="img-fluid rounded shadow" alt="Zoomed" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressGallery;
