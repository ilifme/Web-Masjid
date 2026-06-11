/**
 * Normalize file path from multer to store in database.
 * For Cloudinary: returns full URL (starts with http)
 * For Local: returns /uploads/... path
 */
const getFilePath = (file) => {
  if (!file) return '';
  if (file.path && file.path.startsWith('http')) return file.path;
  return '/' + file.path.replace(/\\/g, '/');
};

module.exports = { getFilePath };