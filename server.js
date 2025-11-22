const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins for cross-device access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Passport
app.use(passport.initialize());

// Serve static files
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/share', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Local JSON storage
const dataFile = path.join(__dirname, 'data.json');
let data = { users: [], notes: [], files: [] };

function loadData() {
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
}

function saveData() {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

loadData();

// Get server IP for dynamic callback URLs
function getServerIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback
}

const serverIP = getServerIP();
const serverURL = `http://${serverIP}:3000`;

// Passport configuration for GitHub (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || `${serverURL}/auth/github/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = data.users.find(u => u.githubId === profile.id);

      if (!user) {
        user = {
          _id: Date.now().toString(),
          githubId: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : null,
          name: profile.displayName,
          avatar: profile.photos ? profile.photos[0].value : null,
          createdAt: new Date()
        };
        data.users.push(user);
        saveData();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Passport configuration for Google (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${serverURL}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = data.users.find(u => u.googleId === profile.id);

      if (!user) {
        user = {
          _id: Date.now().toString(),
          googleId: profile.id,
          username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
          email: profile.emails ? profile.emails[0].value : null,
          name: profile.displayName,
          avatar: profile.photos ? profile.photos[0].value : null,
          createdAt: new Date()
        };
        data.users.push(user);
        saveData();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = data.users.find(u => u._id === id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect to frontend with token.
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
      res.redirect(`${serverURL}?token=${token}`);
    }
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect to frontend with token.
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
      res.redirect(`${serverURL}?token=${token}`);
    }
  );
}

// Local auth routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = data.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      _id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      profileImage,
      createdAt: new Date()
    };

    data.users.push(user);
    saveData();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: { _id: user._id, username, email, profileImage },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = data.users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, profileImage: user.profileImage },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    req.user = data.users.find(u => u._id === req.userId);
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Notes routes
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const notes = data.notes.filter(n => n.userId === req.userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', verifyToken, async (req, res) => {
  try {
    const note = { ...req.body, userId: req.userId, _id: Date.now().toString(), createdAt: new Date() };
    data.notes.push(note);
    saveData();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = data.notes.findIndex(n => n._id === id && n.userId === req.userId);
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    data.notes[noteIndex] = { ...data.notes[noteIndex], ...req.body, updatedAt: new Date() };
    saveData();
    res.json({ message: 'Note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const noteIndex = data.notes.findIndex(n => n._id === id && n.userId === req.userId);
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    data.notes.splice(noteIndex, 1);
    saveData();
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
    const fileDoc = {
      _id: Date.now().toString(),
      name: req.file.originalname,
      type: getFileType(req.file.mimetype),
      size: req.file.size,
      path: req.file.path,
      userId: req.userId,
      uploader: req.user.username || 'Unknown',
      uploaderEmail: req.user.email || 'Unknown',
      uploadDate: new Date()
    };
    data.files.push(fileDoc);
    saveData();
    res.json({
      message: 'File uploaded successfully',
      file: fileDoc,
      success: true
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Clean up uploaded file if database save failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error cleaning up file:', err);
      });
    }
    res.status(500).json({ error: 'Failed to upload file. Please try again.' });
  }
});

// Get user files
app.get('/api/files', verifyToken, async (req, res) => {
  try {
    const files = data.files.filter(f => f.userId === req.userId);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Download file
app.get('/api/files/:id/download', verifyToken, async (req, res) => {
  try {
    const file = data.files.find(f => f._id === req.params.id && f.userId === req.userId);
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
    const { newName } = req.body;
    const fileIndex = data.files.findIndex(f => f._id === req.params.id && f.userId === req.userId);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }
    data.files[fileIndex].name = newName;
    saveData();
    res.json({ message: 'File renamed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename file' });
  }
});

// Delete file
app.delete('/api/files/:id', verifyToken, async (req, res) => {
  try {
    const fileIndex = data.files.findIndex(f => f._id === req.params.id && f.userId === req.userId);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }
    const file = data.files[fileIndex];
    // Delete file from disk
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file from disk:', err);
    });
    data.files.splice(fileIndex, 1);
    saveData();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get user profile
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = data.users.find(u => u._id === req.userId);
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
