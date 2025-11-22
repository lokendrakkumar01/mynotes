const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'notesManager';
let db;

async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongo();

// Passport configuration for GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({ githubId: profile.id });

    if (!user) {
      user = {
        githubId: profile.id,
        username: profile.username,
        email: profile.emails ? profile.emails[0].value : null,
        name: profile.displayName,
        avatar: profile.photos ? profile.photos[0].value : null,
        createdAt: new Date()
      };
      await usersCollection.insertOne(user);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: id });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend with token.
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Local auth routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  try {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      email,
      password: hashedPassword,
      profileImage,
      createdAt: new Date()
    };
    const result = await usersCollection.insertOne(user);
    const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { _id: result.insertedId, username, email, profileImage } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Notes routes
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const notesCollection = db.collection('notes');
    const notes = await notesCollection.find({ userId: req.userId }).toArray();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', verifyToken, async (req, res) => {
  try {
    const notesCollection = db.collection('notes');
    const note = { ...req.body, userId: req.userId, createdAt: new Date() };
    const result = await notesCollection.insertOne(note);
    res.status(201).json({ ...note, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const notesCollection = db.collection('notes');
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    const result = await notesCollection.updateOne(
      { _id: new ObjectId(id), userId: req.userId },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const notesCollection = db.collection('notes');
    const { id } = req.params;
    const result = await notesCollection.deleteOne({ _id: new ObjectId(id), userId: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// File type helper
function getFileType(mimeType) {
  if (mimeType.startsWith('image/')) return 'img';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/plain') return 'txt';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'doc';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// File upload route
app.post('/api/upload', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const filesCollection = db.collection('files');
    const fileDoc = {
      name: req.file.originalname,
      type: getFileType(req.file.mimetype),
      size: req.file.size,
      path: req.file.path,
      userId: req.userId,
      uploadDate: new Date()
    };
    const result = await filesCollection.insertOne(fileDoc);
    res.json({ message: 'File uploaded successfully', file: { ...fileDoc, _id: result.insertedId } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get user files
app.get('/api/files', verifyToken, async (req, res) => {
  try {
    const filesCollection = db.collection('files');
    const files = await filesCollection.find({ userId: req.userId }).toArray();
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Download file
app.get('/api/files/:id/download', verifyToken, async (req, res) => {
  try {
    const filesCollection = db.collection('files');
    const file = await filesCollection.findOne({ _id: new ObjectId(req.params.id), userId: req.userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.download(file.path, file.name);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Rename file
app.put('/api/files/:id/rename', verifyToken, async (req, res) => {
  try {
    const filesCollection = db.collection('files');
    const { newName } = req.body;
    const result = await filesCollection.updateOne(
      { _id: new ObjectId(req.params.id), userId: req.userId },
      { $set: { name: newName } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File renamed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename file' });
  }
});

// Delete file
app.delete('/api/files/:id', verifyToken, async (req, res) => {
  try {
    const filesCollection = db.collection('files');
    const file = await filesCollection.findOne({ _id: new ObjectId(req.params.id), userId: req.userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    // Delete file from disk
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file from disk:', err);
    });
    await filesCollection.deleteOne({ _id: new ObjectId(req.params.id), userId: req.userId });
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get user profile
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Logout route
app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
