const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = '/app/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Update the fileUrl to use the /uploads prefix
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Handle file deletion
router.delete('/:filename', auth, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('/app/uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('File does not exist, skipping deletion');
        return res.json({ message: 'File not found, no action taken' });
      }
      console.error('Error deleting file:', err);
      return res.status(500).json({ message: 'Error deleting file' });
    }
    res.json({ message: 'File deleted successfully' });
  });
});

module.exports = router;
