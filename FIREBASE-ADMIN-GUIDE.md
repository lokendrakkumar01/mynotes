# Firebase Admin Setup Guide

You have requested to use `firebase-admin` (Server Side SDK). This allows your backend server to have full access to your Firebase project.

## ⚠️ Critical Step Required

To make this work, you need a **Service Account Key**.

1.  **Go to Firebase Console**:
    *   Open [https://console.firebase.google.com/](https://console.firebase.google.com/)
    *   Select your project **"MyNotes"** (mynotes-8e05e).

2.  **Generate Key**:
    *   Click the **Gear Icon** ⚙️ (Project Settings) -> **Service accounts** tab.
    *   Click **"Generate new private key"**.
    *   Click **"Generate key"** to confirm.

3.  **Save the File**:
    *   A JSON file will download.
    *   **Rename** this file to `serviceAccountKey.json`.
    *   **Move** it to your project folder: `c:\Users\loken\Downloads\mynotes\serviceAccountKey.json`.

## How to use it

I have created a file `firebase-admin-setup.js` for you. You can use it in your `server.js` like this:

```javascript
const admin = require('./firebase-admin-setup');

// Example: Get data from Realtime Database
if (admin) {
    const db = admin.database();
    const ref = db.ref('some/path');
    ref.once('value', (snapshot) => {
        console.log(snapshot.val());
    });
}
```

**Note:** This is for your **Node.js Server** (`server.js`), NOT for your HTML/Frontend files. Your frontend already uses the Client SDK which is secure for browsers.
