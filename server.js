const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const os = require('os');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mynotes-secret-key-student-sharing';

// Configure Cloudinary API
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'kt2upmou',
    api_key: process.env.CLOUDINARY_API_KEY || '972468326573411',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'XMNZ8Ft0fkuQ06tgvv9b8zR33fs'
});

// Ensure local uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get Server IP for local network access
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (HTML, CSS, JS, uploaded assets)
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${safeName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB Max File Size
});

// Helper for JWT Token Verification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
}

// Strict Auth Middleware for Protected Actions
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
}

// Helper to Upload File to Cloudinary
async function uploadToCloudinary(filePath, originalname) {
    try {
        const ext = path.extname(originalname).toLowerCase();
        let resourceType = 'auto';
        if (['.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
            resourceType = 'raw';
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'mynotes_uploads',
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true
        });

        return result;
    } catch (err) {
        console.warn('⚠️ Cloudinary upload warning:', err.message);
        return null;
    }
}

// Helper function to map mimetypes / extensions to file types
function getFileType(mimetype, originalname = '') {
    const ext = path.extname(originalname).toLowerCase();
    if (mimetype.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'img';
    if (mimetype === 'application/pdf' || ext === '.pdf') return 'pdf';
    if (mimetype === 'text/plain' || ext === '.txt') return 'txt';
    if (['.doc', '.docx'].includes(ext) || mimetype.includes('word')) return 'doc';
    if (['.ppt', '.pptx'].includes(ext) || mimetype.includes('presentation')) return 'ppt';
    if (['.xls', '.xlsx'].includes(ext) || mimetype.includes('spreadsheet') || mimetype.includes('excel')) return 'xls';
    if (mimetype.startsWith('video/')) return 'video';
    return 'other';
}

// ==========================================
// ROUTES
// ==========================================

// Serve main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();
    res.json({
        status: 'ok',
        message: 'MyNotes Server is running with MongoDB & Cloudinary',
        database: dbStatus ? 'connected' : 'local_json',
        ip: getServerIP(),
        port: PORT
    });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, profileImage } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const existingUsername = await db.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const existingEmail = await db.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        const newUser = await db.createUser(userId, username, email, hashedPassword, profileImage);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profile_image || newUser.profileImage
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id || user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id || user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profile_image || user.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET All Shared Notes (Shared Platform Feed)
app.get('/api/files', authenticateToken, async (req, res) => {
    try {
        const files = await db.getPublicFiles();
        res.json({ files });
    } catch (error) {
        console.error('Fetch shared notes error:', error);
        res.status(500).json({ message: 'Error fetching shared notes' });
    }
});

// Upload Notes with Cloudinary Storage & MongoDB Record Creation
app.post('/api/files/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files were selected for upload' });
        }

        const title = req.body.title || '';
        const subject = req.body.subject || 'General';
        const semester = req.body.semester || 'All Semesters';
        const course = req.body.course || 'General';
        const description = req.body.description || '';

        const uploaderId = req.user ? req.user.id : 'anonymous';
        const uploaderName = req.user ? req.user.username : 'Student';
        const uploaderEmail = req.user ? (req.user.email || '') : '';

        const uploadedFiles = [];
        for (const file of req.files) {
            const fileType = getFileType(file.mimetype, file.originalname);
            
            // Upload to Cloudinary for permanent hosting on Render
            const cloudRes = await uploadToCloudinary(file.path, file.originalname);
            
            const fileData = {
                id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
                title: title || file.originalname,
                name: file.originalname,
                filename: file.filename,
                url: cloudRes ? cloudRes.secure_url : `/uploads/${file.filename}`,
                cloudinaryId: cloudRes ? cloudRes.public_id : null,
                type: fileType,
                size: file.size,
                mimetype: file.mimetype,
                subject: subject,
                semester: semester,
                course: course,
                description: description,
                uploaderId: uploaderId,
                uploader: uploaderName,
                uploaderEmail: uploaderEmail,
                downloadCount: 0,
                uploadDate: new Date().toISOString()
            };

            const savedFile = await db.createFile(fileData);
            uploadedFiles.push(savedFile);
        }

        res.status(201).json({
            message: 'Notes uploaded successfully!',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload notes error:', error);
        res.status(500).json({ message: 'Failed to upload notes: ' + error.message });
    }
});

// File Download Endpoint (Tracks Download Counter & Handles Local or Cloudinary Files)
app.get('/api/files/:id/download', async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'Note file not found' });
        }

        // Increment download counter
        await db.incrementDownloadCount(req.params.id);

        const originalName = file.name || file.title || 'note_document';

        // Stream from Cloudinary if hosted remotely
        if (file.url && (file.url.startsWith('http://') || file.url.startsWith('https://'))) {
            const client = file.url.startsWith('https://') ? https : http;
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);
            res.setHeader('Content-Type', file.mimetype || 'application/octet-stream');
            
            return client.get(file.url, (stream) => {
                stream.pipe(res);
            }).on('error', (err) => {
                console.error('Cloudinary download stream error:', err);
                res.redirect(file.url);
            });
        }

        // Local storage fallback
        const filenameOnDisk = file.filename || path.basename(file.path || '');
        const filePath = path.join(uploadsDir, filenameOnDisk);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Note file not found on server storage' });
        }

        res.download(filePath, originalName);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Error initiating file download' });
    }
});

// Delete Note (Protected)
app.delete('/api/files/:id', authenticateToken, requireAuth, async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

        if (!file) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const isOwner = (file.uploaderId === req.user.id || file.userId === req.user.id || req.user.username === 'admin');
        if (!isOwner) {
            return res.status(403).json({ message: 'You are not authorized to delete this note' });
        }

        const deletedFile = await db.deleteFile(req.params.id, req.user.id);

        if (deletedFile) {
            // Delete from Cloudinary if present
            if (deletedFile.cloudinaryId) {
                try {
                    await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'raw' });
                    await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'image' });
                } catch (cErr) {
                    console.warn('Cloudinary delete warning:', cErr.message);
                }
            }

            // Delete local file if present
            const filenameOnDisk = deletedFile.filename || path.basename(deletedFile.path || '');
            const filePath = path.join(uploadsDir, filenameOnDisk);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

// Server Initialization
async function startServer() {
    await db.testConnection();
    const serverIP = getServerIP();

    app.listen(PORT, '0.0.0.0', () => {
        console.log('\n==================================================');
        console.log('🚀 MYNOTES - STUDENT NOTES SHARING PLATFORM');
        console.log('==================================================');
        console.log(`📍 Local access:   http://localhost:${PORT}`);
        console.log(`🌐 Network access: http://${serverIP}:${PORT}`);
        console.log('==================================================\n');
    });
}

startServer();
