const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

const DATA_FILE = path.join(__dirname, 'data.json');

// MongoDB Atlas Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://versecolor7_db_user:u0TH6OZ82JaN2CjP@cluster0.eqrknzb.mongodb.net/mynotes?retryWrites=true&w=majority';
let mongoConnected = false;

// User Mongoose Schema with Role-Based Access Control
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    bookmarks: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// File/Note Universal Academic Mongoose Schema
const fileSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    filename: { type: String },
    url: { type: String },
    cloudinaryId: { type: String },
    type: { type: String, default: 'other' },
    size: { type: Number, default: 0 },
    mimetype: { type: String, default: 'application/octet-stream' },
    
    // Dynamic Academic Taxonomy Fields
    educationLevel: { type: String, default: 'Engineering', index: true },
    classLevel: { type: String, default: 'N/A', index: true },
    stream: { type: String, default: 'N/A', index: true },
    course: { type: String, default: 'B.Tech', index: true },
    branch: { type: String, default: 'Computer Science Engineering', index: true },
    year: { type: String, default: 'N/A' },
    semester: { type: String, default: 'Sem 1', index: true },
    subject: { type: String, default: 'General', index: true },
    category: { type: String, default: 'Class Notes', index: true },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    academicYear: { type: String, default: '2025-2026' },
    isCustomSubject: { type: Boolean, default: false },
    isCustomBranch: { type: Boolean, default: false },

    uploaderId: { type: String, default: 'anonymous' },
    uploader: { type: String, default: 'Student' },
    uploaderEmail: { type: String, default: '' },
    downloadCount: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

fileSchema.index({ educationLevel: 1, classLevel: 1, branch: 1, semester: 1, subject: 1, category: 1, uploadDate: -1 });

const FileModel = mongoose.models.File || mongoose.model('File', fileSchema);

// Article / Blog Mongoose Schema
const articleSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'MyNotes Team' },
    category: { type: String, default: 'Education' },
    tags: [{ type: String }],
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED', index: true },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const ArticleModel = mongoose.models.Article || mongoose.model('Article', articleSchema);

// Current Affairs & Daily News Mongoose Schema
const newsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    url: { type: String, default: '' },
    source: { type: String, default: 'Education News' },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'General', index: true },
    examRelevance: [{ type: String }], // e.g. ['UPSC', 'GATE', 'SSC', 'Banking']
    isFeatured: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const NewsModel = mongoose.models.News || mongoose.model('News', newsSchema);

// Report Mongoose Schema
const reportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    fileId: { type: String, required: true, index: true },
    fileTitle: { type: String },
    reporterId: { type: String, default: 'anonymous' },
    reporterName: { type: String, default: 'Student' },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const ReportModel = mongoose.models.Report || mongoose.model('Report', reportSchema);

// Dynamic Taxonomy Mongoose Schema
const taxonomySchema = new mongoose.Schema({
    type: { type: String, required: true, index: true },
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    createdBy: { type: String, default: 'system' },
    createdAt: { type: Date, default: Date.now }
});

const TaxonomyModel = mongoose.models.Taxonomy || mongoose.model('Taxonomy', taxonomySchema);

// Initialize Mongoose connection
async function connectMongoDB() {
    if (mongoConnected) return true;
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        mongoConnected = true;
        console.log('✅ Connected to MongoDB Atlas (Enterprise Schemas & RBAC Active)');
        return true;
    } catch (err) {
        console.warn('⚠️ MongoDB Atlas connection error:', err.message);
        mongoConnected = false;
        return false;
    }
}

connectMongoDB();

// PostgreSQL Configuration (Optional secondary engine)
const isPgConfigured = Boolean(process.env.DATABASE_URL);
let pool = null;
let pgConnected = false;

if (isPgConfigured) {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });

        pool.on('connect', () => {
            console.log('✅ Connected to Postgres database');
            pgConnected = true;
        });

        pool.on('error', (err) => {
            console.error('❌ Postgres connection pool error:', err.message);
            pgConnected = false;
        });
    } catch (err) {
        console.warn('⚠️ Postgres initialization warning:', err.message);
    }
}

