const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const { db } = require('../db');

async function createAdminAccount() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mynotes.edu';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@MyNotes2026';

    console.log('==================================================');
    console.log('🛡️ MYNOTES - ADMIN ACCOUNT PROVISIONING SCRIPT');
    console.log('==================================================');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Username: ${adminUsername}`);
    console.log('==================================================');

    await db.testConnection();

    const existingUser = await db.getUserByUsername(adminUsername);
    if (existingUser) {
        console.log(`ℹ️ Admin user "${adminUsername}" already exists. Updating role to "admin"...`);
        await db.updateUserRole(existingUser.id || existingUser._id, 'admin');
        console.log('✅ Admin role granted successfully!');
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = 'admin-' + Date.now();

    const newAdmin = await db.createUser(userId, adminUsername, adminEmail, hashedPassword, null, 'admin');
    console.log('✅ Admin account provisioned successfully!');
    console.log(`ID: ${newAdmin.id || newAdmin._id}`);
    console.log(`Role: ${newAdmin.role}`);
    console.log('==================================================\n');
    process.exit(0);
}

createAdminAccount().catch(err => {
    console.error('❌ Admin creation error:', err.message);
    process.exit(1);
});
