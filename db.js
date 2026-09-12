const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

const DATA_FILE = path.join(__dirname, 'data.json');

// MongoDB Atlas Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://versecolor7_db_user:u0TH6OZ82JaN2CjP@cluster0.eqrknzb.mongodb.net/mynotes?retryWrites=true&w=majority';
let mongoConnected = false;

// User Mongoose Schema
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
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
    educationLevel: { type: String, default: 'Engineering', index: true }, // School, Class 1-12, Diploma, Engineering, Postgraduate, Other
    classLevel: { type: String, default: 'N/A', index: true },           // Class 1 to Class 12, N/A
    stream: { type: String, default: 'N/A', index: true },               // Science, Commerce, Arts/Humanities, N/A
    course: { type: String, default: 'B.Tech', index: true },             // B.Tech, B.E., Diploma, CBSE, ICSE, State Board, General
    branch: { type: String, default: 'Computer Science Engineering', index: true }, // 35+ branches or Custom
    year: { type: String, default: 'N/A' },                               // 1st Year, 2nd Year, 3rd Year, 4th Year
    semester: { type: String, default: 'Sem 1', index: true },            // Sem 1 to Sem 8, All Semesters
    subject: { type: String, default: 'General', index: true },           // Subject name
    category: { type: String, default: 'Class Notes', index: true },       // Class Notes, Lecture Notes, Question Papers, etc.
    description: { type: String, default: '' },
    tags: [{ type: String }],                                            // Searchable tags
    academicYear: { type: String, default: '2025-2026' },
    isCustomSubject: { type: Boolean, default: false },
    isCustomBranch: { type: Boolean, default: false },

    uploaderId: { type: String, default: 'anonymous' },
    uploader: { type: String, default: 'Student' },
    uploaderEmail: { type: String, default: '' },
    downloadCount: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound Index for High Performance Multi-Criteria Queries
fileSchema.index({ educationLevel: 1, classLevel: 1, branch: 1, semester: 1, subject: 1, category: 1, uploadDate: -1 });

const FileModel = mongoose.models.File || mongoose.model('File', fileSchema);

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

// Dynamic Taxonomy Mongoose Schema (For Database-Driven Subjects & Branches)
const taxonomySchema = new mongoose.Schema({
    type: { type: String, required: true, index: true }, // 'branch', 'subject'
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
        console.log('✅ Connected to MongoDB Atlas (Universal Notes Schema Ready)');
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
            const initialData = { users: [], notes: [], files: [], reports: [], taxonomy: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading data.json:', error.message);
        return { users: [], notes: [], files: [], reports: [], taxonomy: [] };
    }
}

function writeLocalData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to data.json:', error.message);
    }
}

// Unified Database API supporting MongoDB Atlas + Postgres + Local JSON Fallback
const db = {
    async testConnection() {
        if (!mongoConnected) {
            await connectMongoDB();
        }
        if (mongoConnected) {
            console.log('✅ Database (MongoDB Atlas) active');
            return true;
        }
        if (isPgConfigured && pool) {
            try {
                const res = await pool.query('SELECT NOW() as current_time');
                pgConnected = true;
                console.log('✅ Database (Postgres) connection verified:', res.rows[0].current_time);
                return true;
            } catch (err) {
                console.warn('⚠️ Postgres connection failed:', err.message);
                pgConnected = false;
            }
        }
        console.log('ℹ️ Using local JSON database (data.json)');
        return true;
    },

    // User Operations
    async createUser(id, username, email, hashedPassword, profileImage = null) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newUser = new User({
                    id: id || Date.now().toString(),
                    username,
                    email,
                    password: hashedPassword,
                    profileImage: profileImage || null,
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

    // File / Universal Notes Operations
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

    // Multi-Criteria Advanced Search & Filter Handler
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

                // Text / Regex Search across Title, Description, Subject, Branch, Tags, Filename
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

                // Sorting logic
                let sortOptions = { uploadDate: -1, createdAt: -1 };
                if (filters.sort === 'oldest') sortOptions = { uploadDate: 1, createdAt: 1 };
                if (filters.sort === 'downloads') sortOptions = { downloadCount: -1, uploadDate: -1 };
                if (filters.sort === 'title') sortOptions = { title: 1 };
                if (filters.sort === 'title_desc') sortOptions = { title: -1 };

                const files = await FileModel.find(query).sort(sortOptions).lean();
                return files;
            } catch (err) {
                console.error('MongoDB getPublicFiles error:', err.message);
            }
        }

        const data = readLocalData();
        let filesList = data.files || [];

        // Local array filtering logic
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

    // Dynamic Taxonomy Custom Subjects & Branches
    async addCustomTaxonomy(type, name, category = 'General', userId = 'system') {
        const record = { type, name, category, createdBy: userId, createdAt: new Date() };

        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const newTax = new TaxonomyModel(record);
                const saved = await newTax.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB addCustomTaxonomy error:', err.message);
            }
        }

        const data = readLocalData();
        data.taxonomy = data.taxonomy || [];
        data.taxonomy.push(record);
        writeLocalData(data);
        return record;
    },

    async getCustomTaxonomies() {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const list = await TaxonomyModel.find().lean();
                return list;
            } catch (err) {
                console.error('MongoDB getCustomTaxonomies error:', err.message);
            }
        }

        const data = readLocalData();
        return data.taxonomy || [];
    }
};

module.exports = {
    pool,
    db,
    User,
    FileModel,
    ReportModel,
    TaxonomyModel
};