// Local JSON Database Helper functions
function readLocalData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const initialData = { users: [], notes: [], files: [], reports: [], taxonomy: [], articles: [], news: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading data.json:', error.message);
        return { users: [], notes: [], files: [], reports: [], taxonomy: [], articles: [], news: [] };
    }
}

function writeLocalData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to data.json:', error.message);
    }
}

// Unified Database API supporting MongoDB Atlas + Local JSON Fallback
const db = {
    async testConnection() {
        if (!mongoConnected) {
            await connectMongoDB();
        }
        if (mongoConnected) {
            console.log('✅ Database (MongoDB Atlas) active');
            return true;
        }
        console.log('ℹ️ Using local JSON database (data.json)');
        return true;
    },

    // User Operations with Role-Based Access Control
    async createUser(id, username, email, hashedPassword, profileImage = null, role = 'user') {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newUser = new User({
                    id: id || Date.now().toString(),
                    username,
                    email,
                    password: hashedPassword,
                    profileImage: profileImage || null,
                    role: role || 'user',
                    status: 'active',
                    bookmarks: []
                });
                const saved = await newUser.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB createUser error, attempting fallback:', err.message);
            }
        }

        const data = readLocalData();
        const newUser = {
            id: id || Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            profileImage: profileImage || null,
            role: role || 'user',
            status: 'active',
            bookmarks: [],
            createdAt: new Date().toISOString()
        };
        data.users.push(newUser);
        writeLocalData(data);
        return newUser;
    },

    async getUserByUsername(username) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).lean();
                if (user) return user;
            } catch (err) {
                console.error('MongoDB getUserByUsername error:', err.message);
            }
        }

        const data = readLocalData();
        return data.users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase());
    },

    async getUserByEmail(email) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean();
                if (user) return user;
            } catch (err) {
                console.error('MongoDB getUserByEmail error:', err.message);
            }
        }

        const data = readLocalData();
        return data.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    },

    async getUserById(id) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const user = await User.findOne({ id }).lean();
                if (user) return user;
            } catch (err) {
                console.error('MongoDB getUserById error:', err.message);
            }
        }

        const data = readLocalData();
        return data.users.find(u => (u.id === id || u._id === id));
    },

    async getAllUsers() {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await User.find({}, '-password').sort({ createdAt: -1 }).lean();
            } catch (err) {
                console.error('MongoDB getAllUsers error:', err.message);
            }
        }
        const data = readLocalData();
        return data.users.map(({ password, ...user }) => user);
    },

    async updateUserRole(id, role) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await User.findOneAndUpdate({ id }, { role }, { new: true }).select('-password').lean();
            } catch (err) {
                console.error('MongoDB updateUserRole error:', err.message);
            }
        }
        const data = readLocalData();
        const user = data.users.find(u => u.id === id || u._id === id);
        if (user) {
            user.role = role;
            writeLocalData(data);
        }
        return user;
    },

    async deleteUser(id) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await User.findOneAndDelete({ id }).lean();
            } catch (err) {
                console.error('MongoDB deleteUser error:', err.message);
            }
        }
        const data = readLocalData();
        const idx = data.users.findIndex(u => u.id === id || u._id === id);
        if (idx !== -1) {
            const [deleted] = data.users.splice(idx, 1);
            writeLocalData(data);
            return deleted;
        }
        return null;
    },

    // File / Notes Operations
    async createFile(fileData) {
        const id = fileData.id || (Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9));
        const createdAt = new Date();

        const record = {
            id: id,
            title: fileData.title || fileData.name || 'Untitled Note',
            name: fileData.name || 'document',
            filename: fileData.filename || '',
            url: fileData.url || '',
            cloudinaryId: fileData.cloudinaryId || '',
            type: fileData.type || 'other',
            size: fileData.size || 0,
            mimetype: fileData.mimetype || 'application/octet-stream',
            
            educationLevel: fileData.educationLevel || 'Engineering',
            classLevel: fileData.classLevel || 'N/A',
            stream: fileData.stream || 'N/A',
            course: fileData.course || 'General',
            branch: fileData.branch || 'General',
            year: fileData.year || 'N/A',
            semester: fileData.semester || 'All Semesters',
            subject: fileData.subject || 'General',
            category: fileData.category || 'Class Notes',
            description: fileData.description || '',
            tags: Array.isArray(fileData.tags) ? fileData.tags : (fileData.tags ? String(fileData.tags).split(',').map(t => t.trim()) : []),
            academicYear: fileData.academicYear || '2025-2026',
            isCustomSubject: Boolean(fileData.isCustomSubject),
            isCustomBranch: Boolean(fileData.isCustomBranch),

            uploaderId: fileData.uploaderId || fileData.userId || 'anonymous',
            uploader: fileData.uploader || 'Student',
            uploaderEmail: fileData.uploaderEmail || '',
            downloadCount: fileData.downloadCount || 0,
            uploadDate: createdAt
        };

        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newFile = new FileModel(record);
                const saved = await newFile.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB createFile error:', err.message);
            }
        }

        const data = readLocalData();
        data.files = data.files || [];
        data.files.unshift(record);
        writeLocalData(data);
        return record;
    },

    async getPublicFiles(filters = {}) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const query = {};

                if (filters.educationLevel && filters.educationLevel !== 'all') {
                    query.educationLevel = filters.educationLevel;
                }
                if (filters.classLevel && filters.classLevel !== 'all') {
                    query.classLevel = filters.classLevel;
                }
                if (filters.stream && filters.stream !== 'all') {
                    query.stream = filters.stream;
                }
                if (filters.branch && filters.branch !== 'all') {
                    query.branch = filters.branch;
                }
                if (filters.semester && filters.semester !== 'all') {
                    query.semester = filters.semester;
                }
                if (filters.subject && filters.subject !== 'all') {
                    query.subject = filters.subject;
                }
                if (filters.category && filters.category !== 'all') {
                    query.category = filters.category;
                }
                if (filters.type && filters.type !== 'all') {
                    query.type = filters.type;
                }

                if (filters.search) {
                    const searchRegex = new RegExp(filters.search.trim(), 'i');
                    query.$or = [
                        { title: searchRegex },
                        { name: searchRegex },
                        { description: searchRegex },
                        { subject: searchRegex },
                        { branch: searchRegex },
                        { classLevel: searchRegex },
                        { educationLevel: searchRegex },
                        { category: searchRegex },
                        { tags: searchRegex }
                    ];
                }

                let sortOptions = { uploadDate: -1, createdAt: -1 };
                if (filters.sort === 'oldest') sortOptions = { uploadDate: 1, createdAt: 1 };
                if (filters.sort === 'downloads') sortOptions = { downloadCount: -1, uploadDate: -1 };
                if (filters.sort === 'title') sortOptions = { title: 1 };

                const files = await FileModel.find(query).sort(sortOptions).lean();
                return files;
            } catch (err) {
                console.error('MongoDB getPublicFiles error:', err.message);
            }
        }

        const data = readLocalData();
        let filesList = data.files || [];

        if (filters.educationLevel && filters.educationLevel !== 'all') {
            filesList = filesList.filter(f => (f.educationLevel || 'Engineering') === filters.educationLevel);
        }
        if (filters.classLevel && filters.classLevel !== 'all') {
            filesList = filesList.filter(f => f.classLevel === filters.classLevel);
        }
        if (filters.branch && filters.branch !== 'all') {
            filesList = filesList.filter(f => f.branch === filters.branch);
        }
        if (filters.semester && filters.semester !== 'all') {
            filesList = filesList.filter(f => f.semester === filters.semester);
        }
        if (filters.subject && filters.subject !== 'all') {
            filesList = filesList.filter(f => f.subject === filters.subject);
        }
        if (filters.category && filters.category !== 'all') {
            filesList = filesList.filter(f => f.category === filters.category);
        }
        if (filters.search) {
            const q = filters.search.toLowerCase();
            filesList = filesList.filter(f => 
                (f.title && f.title.toLowerCase().includes(q)) ||
                (f.name && f.name.toLowerCase().includes(q)) ||
                (f.subject && f.subject.toLowerCase().includes(q)) ||
                (f.branch && f.branch.toLowerCase().includes(q)) ||
                (f.description && f.description.toLowerCase().includes(q))
            );
        }

        return filesList.sort((a, b) => new Date(b.uploadDate || b.createdAt || 0) - new Date(a.uploadDate || a.createdAt || 0));
    },

    async getFileById(id) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const file = await FileModel.findOne({ id }).lean();
                if (file) return file;
            } catch (err) {
                console.error('MongoDB getFileById error:', err.message);
            }
        }

        const data = readLocalData();
        return (data.files || []).find(f => (f.id === id || f._id === id));
    },

    async incrementDownloadCount(id) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                await FileModel.updateOne({ id }, { $inc: { downloadCount: 1 } });
            } catch (err) {
                console.error('MongoDB incrementDownloadCount error:', err.message);
            }
        }

        const data = readLocalData();
        const file = (data.files || []).find(f => f.id === id || f._id === id);
        if (file) {
            file.downloadCount = (file.downloadCount || 0) + 1;
            writeLocalData(data);
        }
    },

    async deleteFile(id, userId) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const file = await FileModel.findOne({ id });
                if (file) {
                    if (!userId || file.uploaderId === userId || userId === 'admin') {
                        await FileModel.deleteOne({ id });
                        return file.toObject();
                    }
                }
            } catch (err) {
                console.error('MongoDB deleteFile error:', err.message);
            }
        }

        const data = readLocalData();
        const fileIndex = (data.files || []).findIndex(f => (f.id === id || f._id === id));
        if (fileIndex !== -1) {
            const file = data.files[fileIndex];
            if (!userId || file.uploaderId === userId || file.userId === userId || userId === 'admin') {
                const [deleted] = data.files.splice(fileIndex, 1);
                writeLocalData(data);
                return deleted;
            }
        }
        return null;
    },

    // Article CRUD Operations
    async createArticle(articleData) {
        const id = articleData.id || ('art-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));
        const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const record = {
            id,
            title: articleData.title,
            slug,
            shortDescription: articleData.shortDescription || '',
            content: articleData.content || '',
            featuredImage: articleData.featuredImage || '',
            author: articleData.author || 'MyNotes Team',
            category: articleData.category || 'Education',
            tags: articleData.tags || [],
            status: articleData.status || 'PUBLISHED',
            viewsCount: 0,
            publishedAt: new Date()
        };

        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newArt = new ArticleModel(record);
                const saved = await newArt.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB createArticle error:', err.message);
            }
        }

        const data = readLocalData();
        data.articles = data.articles || [];
        data.articles.unshift(record);
        writeLocalData(data);
        return record;
    },

    async getArticles(statusFilter = 'PUBLISHED') {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const query = statusFilter === 'ALL' ? {} : { status: statusFilter };
                return await ArticleModel.find(query).sort({ publishedAt: -1 }).lean();
            } catch (err) {
                console.error('MongoDB getArticles error:', err.message);
            }
        }

        const data = readLocalData();
        const articles = data.articles || [];
        if (statusFilter === 'ALL') return articles;
        return articles.filter(a => a.status === statusFilter);
    },

    async getArticleBySlug(slug) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await ArticleModel.findOne({ slug }).lean();
            } catch (err) {
                console.error('MongoDB getArticleBySlug error:', err.message);
            }
        }

        const data = readLocalData();
        return (data.articles || []).find(a => a.slug === slug);
    },

    async deleteArticle(id) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await ArticleModel.findOneAndDelete({ id }).lean();
            } catch (err) {
                console.error('MongoDB deleteArticle error:', err.message);
            }
        }

        const data = readLocalData();
        const idx = (data.articles || []).findIndex(a => a.id === id);
        if (idx !== -1) {
            const [deleted] = data.articles.splice(idx, 1);
            writeLocalData(data);
            return deleted;
        }
        return null;
    },

    // Current Affairs & Daily News Operations
    async saveNewsItems(items = []) {
        if (!mongoConnected) await connectMongoDB();
        const savedList = [];

        for (const item of items) {
            const record = {
                id: item.id || ('news-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)),
                title: item.title,
                summary: item.summary || item.description || '',
                content: item.content || '',
                url: item.url || '',
                source: item.source || 'Education News',
                imageUrl: item.imageUrl || item.urlToImage || '',
                category: item.category || 'General',
                examRelevance: item.examRelevance || ['UPSC', 'GATE', 'SSC', 'Banking'],
                isFeatured: Boolean(item.isFeatured),
                isHidden: Boolean(item.isHidden),
                publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date()
            };

            if (mongoConnected) {
                try {
                    await NewsModel.updateOne({ title: record.title }, { $setOnInsert: record }, { upsert: true });
                    savedList.push(record);
                } catch (e) {}
            } else {
                const data = readLocalData();
                data.news = data.news || [];
                if (!data.news.some(n => n.title === record.title)) {
                    data.news.unshift(record);
                    writeLocalData(data);
                }
                savedList.push(record);
            }
        }
        return savedList;
    },

    async getNewsItems() {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await NewsModel.find({ isHidden: { $ne: true } }).sort({ publishedAt: -1 }).limit(30).lean();
            } catch (err) {
                console.error('MongoDB getNewsItems error:', err.message);
            }
        }

        const data = readLocalData();
        return (data.news || []).filter(n => !n.isHidden).slice(0, 30);
    },

    // Report Note Handler
    async createReport(reportData) {
        const id = 'rep-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const record = {
            id,
            fileId: reportData.fileId,
            fileTitle: reportData.fileTitle || '',
            reporterId: reportData.reporterId || 'anonymous',
            reporterName: reportData.reporterName || 'Student',
            reason: reportData.reason || 'Other',
            details: reportData.details || '',
            status: 'pending',
            createdAt: new Date()
        };

        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newReport = new ReportModel(record);
                const saved = await newReport.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB createReport error:', err.message);
            }
        }

        const data = readLocalData();
        data.reports = data.reports || [];
        data.reports.push(record);
        writeLocalData(data);
        return record;
    },

    async getReports() {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                return await ReportModel.find().sort({ createdAt: -1 }).lean();
            } catch (err) {
                console.error('MongoDB getReports error:', err.message);
            }
        }

        const data = readLocalData();
        return data.reports || [];
    },

    // Admin Dashboard Analytics Generator
    async getAdminDashboardStats() {
        let totalUsers = 0;
        let totalNotes = 0;
        let totalDownloads = 0;
        let totalArticles = 0;
        let totalNews = 0;
        let totalReports = 0;

        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                totalUsers = await User.countDocuments();
                totalNotes = await FileModel.countDocuments();
                totalArticles = await ArticleModel.countDocuments();
                totalNews = await NewsModel.countDocuments();
                totalReports = await ReportModel.countDocuments({ status: 'pending' });

                const dlStats = await FileModel.aggregate([
                    { $group: { _id: null, totalDl: { $sum: "$downloadCount" } } }
                ]);
                totalDownloads = dlStats[0] ? dlStats[0].totalDl : 0;
            } catch (err) {
                console.error('MongoDB getAdminDashboardStats error:', err.message);
            }
        } else {
            const data = readLocalData();
            totalUsers = (data.users || []).length;
            totalNotes = (data.files || []).length;
            totalArticles = (data.articles || []).length;
            totalNews = (data.news || []).length;
            totalReports = (data.reports || []).length;
            totalDownloads = (data.files || []).reduce((acc, f) => acc + (f.downloadCount || 0), 0);
        }

        return {
            totalUsers,
            totalNotes,
            totalDownloads,
            totalArticles,
            totalNews,
            totalReports,
            storageUsage: 'Cloudinary CDN Active'
        };
    }
};

module.exports = {
    pool,
    db,
    User,
    FileModel,
    ArticleModel,
    NewsModel,
    ReportModel,
    TaxonomyModel
};
