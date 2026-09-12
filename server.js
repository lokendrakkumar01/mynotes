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
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

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

// Case-Insensitive Admin Route Rewriter: /admin or /Admin -> serves index.html
app.use((req, res, next) => {
    const lowerPath = req.path.toLowerCase();
    const ext = path.extname(req.path);
    if (!ext && (lowerPath === '/admin' || lowerPath.startsWith('/admin/'))) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }
    next();
});

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

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            // Fetch live user record to verify active status & current role
            const user = await db.getUserById(decoded.id);
            if (user && user.status !== 'suspended') {
                req.user = {
                    id: user.id || user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role || 'user'
                };
            } else {
                req.user = null;
            }
        }
        next();
    });
}

// Strict Auth Middleware for Protected Actions
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    next();
}

// Strict Role-Based Access Control (RBAC) Admin Middleware
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
    }
    next();
}

// Helper to Upload File to Cloudinary
async function uploadToCloudinary(filePath, originalname) {
    try {
        const ext = path.extname(originalname).toLowerCase();
        let resourceType = 'auto';
        if (['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
            resourceType = 'raw';
        } else if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
            resourceType = 'image';
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'mynotes_uploads',
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
            flags: 'attachment:false'
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
        message: 'MyNotes Universal Platform Server is running with MongoDB Atlas, Cloudinary & News Engine',
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
            return res.status(400).json({ success: false, message: 'Username, email, and password are required' });
        }

        const existingUsername = await db.getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const existingEmail = await db.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email address already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        const newUser = await db.createUser(userId, username, email, hashedPassword, profileImage, 'user');

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profileImage: newUser.profile_image || newUser.profileImage
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username/email and password are required' });
        }

        // Allow login with either username OR email
        let user = await db.getUserByUsername(username);
        if (!user) {
            user = await db.getUserByEmail(username);
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({ success: false, message: 'Account is suspended. Please contact admin.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid username/email or password' });
        }

        const token = jwt.sign(
            { id: user.id || user._id, username: user.username, role: user.role || 'user' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id || user._id,
                username: user.username,
                email: user.email,
                role: user.role || 'user',
                profileImage: user.profile_image || user.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

app.get('/api/auth/me', authenticateToken, requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
});

// GET Shared Notes with Multi-Criteria Advanced Filtering & Search
app.get('/api/files', authenticateToken, async (req, res) => {
    try {
        const filters = {
            educationLevel: req.query.educationLevel,
            classLevel: req.query.classLevel,
            stream: req.query.stream,
            branch: req.query.branch,
            semester: req.query.semester,
            subject: req.query.subject,
            category: req.query.category,
            type: req.query.type,
            search: req.query.search,
            sort: req.query.sort
        };

        const files = await db.getPublicFiles(filters);
        res.json({ success: true, files, count: files.length });
    } catch (error) {
        console.error('Fetch shared notes error:', error);
        res.status(500).json({ success: false, message: 'Error fetching shared notes' });
    }
});

// Upload Notes with Full Academic Metadata
app.post('/api/files/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files were selected for upload' });
        }

        const title = req.body.title || '';
        const educationLevel = req.body.educationLevel || 'Engineering';
        const classLevel = req.body.classLevel || 'N/A';
        const stream = req.body.stream || 'N/A';
        const course = req.body.course || 'General';
        const branch = req.body.branch || 'Computer Science Engineering';
        const year = req.body.year || 'N/A';
        const semester = req.body.semester || 'Sem 1';
        const subject = req.body.subject || 'General';
        const category = req.body.category || 'Class Notes';
        const description = req.body.description || '';
        const tags = req.body.tags ? String(req.body.tags).split(',').map(t => t.trim()) : [];
        const academicYear = req.body.academicYear || '2025-2026';
        const isCustomSubject = req.body.isCustomSubject === 'true' || req.body.isCustomSubject === true;
        const isCustomBranch = req.body.isCustomBranch === 'true' || req.body.isCustomBranch === true;

        const uploaderId = req.user ? req.user.id : 'anonymous';
        const uploaderName = req.user ? req.user.username : 'Student';
        const uploaderEmail = req.user ? (req.user.email || '') : '';

        const uploadedFiles = [];
        for (const file of req.files) {
            const fileType = getFileType(file.mimetype, file.originalname);
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
                
                educationLevel: educationLevel,
                classLevel: classLevel,
                stream: stream,
                course: course,
                branch: branch,
                year: year,
                semester: semester,
                subject: subject,
                category: category,
                description: description,
                tags: tags,
                academicYear: academicYear,
                isCustomSubject: isCustomSubject,
                isCustomBranch: isCustomBranch,

                uploaderId: uploaderId,
                uploader: uploaderName,
                uploaderEmail: uploaderEmail,
                downloadCount: 0,
                uploadDate: new Date()
            };

            const savedFile = await db.createFile(fileData);
            uploadedFiles.push(savedFile);
        }

        res.status(201).json({
            success: true,
            message: 'Notes uploaded successfully!',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload notes error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload notes: ' + error.message });
    }
});

