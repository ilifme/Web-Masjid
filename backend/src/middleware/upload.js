const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isConfigured } = require('../config/cloudinary');

const folderMap = {
  banner: 'masjid/banners',
  thumbnail: 'masjid/articles',
  image: 'masjid/images',
  gallery: 'masjid/gallery',
  qris: 'masjid/qris',
  photo: 'masjid/photos',
  mosqueImage: 'masjid/mosque',
  organizationChart: 'masjid/organization',
  logo: 'masjid/logo',
};

// Local storage fallback
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = folderMap[file.fieldname] || 'misc';
    const uploadPath = 'uploads/' + subfolder;
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Determine storage based on Cloudinary availability
const getStorage = () => {
  if (isConfigured()) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: (req, file) => folderMap[file.fieldname] || 'masjid/misc',
        format: (req, file) => {
          const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
          return ['jpg','jpeg','png','gif','webp','svg'].includes(ext) ? ext : 'png';
        },
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
      },
    });
  }
  return localStorage;
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  cb(null, mime && ext);
};

const upload = multer({
  storage: getStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter,
});

module.exports = upload;