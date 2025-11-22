const admin = require("firebase-admin");
const path = require("path");
require('dotenv').config();

// Path to your service account key file
// You need to download this from Firebase Console -> Project Settings -> Service Accounts
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let firebaseAdmin;

try {
    // Check if service account file exists
    const fs = require('fs');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);

        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://mynotes-8e05e-default-rtdb.asia-southeast1.firebasedatabase.app"
        });

        console.log("✅ Firebase Admin initialized successfully");
    } else {
        console.warn("⚠️  serviceAccountKey.json not found. Firebase Admin not initialized.");
        console.warn("   Please download it from Firebase Console and place it in the root directory.");
    }
} catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error.message);
}

module.exports = firebaseAdmin;