function getMimeTypeFromExt(filename = '') {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.pdf': return 'application/pdf';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        case '.txt': return 'text/plain; charset=utf-8';
        case '.doc': return 'application/msword';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.ppt': return 'application/vnd.ms-powerpoint';
        case '.pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case '.xls': return 'application/vnd.ms-excel';
        case '.xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        default: return 'application/octet-stream';
    }
}

// File Download Endpoint (Prioritizes local disk file and fixes Cloudinary redirects/raw URLs)
app.get('/api/files/:id/download', async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

        if (!file) {
            return res.status(404).json({ success: false, message: 'Note file not found' });
        }

        await db.incrementDownloadCount(req.params.id);

        const originalName = file.name || file.title || 'note_document';
        const contentType = file.mimetype || getMimeTypeFromExt(originalName);

        // 1. Check local server disk storage first (100% reliable direct binary stream)
        const filenameOnDisk = file.filename || (file.path ? path.basename(file.path) : '') || path.basename(file.url || '');
        if (filenameOnDisk) {
            const filePath = path.join(uploadsDir, filenameOnDisk);
            if (fs.existsSync(filePath)) {
                return res.download(filePath, originalName);
            }
        }

        // 2. Fallback to Cloudinary / Remote Storage with URL rewrite for non-image assets
        let fileUrl = file.url || '';
        const ext = path.extname(originalName).toLowerCase();
        if (['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
            fileUrl = fileUrl.replace('/image/upload/', '/raw/upload/');
        }

        if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
            try {
                const remoteRes = await fetch(fileUrl);
                if (remoteRes.ok) {
                    const arrayBuffer = await remoteRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);
                    res.setHeader('Content-Length', buffer.length);
                    return res.send(buffer);
                }
            } catch (fetchErr) {
                console.warn('Remote download fetch error, redirecting:', fetchErr.message);
            }
            return res.redirect(fileUrl);
        }

        return res.status(404).json({ success: false, message: 'Note file not found on server or cloud storage' });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ success: false, message: 'Error initiating file download' });
    }
});

// File View / Inline Preview Endpoint (Prioritizes local disk file and fixes PDF/Document rendering)
app.get('/api/files/:id/view', async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

        if (!file) {
            return res.status(404).send('Note file not found');
        }

        const originalName = file.name || file.title || 'note_document';
        const contentType = file.mimetype || getMimeTypeFromExt(originalName);

        // 1. Check local server disk storage first (100% reliable direct binary stream)
        const filenameOnDisk = file.filename || (file.path ? path.basename(file.path) : '') || path.basename(file.url || '');
        if (filenameOnDisk) {
            const filePath = path.join(uploadsDir, filenameOnDisk);
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
                return res.sendFile(filePath);
            }
        }

        // 2. Fallback to Cloudinary / Remote Storage with URL rewrite for non-image assets
        let fileUrl = file.url || '';
        const ext = path.extname(originalName).toLowerCase();
        if (['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
            fileUrl = fileUrl.replace('/image/upload/', '/raw/upload/');
        }

        if (fileUrl && (fileUrl.startsWith('http://') || fileUrl.startsWith('https://'))) {
            try {
                const remoteRes = await fetch(fileUrl);
                if (remoteRes.ok) {
                    const arrayBuffer = await remoteRes.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
                    res.setHeader('Content-Length', buffer.length);
                    return res.send(buffer);
                }
            } catch (err) {}
            return res.redirect(fileUrl);
        }

        return res.status(404).send('Note file missing on server storage');
    } catch (error) {
        console.error('View file error:', error);
        res.status(500).send('Error loading file preview');
    }
});

// Articles Public & Admin APIs
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await db.getArticles('PUBLISHED');
        res.json({ success: true, articles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching articles' });
    }
});

app.get('/api/articles/:slug', async (req, res) => {
    try {
        const article = await db.getArticleBySlug(req.params.slug);
        if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
        res.json({ success: true, article });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching article' });
    }
});

