const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Database collections
let usersCollection;
let filesCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("notes_manager");
    usersCollection = database.collection("users");
    filesCollection = database.collection("files");

    // Create indexes
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await filesCollection.createIndex({ uploader: 1 });
    await filesCollection.createIndex({ uploadDate: -1 });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      profileImage: profileImage || null,
      createdAt: new Date(),
      lastLogin: null
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId, username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertedId,
        username,
        email,
        profileImage: newUser.profileImage
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// File upload
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileData = {
      name: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: getFileType(req.file),
      uploader: req.user.username,
      uploaderId: new ObjectId(req.user.userId),
      uploaderEmail: req.body.uploaderEmail || '',
      uploadDate: new Date()
    };

    const result = await filesCollection.insertOne(fileData);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: result.insertedId,
        ...fileData
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all files for the current user
app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const files = await filesCollection.find({
      uploaderId: new ObjectId(req.user.userId)
    }).sort({ uploadDate: -1 }).toArray();

    res.json({ files });
  } catch (error) {
    console.error('Files fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all files (for admin purposes - can be restricted later)
app.get('/api/files/all', authenticateToken, async (req, res) => {
  try {
    const files = await filesCollection.find({})
      .sort({ uploadDate: -1 })
      .toArray();

    res.json({ files });
  } catch (error) {
    console.error('Files fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Download file
app.get('/api/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const file = await filesCollection.findOne({
      _id: new ObjectId(req.params.id),
      uploaderId: new ObjectId(req.user.userId)
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (fs.existsSync(file.path)) {
      res.download(file.path, file.name);
    } else {
      res.status(404).json({ message: 'File not found on disk' });
    }

  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete file
app.delete('/api/files/:id', authenticateToken, async (req, res) => {
  try {
    const file = await filesCollection.findOne({
      _id: new ObjectId(req.params.id),
      uploaderId: new ObjectId(req.user.userId)
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await filesCollection.deleteOne({ _id: new ObjectId(req.params.id) });

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rename file
app.put('/api/files/:id/rename', authenticateToken, async (req, res) => {
  try {
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: 'New name is required' });
    }

    const result = await filesCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
        uploaderId: new ObjectId(req.user.userId)
      },
      { $set: { name: newName } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ message: 'File renamed successfully' });

  } catch (error) {
    console.error('File rename error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await usersCollection.find({}, {
      projection: { password: 0 }
    }).sort({ createdAt: -1 }).toArray();

    res.json({ users });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to determine file type
function getFileType(file) {
  const mimeType = file.mimetype;
  const fileName = file.originalname.toLowerCase();

  if (mimeType.startsWith('image/')) return 'img';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/plain') return 'txt';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'doc';
  if (mimeType.startsWith('video/') ||
      fileName.endsWith('.mp4') ||
      fileName.endsWith('.avi') ||
      fileName.endsWith('.mov') ||
      fileName.endsWith('.wmv') ||
      fileName.endsWith('.mkv') ||
      fileName.endsWith('.webm')) return 'video';
  return 'other';
}

// Start server
async function startServer() {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch(console.dir);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
