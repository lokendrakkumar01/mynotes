const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Data storage
const dataFile = path.join(__dirname, 'data.json');
let data = { users: [], notes: [], files: [] };

// Helper to get server IP
function getServerIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Load data from file
function loadData() {
  console.log('Loading data from:', dataFile);
  if (fs.existsSync(dataFile)) {
    try {
      const fileContent = fs.readFileSync(dataFile, 'utf8');
      data = JSON.parse(fileContent);
      console.log('✅ Data loaded successfully');
    } catch (error) {
      console.error('❌ Error parsing data.json:', error);
      const backupFile = dataFile + '.bak.' + Date.now();
      fs.copyFileSync(dataFile, backupFile);
      console.log(`Corrupt data file backed up to ${backupFile}`);
      data = { users: [], notes: [], files: [] };
      console.log('Initialized with empty data structure');
    }
  } else {
    console.log('Data file does not exist, initializing empty data');
    data = { users: [], notes: [], files: [] };
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    console.log('✅ Data saved successfully');
  } catch (error) {
    console.error('❌ Error saving data:', error);
  }
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

// JWT verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    ip: getServerIP(),
    port: PORT
  });
});

// AUTHENTICATION ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    if (data.users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (data.users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      profileImage: profileImage || null,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    saveData();

    // Create token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = data.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// FILE ROUTES

// Get all files for authenticated user
app.get('/api/files', authenticateToken, (req, res) => {
  try {
    const userFiles = data.files.filter(f => f.uploaderId === req.user.id);
    res.json({ files: userFiles });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Upload files
app.post('/api/files/upload', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileData = {
        _id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
        name: file.originalname,
        filename: file.filename,
        type: getFileType(file.mimetype),
        size: file.size,
        mimetype: file.mimetype,
        uploadDate: new Date().toISOString(),
        uploaderId: req.user.id,
        uploader: req.user.username,
        uploaderEmail: data.users.find(u => u.id === req.user.id)?.email || ''
      };

      data.files.push(fileData);
      return fileData;
    });

    saveData();

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files' });
  }
});

// Download file
app.get('/api/files/:id/download', authenticateToken, (req, res) => {
  try {
    const file = data.files.find(f => f._id === req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, 'uploads', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(filePath, file.name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

// Delete file
app.delete('/api/files/:id', authenticateToken, (req, res) => {
  try {
    const fileIndex = data.files.findIndex(f => f._id === req.params.id && f.uploaderId === req.user.id);

    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    const file = data.files[fileIndex];
    const filePath = path.join(__dirname, 'uploads', file.filename);

    // Delete from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from data
    data.files.splice(fileIndex, 1);
    saveData();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Rename file
app.put('/api/files/:id/rename', authenticateToken, (req, res) => {
  try {
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: 'New name is required' });
    }

    const file = data.files.find(f => f._id === req.params.id && f.uploaderId === req.user.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    file.name = newName;
    saveData();

    res.json({ message: 'File renamed successfully', file });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).json({ message: 'Error renaming file' });
  }
});

// Helper function to determine file type
function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'img';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype === 'text/plain') return 'txt';
  if (mimetype.includes('document') || mimetype.includes('word')) return 'doc';
  if (mimetype.startsWith('video/')) return 'video';
  return 'other';
}

// Load initial data
loadData();

// Start server
const serverIP = getServerIP();

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('✅ SERVER RUNNING SUCCESSFULLY!');
  console.log('========================================');
  console.log(`📍 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://${serverIP}:${PORT}`);
  console.log('========================================');
  console.log('\n📱 To access from another device:');
  console.log(`   Open browser and go to: http://${serverIP}:${PORT}`);
  console.log('\n⚠️  Make sure both devices are on the same WiFi network!');
  console.log('========================================\n');
});