// Current Affairs & Daily News Engine API (Server-side fetch & Cache)
app.get('/api/current-affairs', async (req, res) => {
    try {
        let newsItems = await db.getNewsItems();

        // Seed initial news items if database is empty
        if (!newsItems || newsItems.length === 0) {
            const initialNews = [
                {
                    title: 'GATE 2026 Official Syllabus & Exam Pattern Announced for All Engineering Streams',
                    summary: 'IIT organises GATE 2026 with revised exam paper structure for CS, ECE, EE, Civil and Mechanical streams.',
                    category: 'Education',
                    source: 'National Academic News',
                    examRelevance: ['GATE', 'UPSC'],
                    isFeatured: true
                },
                {
                    title: 'UPSC Engineering Services & Civil Services Exam Registration Guidelines Updated',
                    summary: 'Union Public Service Commission updates candidate profile verification rules and subject choice formats.',
                    category: 'Government',
                    source: 'UPSC Portal',
                    examRelevance: ['UPSC', 'SSC'],
                    isFeatured: true
                },
                {
                    title: 'AI & Data Science Curriculum Standardized Across Technical Universities',
                    summary: 'New industry-aligned AI/ML core modules introduced for 3rd and 4th-year engineering undergraduates.',
                    category: 'Technology',
                    source: 'Tech Higher Ed',
                    examRelevance: ['GATE', 'Banking'],
                    isFeatured: false
                }
            ];
            newsItems = await db.saveNewsItems(initialNews);
        }

        res.json({ success: true, news: newsItems });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching current affairs' });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const newsItems = await db.getNewsItems();
        res.json({ success: true, news: newsItems });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching news' });
    }
});

// Report Note Endpoint
app.post('/api/reports', authenticateToken, async (req, res) => {
    try {
        const { fileId, fileTitle, reason, details } = req.body;
        if (!fileId || !reason) {
            return res.status(400).json({ success: false, message: 'fileId and reason are required' });
        }

        const report = await db.createReport({
            fileId,
            fileTitle: fileTitle || 'Note Document',
            reporterId: req.user ? req.user.id : 'anonymous',
            reporterName: req.user ? req.user.username : 'Student',
            reason,
            details: details || ''
        });

        res.status(201).json({ success: true, message: 'Report submitted successfully', report });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error submitting report' });
    }
});

// Delete Note
app.delete('/api/files/:id', authenticateToken, requireAuth, async (req, res) => {
    try {
        const file = await db.getFileById(req.params.id);

        if (!file) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }

        const isOwner = (file.uploaderId === req.user.id || req.user.role === 'admin');
        if (!isOwner) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this note' });
        }

        const deletedFile = await db.deleteFile(req.params.id, req.user.id);

        if (deletedFile) {
            if (deletedFile.cloudinaryId) {
                try {
                    await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'raw' });
                    await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'image' });
                } catch (cErr) {}
            }

            const filenameOnDisk = deletedFile.filename || path.basename(deletedFile.path || '');
            const filePath = path.join(uploadsDir, filenameOnDisk);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting note' });
    }
});

// ==========================================
// STRICT ADMIN PROTECTED APIS (/api/admin/*)
// ==========================================

app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const stats = await db.getAdminDashboardStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin dashboard stats' });
    }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users list' });
    }
});

app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const updated = await db.updateUserRole(req.params.id, role);
        res.json({ success: true, message: 'User role updated', user: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user role' });
    }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
        }
        const deleted = await db.deleteUser(req.params.id);
        res.json({ success: true, message: 'User deleted successfully', user: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

app.get('/api/admin/notes', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const files = await db.getPublicFiles();
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin notes' });
    }
});

app.delete('/api/admin/notes/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const deletedFile = await db.deleteFile(req.params.id, 'admin');
        if (deletedFile && deletedFile.cloudinaryId) {
            try {
                await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'raw' });
                await cloudinary.uploader.destroy(deletedFile.cloudinaryId, { resource_type: 'image' });
            } catch (e) {}
        }
        res.json({ success: true, message: 'Note deleted by admin' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting note' });
    }
});

app.get('/api/admin/articles', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const articles = await db.getArticles('ALL');
        res.json({ success: true, articles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching articles' });
    }
});

app.post('/api/admin/articles', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, shortDescription, content, category, status } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }
        const newArt = await db.createArticle({
            title,
            shortDescription: shortDescription || '',
            content,
            category: category || 'Education',
            status: status || 'PUBLISHED',
            author: req.user.username || 'Admin'
        });
        res.status(201).json({ success: true, message: 'Article created successfully', article: newArt });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating article' });
    }
});

app.delete('/api/admin/articles/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const deleted = await db.deleteArticle(req.params.id);
        res.json({ success: true, message: 'Article deleted', article: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting article' });
    }
});

app.get('/api/admin/reports', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const reports = await db.getReports();
        res.json({ success: true, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching reports' });
    }
});

// Server Initialization
async function startServer() {
    await db.testConnection();
    const serverIP = getServerIP();

    app.listen(PORT, '0.0.0.0', () => {
        console.log('\n==================================================');
        console.log('🚀 MYNOTES UNIVERSAL PLATFORM & ADMIN PORTAL');
        console.log('==================================================');
        console.log(`📍 Local access:   http://localhost:${PORT}`);
        console.log(`🌐 Network access: http://${serverIP}:${PORT}`);
        console.log(`🛡️ Admin Portal:  http://localhost:${PORT}/Admin`);
        console.log('==================================================\n');
    });
}

startServer();
