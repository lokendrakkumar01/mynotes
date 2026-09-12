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
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// File/Note Mongoose Schema
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
    subject: { type: String, default: 'General' },
    semester: { type: String, default: 'All Semesters' },
    course: { type: String, default: 'General' },
    description: { type: String, default: '' },
    uploaderId: { type: String, default: 'anonymous' },
    uploader: { type: String, default: 'Student' },
    uploaderEmail: { type: String, default: '' },
    downloadCount: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

const FileModel = mongoose.models.File || mongoose.model('File', fileSchema);

// Initialize Mongoose connection
async function connectMongoDB() {
    if (mongoConnected) return true;
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        mongoConnected = true;
        console.log('✅ Connected to MongoDB Atlas');
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
            const initialData = { users: [], notes: [], files: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading data.json:', error.message);
        return { users: [], notes: [], files: [] };
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
                    profileImage: profileImage || null
                });
                const saved = await newUser.save();
                return saved.toObject();
            } catch (err) {
                console.error('MongoDB createUser error, attempting fallback:', err.message);
            }
        }

        if (pgConnected && pool) {
            try {
                const text = `
                    INSERT INTO users (id, username, email, password, profile_image)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, username, email, profile_image, created_at
                `;
                const res = await pool.query(text, [id, username, email, hashedPassword, profileImage]);
                return res.rows[0];
            } catch (err) {
                console.error('Postgres createUser failed, falling back to local:', err.message);
            }
        }

        const data = readLocalData();
        const newUser = {
            id: id || Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            profileImage: profileImage || null,
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

        if (pgConnected && pool) {
            try {
                const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres getUserByUsername failed:', err.message);
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

        if (pgConnected && pool) {
            try {
                const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres getUserByEmail failed:', err.message);
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

        if (pgConnected && pool) {
            try {
                const res = await pool.query('SELECT id, username, email, profile_image, created_at FROM users WHERE id = $1', [id]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres getUserById failed:', err.message);
            }
        }

        const data = readLocalData();
        return data.users.find(u => (u.id === id || u._id === id));
    },

    // File / Notes Upload Operations
    async createFile(fileData) {
        const id = fileData.id || (Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9));
        const createdAt = new Date().toISOString();

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
            subject: fileData.subject || 'General',
            semester: fileData.semester || 'All Semesters',
            course: fileData.course || 'General',
            description: fileData.description || '',
            uploaderId: fileData.uploaderId || fileData.userId || 'anonymous',
            uploader: fileData.uploader || 'Student',
            uploaderEmail: fileData.uploaderEmail || '',
            downloadCount: fileData.downloadCount || 0,
            uploadDate: fileData.uploadDate || createdAt
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

        if (pgConnected && pool) {
            try {
                const text = `
                    INSERT INTO files (id, name, filename, type, size, mimetype, uploader_id, uploader, uploader_email, subject, semester, course, description, download_count)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    RETURNING *
                `;
                const res = await pool.query(text, [
                    record.id, record.name, record.filename, record.type, record.size, record.mimetype,
                    record.uploaderId, record.uploader, record.uploaderEmail,
                    record.subject, record.semester, record.course, record.description, record.downloadCount
                ]);
                return res.rows[0];
            } catch (err) {
                console.error('Postgres createFile failed, falling back to local JSON:', err.message);
            }
        }

        const data = readLocalData();
        data.files = data.files || [];
        data.files.unshift(record);
        writeLocalData(data);
        return record;
    },

    // Get ALL Shared Public Notes for All Students
    async getPublicFiles() {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const files = await FileModel.find().sort({ uploadDate: -1, createdAt: -1 }).lean();
                return files;
            } catch (err) {
                console.error('MongoDB getPublicFiles error:', err.message);
            }
        }

        if (pgConnected && pool) {
            try {
                const res = await pool.query('SELECT * FROM files ORDER BY upload_date DESC');
                return res.rows;
            } catch (err) {
                console.error('Postgres getPublicFiles failed:', err.message);
            }
        }

        const data = readLocalData();
        const filesList = data.files || [];
        return filesList.sort((a, b) => new Date(b.uploadDate || b.createdAt || 0) - new Date(a.uploadDate || a.createdAt || 0));
    },

    async getFilesByUserId(userId) {
        return this.getPublicFiles();
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

        if (pgConnected && pool) {
            try {
                const res = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres getFileById failed:', err.message);
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

        if (pgConnected && pool) {
            try {
                await pool.query('UPDATE files SET download_count = COALESCE(download_count, 0) + 1 WHERE id = $1', [id]);
            } catch (err) {
                console.error('Postgres incrementDownloadCount error:', err.message);
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

        if (pgConnected && pool) {
            try {
                const res = await pool.query('DELETE FROM files WHERE id = $1 AND (uploader_id = $2 OR uploader_id = \'admin\') RETURNING *', [id, userId]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres deleteFile error:', err.message);
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

    async renameFile(id, newName, userId) {
        if (!mongoConnected) await connectMongoDB();
        if (mongoConnected) {
            try {
                const file = await FileModel.findOne({ id });
                if (file && (!userId || file.uploaderId === userId)) {
                    file.name = newName;
                    file.title = newName;
                    const saved = await file.save();
                    return saved.toObject();
                }
            } catch (err) {
                console.error('MongoDB renameFile error:', err.message);
            }
        }

        if (pgConnected && pool) {
            try {
                const res = await pool.query('UPDATE files SET name = $1 WHERE id = $2 AND uploader_id = $3 RETURNING *', [newName, id, userId]);
                if (res.rows.length > 0) return res.rows[0];
            } catch (err) {
                console.error('Postgres renameFile error:', err.message);
            }
        }

        const data = readLocalData();
        const file = (data.files || []).find(f => (f.id === id || f._id === id));
        if (file && (!userId || file.uploaderId === userId || file.userId === userId)) {
            file.name = newName;
            file.title = newName;
            file.updatedAt = new Date().toISOString();
            writeLocalData(data);
            return file;
        }
        return null;
    }
};

module.exports = {
    pool,
    db,
    User,
    FileModel
};
