const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const os = require('os');
require('dotenv').config();

// Import database module
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

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
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await db.testConnection();
        res.json({
            status: 'ok',
            message: 'Server is running',
            database: dbStatus ? 'connected' : 'disconnected',
            ip: getServerIP(),
            port: PORT
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server is running but database connection failed',
            error: error.message
        });
    }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, profileImage } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existingUsername = await db.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await db.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const userId = Date.now().toString();
        const newUser = await db.createUser(
            userId,
            username,
            email,
            hashedPassword,
            profileImage || null
        );

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
                profileImage: newUser.profile_image
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
        const user = await db.getUserByUsername(username);
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
                profileImage: user.profile_image
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ==========================================
// NOTES ROUTES
// ==========================================

// Get all notes for authenticated user
app.get('/api/notes', authenticateToken, async (req, res) => {
    try {
        const notes = await db.getNotesByUserId(req.user.id);
        res.json({ notes });
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// Create new note
app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const noteId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
        const note = await db.createNote(noteId, title, content || '', req.user.id);

        res.status(201).json({
            message: 'Note created successfully',
            note
        });
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
});

// Update note
app.put('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const note = await db.updateNote(req.params.id, title, content || '', req.user.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json({
            message: 'Note updated successfully',
            note
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Error updating note' });
    }
});

// Delete note
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const note = await db.deleteNote(req.params.id, req.user.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

// ==========================================
// FILE ROUTES
// ==========================================

// Get all files for authenticated user
app.get('/api/files', authenticateToken, async (req, res) => {
    try {
        const files = await db.getFilesByUserId(req.user.id);
        res.json({ files });
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

// Upload files
app.post('/api/files/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Get user info
        const user = await db.getUserById(req.user.id);

        const uploadedFiles = [];
        for (const file of req.files) {
            const fileData = {
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
                name: file.originalname,
                filename: file.filename,
                type: getFileType(file.mimetype),
                size: file.size,
                mimetype: file.mimetype,
                uploaderId: req.user.id,
                uploader: req.user.username,
                uploaderEmail: user?.email || ''
            };

            const savedFile = await db.createFile(fileData);
            uploadedFiles.push(savedFile);
        }

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
app.get('/api/files/:id/download', authenticateToken, async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

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
app.delete('/api/files/:id', authenticateToken, async (req, res) => {
    try {
        const file = await db.deleteFile(req.params.id, req.user.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found or unauthorized' });
        }

        // Delete from disk
        const filePath = path.join(__dirname, 'uploads', file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
});

// Rename file
app.put('/api/files/:id/rename', authenticateToken, async (req, res) => {
    try {
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).json({ message: 'New name is required' });
        }

        const file = await db.renameFile(req.params.id, newName, req.user.id);

        if (!file) {
            return res.status(404).json({ message: 'File not found or unauthorized' });
        }

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

// Test database connection on startup
async function initializeServer() {
    console.log('\n========================================');
    console.log('🚀 INITIALIZING SERVER');
    console.log('========================================\n');

    const dbConnected = await db.testConnection();

    if (!dbConnected) {
        console.error('❌ Failed to connect to database!');
        console.error('Please check your DATABASE_URL in .env file');
        console.error('Run "node setup-database.js" to set up your database');
        process.exit(1);
    }

    const serverIP = getServerIP();

    app.listen(PORT, '0.0.0.0', () => {
        console.log('\n========================================');
        console.log('✅ SERVER RUNNING SUCCESSFULLY!');
        console.log('========================================');
        console.log(`📍 Local access: http://localhost:${PORT}`);
        console.log(`🌐 Network access: http://${serverIP}:${PORT}`);
        console.log(`🗄️  Database: Neon Postgres (Connected)`);
        console.log('========================================');
        console.log('\n📱 To access from another device:');
        console.log(`   Open browser and go to: http://${serverIP}:${PORT}`);
        console.log('\n⚠️  Make sure both devices are on the same WiFi network!');
        console.log('========================================\n');
    });
}

// Start the server
initializeServer();
