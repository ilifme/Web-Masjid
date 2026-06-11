const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'banner') {
      uploadPath += 'banners/';
    } else if (file.fieldname === 'thumbnail' || file.fieldname === 'image') {
      uploadPath += 'images/';
    } else if (file.fieldname === 'gallery') {
      uploadPath += 'gallery/';
    } else if (file.fieldname === 'qris') {
      uploadPath += 'qris/';
    } else if (file.fieldname === 'photo') {
      uploadPath += 'photos/';
    } else if (file.fieldname === 'mosqueImage') {
      uploadPath += 'mosque/';
    } else if (file.fieldname === 'organizationChart') {
      uploadPath += 'organization/';
    } else {
      uploadPath += 'misc/';
    }
    
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan (jpg, jpeg, png, gif, webp, svg)!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  },
  fileFilter: fileFilter,
});

module.exports = upload;
