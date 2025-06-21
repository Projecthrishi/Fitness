const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'duqdbbfbu',   // ✅ Your Cloudinary cloud name
  api_key: '129398262926817',
  api_secret: 'BqSFtFmPH-USUIo680QUEo50-jI'
});

module.exports = cloudinary;


