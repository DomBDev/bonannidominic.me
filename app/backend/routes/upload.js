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
    console.log('Upload directory:', uploadDir);
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/', auth, upload.single('file'), (req, res) => {
  console.log('File upload attempt');
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No file uploaded.');
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log(`File uploaded successfully: ${fileUrl}`);
    console.log('File details:', req.file);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Error processing uploaded file:', error);
    res.status(500).json({ message: 'Error processing uploaded file', error: error.message });
  }
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
