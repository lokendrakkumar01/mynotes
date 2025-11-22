# 📝 Notes Manager - UA ACADEMY

A modern, full-stack notes and document management system with user authentication and file upload capabilities.

![Notes Manager](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration with JWT tokens
- 📁 **File Upload** - Upload and manage documents, images, PDFs, and more
- 👤 **User Profiles** - Custom profile pictures and user information
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 🔍 **Search & Filter** - Easy file organization and discovery
- 📱 **Responsive Design** - Works on all devices
- 🌐 **Network Access** - Access from any device on your local network

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/mynotes.git
   cd mynotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open in browser**
   - Local: `http://localhost:3000`
   - Network: `http://[your-ip]:3000` (shown in console)

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5"
}
```

## 🖥️ Usage

### Register a New Account
1. Click "Register here" on the login page
2. Fill in username, email, and password
3. Optionally upload a profile picture
4. Click "Create Account"

### Upload Files
1. Log in to your account
2. Click the upload area or drag & drop files
3. Files are saved securely on the server
4. View, download, or delete your files anytime

### Access from Other Devices
1. Make sure both devices are on the same WiFi network
2. Check the server console for the Network IP address
3. On another device, open `http://[network-ip]:3000`

## 📂 Project Structure

```
mynotes/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Frontend logic
├── server.js           # Backend server
├── package.json        # Dependencies
├── data.json           # User database (auto-created)
├── uploads/            # Uploaded files (auto-created)
└── README.md           # This file
```

## ⚠️ Important Notes

### GitHub Pages Limitation
**This application CANNOT run on GitHub Pages** because:
- GitHub Pages only hosts static files (HTML, CSS, JS)
- This app requires a Node.js backend server for:
  - User authentication
  - File storage
  - Database operations

**To demo this project:** Clone and run locally as described above.

### Security
- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Files are stored with unique identifiers

## 🔧 Configuration

### Change Server Port
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your port
```

### Change JWT Secret
Create a `.env` file:
```
JWT_SECRET=your-super-secret-key-here
```

## 🌐 Network Access Guide

### Windows Firewall
If other devices can't connect:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find Node.js and check both Private and Public
4. Or run: `netsh advfirewall firewall add rule name="Node.js" dir=in action=allow protocol=TCP localport=3000`

### Find Your IP Address
**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

## 🐛 Troubleshooting

### "Cannot connect to server"
- Make sure server is running (`node server.js`)
- Check if port 3000 is available
- Verify firewall settings

### "Loading Notes Manager" stuck
- Make sure you're accessing via `http://` not `file://`
- Clear browser cache
- Check browser console for errors

### "Permission denied" on Linux/Mac
```bash
sudo node server.js
```
Or change port to > 1024

## 📝 TODO / Future Features

- [ ] Email notifications
- [ ] File sharing between users
- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**UA ACADEMY**
- GitHub: [@lokendrakkumar01](https://github.com/lokendrakkumar01)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- All contributors and testers

---

**⭐ If you find this project helpful, please give it a star!**
