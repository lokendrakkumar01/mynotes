const { db } = require('./db');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrateData() {
    console.log('\n========================================');
    console.log('🔄 DATA MIGRATION TOOL');
    console.log('========================================\n');

    try {
        // Read existing data.json
        const dataFile = path.join(__dirname, 'data.json');

        if (!fs.existsSync(dataFile)) {
            console.log('ℹ️  No data.json file found. Nothing to migrate.');
            console.log('Starting with an empty database.');
            return;
        }

        console.log('📄 Reading data.json...');
        const rawData = fs.readFileSync(dataFile, 'utf8');
        const data = JSON.parse(rawData);

        console.log('\n📊 Data Summary:');
        console.log(`   Users: ${data.users?.length || 0}`);
        console.log(`   Notes: ${data.notes?.length || 0}`);
        console.log(`   Files: ${data.files?.length || 0}`);

        // Migrate users
        if (data.users && data.users.length > 0) {
            console.log('\n👥 Migrating users...');
            let successCount = 0;
            let errorCount = 0;

            for (const user of data.users) {
                try {
                    const userId = user.id || user._id;
                    if (!userId) {
                        console.log(`   ⚠️  Skipping user ${user.username} - No ID found`);
                        continue;
                    }

                    // Check if user already exists
                    const existingUser = await db.getUserById(userId);
                    if (existingUser) {
                        console.log(`   ⚠️  User ${user.username} already exists, skipping`);
                        continue;
                    }

                    await db.createUser(
                        userId,
                        user.username,
                        user.email,
                        user.password,
                        user.profileImage || null
                    );
                    successCount++;
                    console.log(`   ✅ ${user.username}`);
                } catch (error) {
                    // If error is duplicate key, just skip
                    if (error.code === '23505') {
                        console.log(`   ⚠️  User ${user.username} already exists (duplicate key)`);
                    } else {
                        errorCount++;
                        console.log(`   ❌ ${user.username} - ${error.message}`);
                    }
                }
            }
            console.log(`\n✅ Users migrated: ${successCount}/${data.users.length}`);
        }

        // Migrate notes
        if (data.notes && data.notes.length > 0) {
            console.log('\n📝 Migrating notes...');
            let successCount = 0;
            let errorCount = 0;

            for (const note of data.notes) {
                try {
                    const noteId = note.id || note._id;
                    const userId = note.userId || note.user_id;

                    if (!noteId || !userId) {
                        console.log(`   ⚠️  Skipping note "${note.title}" - Missing ID or UserID`);
                        continue;
                    }

                    await db.createNote(
                        noteId,
                        note.title,
                        note.content || '',
                        userId
                    );
                    successCount++;
                    console.log(`   ✅ "${note.title.substring(0, 30)}..."`);
                } catch (error) {
                    if (error.code === '23505') {
                        console.log(`   ⚠️  Note "${note.title}" already exists`);
                    } else {
                        errorCount++;
                        console.log(`   ❌ "${note.title.substring(0, 30)}..." - ${error.message}`);
                    }
                }
            }
            console.log(`\n✅ Notes migrated: ${successCount}/${data.notes.length}`);
        }

        // Migrate files
        if (data.files && data.files.length > 0) {
            console.log('\n📁 Migrating files...');
            let successCount = 0;
            let errorCount = 0;

            for (const file of data.files) {
                try {
                    // Extract filename from path if filename is missing
                    let filename = file.filename;
                    if (!filename && file.path) {
                        filename = path.basename(file.path);
                    }

                    const fileId = file.id || file._id;
                    const uploaderId = file.uploaderId || file.uploader_id || file.userId; // Handle userId legacy field

                    if (!fileId || !filename || !uploaderId) {
                        console.log(`   ⚠️  Skipping file ${file.name} - Missing required data`);
                        continue;
                    }

                    await db.createFile({
                        id: fileId,
                        name: file.name,
                        filename: filename,
                        type: file.type || 'other',
                        size: file.size || 0,
                        mimetype: file.mimetype || 'application/octet-stream',
                        uploaderId: uploaderId,
                        uploader: file.uploader || 'Unknown',
                        uploaderEmail: file.uploaderEmail || file.uploader_email || ''
                    });
                    successCount++;
                    console.log(`   ✅ ${file.name}`);
                } catch (error) {
                    if (error.code === '23505') {
                        console.log(`   ⚠️  File ${file.name} already exists`);
                    } else {
                        errorCount++;
                        console.log(`   ❌ ${file.name} - ${error.message}`);
                    }
                }
            }
            console.log(`\n✅ Files migrated: ${successCount}/${data.files.length}`);
        }

        // Create backup of data.json
        const backupFile = path.join(__dirname, `data.json.backup.${Date.now()}`);
        fs.copyFileSync(dataFile, backupFile);
        console.log(`\n💾 Backup created: ${path.basename(backupFile)}`);

        console.log('\n========================================');
        console.log('✅ MIGRATION COMPLETE!');
        console.log('========================================\n');
        console.log('Your data has been successfully migrated to Neon Postgres.');
        console.log('The original data.json has been backed up.');
        console.log('\nYou can now start your server with: npm start');
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ ERROR during migration:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        // Close database connection
        process.exit(0);
    }
}

// Run migration
migrateData();
