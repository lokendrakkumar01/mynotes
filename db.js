const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to Neon Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection fails
});

// Test the database connection
pool.on('connect', () => {
    console.log('✅ Connected to Neon Postgres database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper function to execute queries
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Query executed', { text: text.substring(0, 50), duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Database query error:', error.message);
        throw error;
    }
}

// Helper function to get a client from the pool (for transactions)
async function getClient() {
    const client = await pool.connect();
    const originalQuery = client.query;
    const originalRelease = client.release;

    // Set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
        console.error('⚠️  A client has been checked out for more than 5 seconds!');
    }, 5000);

    // Monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
        client.lastQuery = args;
        return originalQuery.apply(client, args);
    };

    client.release = () => {
        // Clear our timeout
        clearTimeout(timeout);
        // Set the methods back to their old un-monkey-patched version
        client.query = originalQuery;
        client.release = originalRelease;
        return originalRelease.apply(client);
    };

    return client;
}

// Database helper functions

// Users
const db = {
    // User operations
    async createUser(id, username, email, hashedPassword, profileImage = null) {
        const query_text = `
      INSERT INTO users (id, username, email, password, profile_image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, profile_image, created_at
    `;
        const result = await query(query_text, [id, username, email, hashedPassword, profileImage]);
        return result.rows[0];
    },

    async getUserByUsername(username) {
        const query_text = 'SELECT * FROM users WHERE username = $1';
        const result = await query(query_text, [username]);
        return result.rows[0];
    },

    async getUserByEmail(email) {
        const query_text = 'SELECT * FROM users WHERE email = $1';
        const result = await query(query_text, [email]);
        return result.rows[0];
    },

    async getUserById(id) {
        const query_text = 'SELECT id, username, email, profile_image, created_at FROM users WHERE id = $1';
        const result = await query(query_text, [id]);
        return result.rows[0];
    },

    // Note operations
    async createNote(id, title, content, userId) {
        const query_text = `
      INSERT INTO notes (id, title, content, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = await query(query_text, [id, title, content, userId]);
        return result.rows[0];
    },

    async getNotesByUserId(userId) {
        const query_text = 'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await query(query_text, [userId]);
        return result.rows;
    },

    async getNoteById(id, userId) {
        const query_text = 'SELECT * FROM notes WHERE id = $1 AND user_id = $2';
        const result = await query(query_text, [id, userId]);
        return result.rows[0];
    },

    async updateNote(id, title, content, userId) {
        const query_text = `
      UPDATE notes 
      SET title = $1, content = $2
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `;
        const result = await query(query_text, [title, content, id, userId]);
        return result.rows[0];
    },

    async deleteNote(id, userId) {
        const query_text = 'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await query(query_text, [id, userId]);
        return result.rows[0];
    },

    // File operations
    async createFile(fileData) {
        const query_text = `
      INSERT INTO files (id, name, filename, type, size, mimetype, uploader_id, uploader, uploader_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const result = await query(query_text, [
            fileData.id,
            fileData.name,
            fileData.filename,
            fileData.type,
            fileData.size,
            fileData.mimetype,
            fileData.uploaderId,
            fileData.uploader,
            fileData.uploaderEmail
        ]);
        return result.rows[0];
    },

    async getFilesByUserId(userId) {
        const query_text = 'SELECT * FROM files WHERE uploader_id = $1 ORDER BY upload_date DESC';
        const result = await query(query_text, [userId]);
        return result.rows;
    },

    async getFileById(id) {
        const query_text = 'SELECT * FROM files WHERE id = $1';
        const result = await query(query_text, [id]);
        return result.rows[0];
    },

    async deleteFile(id, uploaderId) {
        const query_text = 'DELETE FROM files WHERE id = $1 AND uploader_id = $2 RETURNING *';
        const result = await query(query_text, [id, uploaderId]);
        return result.rows[0];
    },

    async renameFile(id, newName, uploaderId) {
        const query_text = `
      UPDATE files 
      SET name = $1
      WHERE id = $2 AND uploader_id = $3
      RETURNING *
    `;
        const result = await query(query_text, [newName, id, uploaderId]);
        return result.rows[0];
    },

    // Utility functions
    async testConnection() {
        try {
            const result = await query('SELECT NOW() as current_time');
            console.log('✅ Database connection test successful:', result.rows[0].current_time);
            return true;
        } catch (error) {
            console.error('❌ Database connection test failed:', error.message);
            return false;
        }
    }
};

module.exports = {
    pool,
    query,
    getClient,
    db
};
