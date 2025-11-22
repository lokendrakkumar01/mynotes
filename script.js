// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const regUsernameInput = document.getElementById('regUsername');
const regEmailInput = document.getElementById('regEmail');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const profileImageInput = document.getElementById('profileImageInput');
const profileUploadBtn = document.getElementById('profileUploadBtn');
const profilePlaceholder = document.getElementById('profilePlaceholder');
const profileImage = document.getElementById('profileImage');
const headerProfilePlaceholder = document.getElementById('headerProfilePlaceholder');
const headerProfileImage = document.getElementById('headerProfileImage');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const contactBtn = document.getElementById('contactBtn');
const themeToggle = document.getElementById('themeToggle');

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const filesGrid = document.getElementById('filesGrid');
const previewModal = document.getElementById('previewModal');
const closePreview = document.getElementById('closePreview');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');
const contactModal = document.getElementById('contactModal');
const closeContact = document.getElementById('closeContact');
const contactForm = document.getElementById('contactForm');

const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// State variables
let currentUser = null;
let users = [];
let files = [];
let currentFilter = 'all';
let currentSearch = '';
let profileImageData = null;
let authToken = localStorage.getItem('authToken') || null;

// API base URL - dynamically set based on current host
const API_BASE_URL = window.location.protocol === 'file:'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.hostname}:3000/api`;

console.log('API Base URL:', API_BASE_URL);

// Initialize the app
function init() {
    // Show diagnostic info
    console.log('=== DIAGNOSTIC INFO ===');
    console.log('1. Current URL:', window.location.href);
    console.log('2. Protocol:', window.location.protocol);
    console.log('3. API will connect to:', API_BASE_URL);
    console.log('======================');

    // Warn if accessing via file://
    if (window.location.protocol === 'file:') {
        console.warn('⚠️ WARNING: You are opening this as a FILE. For best results, access via server (e.g., http://192.168.x.x:3000)');
    }

    checkLoginStatus();
    setupEventListeners();
    loadThemePreference();
    testConnection();

}

// Check if user is already logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showApp();
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            showLogin();
        }
    } else {
        showLogin();
    }
}

// Set up event listeners
function setupEventListeners() {
    // Login/Register forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    registerLink.addEventListener('click', showRegisterForm);
    loginLink.addEventListener('click', showLoginForm);

    // Profile image upload
    profileUploadBtn.addEventListener('click', () => profileImageInput.click());
    profileImageInput.addEventListener('change', handleProfileImageUpload);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Contact
    contactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    closeContact.addEventListener('click', () => contactModal.classList.remove('active'));
    contactForm.addEventListener('submit', handleContactForm);


    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);



    // File upload
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const droppedFiles = e.dataTransfer.files;
        handleFiles(droppedFiles);
    });

    // Search and filter
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderFiles();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderFiles();
        });
    });

    // Preview modal
    closePreview.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    // Close modal when clicking outside
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });

    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });
}

// Show login form
function showLoginForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    resetRegisterForm();
}

// Show register form
function showRegisterForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
}

// Reset register form
function resetRegisterForm() {
    registerForm.reset();
    profileImageData = null;
    profilePlaceholder.style.display = 'flex';
    profileImage.style.display = 'none';
}

// Handle profile image upload
function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', true);
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        profileImageData = e.target.result;
        profilePlaceholder.style.display = 'none';
        profileImage.src = profileImageData;
        profileImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showNotification('Please enter both username and password', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('Login successful, user:', currentUser);
            loadUserFiles();
            console.log('Calling showApp()');
            showApp();
            showNotification(`Welcome back, ${username}!`);
        } else {
            showNotification(data.message || 'Login failed', true);
        }
    } catch (error) {
        console.error('=== LOGIN ERROR DETAILS ===');
        console.error('URL attempted:', `${API_BASE_URL}/auth/login`);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('===========================');

        let errorMsg = `❌ Login failed: ${error.message}`;

        if (error.message.includes('Failed to fetch')) {
            errorMsg = '❌ Cannot reach server!\n\n';
            errorMsg += '🔍 CHECKLIST:\n';
            errorMsg += '1. Is server running? Run: node server.js\n';
            errorMsg += '2. Access via http://IP:3000 (NOT file://)\n';
            errorMsg += '3. Check console (F12) for details';
        }

        showNotification(errorMsg, true);
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    const username = regUsernameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;

    if (!username || !email || !password) {
        showNotification('Please fill in all fields', true);
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                profileImage: profileImageData
            })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('Registration successful, user:', currentUser);
            loadUserFiles();
            console.log('Calling showApp()');
            showApp();
            showNotification(`Account created successfully! Welcome, ${username}!`);
        } else {
            showNotification(data.message || 'Registration failed', true);
        }
    } catch (error) {
        console.error('=== REGISTRATION ERROR DETAILS ===');
        console.error('URL attempted:', `${API_BASE_URL}/auth/register`);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('==================================');

        let errorMsg = `❌ Registration failed: ${error.message}`;

        if (error.message.includes('Failed to fetch')) {
            errorMsg = '❌ Cannot reach server!\n\n';
            errorMsg += '🔍 CHECKLIST:\n';
            errorMsg += '1. Is server running? Run: node server.js\n';
            errorMsg += '2. Access via http://IP:3000 (NOT file://)\n';
            errorMsg += '3. Check console (F12) for details';
        }

        showNotification(errorMsg, true);
    }
}

// Send login email (simulated)
function sendLoginEmail(email, username) {
    // In a real application, this would send an actual email
    console.log(`Login notification sent to: ${email}`);
    console.log(`User: ${username} logged in at ${new Date().toLocaleString()}`);

    // For demo purposes, we'll show a notification
    showNotification(`Login notification sent to ${email}`);
}

// Send registration email (simulated)
function sendRegistrationEmail(email, username) {
    // In a real application, this would send an actual email
    console.log(`Registration notification sent to: ${email}`);
    console.log(`New user registered: ${username} at ${new Date().toLocaleString()}`);

    // For demo purposes, we'll show a notification
    showNotification(`Registration confirmation sent to ${email}`);
}

// Handle logout
function handleLogout() {
    currentUser = null;
    authToken = null;
    files = [];
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    showLogin();
    showNotification('You have been logged out');
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // In a real application, you would send this data to a server
    // For this demo, we'll just show a success message
    showNotification('Thank you for your message! We will get back to you soon.');
    contactModal.classList.remove('active');
    contactForm.reset();
}

// Show login form
function showLogin() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    usernameInput.value = '';
    passwordInput.value = '';
    resetRegisterForm();
}

// Show main app
function showApp() {
    console.log('Inside showApp()');
    try {
        if (!currentUser) {
            console.error('currentUser is null in showApp');
            showLogin();
            return;
        }

        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';

        // Update user info
        userName.textContent = currentUser.username;
        userEmail.textContent = currentUser.email;

        // Update profile image
        if (currentUser.profileImage) {
            headerProfilePlaceholder.style.display = 'none';
            headerProfileImage.src = currentUser.profileImage;
            headerProfileImage.style.display = 'block';
        } else {
            headerProfilePlaceholder.style.display = 'flex';
            headerProfileImage.style.display = 'none';
            headerProfilePlaceholder.innerHTML = `<i class="fas fa-user"></i>`;
        }

        renderFiles();
        console.log('showApp completed successfully');
    } catch (error) {
        console.error('Error in showApp:', error);
        showNotification('Error loading application interface', true);
    }
}

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Handle file upload via input
function handleFileUpload(e) {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
    fileInput.value = ''; // Reset input
}

// Process uploaded files
async function handleFiles(fileList) {
    if (fileList.length === 0) return;

    progressContainer.style.display = 'block';
    let uploadedCount = 0;

    for (const file of fileList) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (response.ok) {
                uploadedCount++;
            } else {
                const errorData = await response.json();
                console.error('Upload failed for', file.name, errorData);
                showNotification(`Failed to upload ${file.name}`, true);
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification(`Failed to upload ${file.name}`, true);
        }
    }

    setTimeout(() => {
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = 'Uploading...';
        if (uploadedCount > 0) {
            showNotification(`${uploadedCount} file(s) uploaded successfully!`);
            loadUserFiles(); // Reload files from server to sync state
        }
    }, 500);
}



// Get file type category
function getFileType(file) {
    const mimeType = file.type;
    const fileName = file.name.toLowerCase();
    if (mimeType.startsWith('image/')) return 'img';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'text/plain') return 'txt';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'doc';
    if (mimeType.startsWith('video/') || fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov') || fileName.endsWith('.wmv') || fileName.endsWith('.mkv') || fileName.endsWith('.webm')) return 'video';
    return 'other';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Save files to localStorage
function saveFilesToStorage() {
    localStorage.setItem('notesFiles', JSON.stringify(files));
}

// Render files based on current filter and search
function renderFiles() {
    filesGrid.innerHTML = '';

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(currentSearch);
        const matchesFilter = currentFilter === 'all' || file.type === currentFilter;
        return matchesSearch && matchesFilter;
    });

    if (filteredFiles.length === 0) {
        filesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No files found</h3>
                <p>${currentSearch || currentFilter !== 'all' ? 'Try adjusting your search or filter' : 'Upload your first file to get started'}</p>
            </div>
        `;
        return;
    }

    filteredFiles.forEach(file => {
        const fileCard = createFileCard(file);
        filesGrid.appendChild(fileCard);
    });
}

// Create file card element
function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.dataset.id = file.id;

    const fileIconClass = getFileIconClass(file.type);

    card.innerHTML = `
        <div class="file-header">
            <div class="file-icon ${file.type}">
                <i class="${fileIconClass}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span>${file.size} • ${file.uploadDate}</span>
                    <span class="file-uploader">Uploaded by: ${file.uploader}</span>
                </div>
            </div>
        </div>
        <div class="file-actions">
            <button class="action-btn preview-btn" data-id="${file.id}">
                <i class="fas fa-eye"></i> Preview
            </button>
            <button class="action-btn download-btn" data-id="${file.id}">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="action-btn share-btn" data-id="${file.id}">
                <i class="fas fa-share"></i> Share
            </button>
            ${file.uploader === currentUser.username ? `
            <button class="action-btn rename-btn" data-id="${file.id}" title="Rename file" aria-label="Rename file">
                <i class="fas fa-edit"></i> Rename
            </button>
            <button class="action-btn delete-btn" data-id="${file.id}" title="Delete file" aria-label="Delete file">
                <i class="fas fa-trash"></i> Delete
            </button>
            ` : ''}
        </div>
    `;

    // Add event listeners to buttons
    const previewBtn = card.querySelector('.preview-btn');
    const downloadBtn = card.querySelector('.download-btn');
    const shareBtn = card.querySelector('.share-btn');
    const renameBtn = card.querySelector('.rename-btn');
    const deleteBtn = card.querySelector('.delete-btn');

    previewBtn.addEventListener('click', () => previewFile(file));
    downloadBtn.addEventListener('click', () => downloadFile(file));

    if (shareBtn) {
        shareBtn.addEventListener('click', () => shareFile(file));
    }

    if (renameBtn) {
        renameBtn.addEventListener('click', () => renameFile(file.id));
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteFile(file.id));
    }

    return card;
}

// Get appropriate icon for file type
function getFileIconClass(type) {
    switch (type) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'doc': return 'fas fa-file-word';
        case 'txt': return 'fas fa-file-alt';
        case 'img': return 'fas fa-file-image';
        case 'video': return 'fas fa-file-video';
        default: return 'fas fa-file';
    }
}

// Preview file content
function previewFile(file) {
    previewTitle.textContent = `Preview: ${file.name}`;
    previewBody.innerHTML = '';

    const inlineUrl = file.content + '?inline=true';

    if (file.type === 'img') {
        const img = document.createElement('img');
        img.src = inlineUrl;
        img.alt = file.name;
        img.className = 'preview-image';
        previewBody.appendChild(img);
    } else if (file.type === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = inlineUrl;
        iframe.width = '100%';
        iframe.height = '500px';
        previewBody.appendChild(iframe);
    } else if (file.type === 'video') {
        const video = document.createElement('video');
        video.src = inlineUrl;
        video.controls = true;
        video.width = '100%';
        video.height = '400';
        video.className = 'preview-video';
        previewBody.appendChild(video);
    } else if (file.type === 'txt') {
        // For text files, we would need to decode the base64 content
        // In a real app, we would use the FileReader API to read text content
        const text = document.createElement('div');
        text.className = 'preview-text';
        text.textContent = 'Text preview not implemented in this demo. In a real application, this would show the text content of the file.';
        previewBody.appendChild(text);
    } else {
        const message = document.createElement('div');
        message.className = 'preview-text';
        message.textContent = 'Preview not available for this file type.';
        previewBody.appendChild(message);
    }

    previewModal.classList.add('active');
}

// Download file
function downloadFile(file) {
    const a = document.createElement('a');
    a.href = file.content;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification(`Downloaded ${file.name}`);
}

// Rename file
async function renameFile(fileId) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const newName = prompt('Enter new file name:', file.name);
    if (newName && newName.trim() !== '' && newName.trim() !== file.name) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}/rename`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ newName: newName.trim() })
            });

            if (response.ok) {
                file.name = newName.trim();
                renderFiles();
                showNotification('File renamed successfully');
            } else {
                const error = await response.json();
                showNotification(error.message || 'Failed to rename file', true);
            }
        } catch (error) {
            console.error('Rename error:', error);
            showNotification('Failed to rename file', true);
        }
    }
}

// Share file
function shareFile(file) {
    const shareUrl = window.location.origin + '/share?file=' + encodeURIComponent(file.id);

    if (navigator.share) {
        navigator.share({
            title: file.name,
            text: `Check out this file: ${file.name}`,
            url: shareUrl
        }).then(() => {
            showNotification('File shared successfully');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(shareUrl);
        });
    } else {
        fallbackShare(shareUrl);
    }
}

// Fallback share method
function fallbackShare(shareUrl) {
    navigator.clipboard.writeText(shareUrl).then(() => {
        showNotification('Share link copied to clipboard');
    }).catch(() => {
        showNotification('Share link: ' + shareUrl);
    });
}

// Delete file
async function deleteFile(fileId) {
    if (confirm('Are you sure you want to delete this file?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                files = files.filter(f => f.id !== fileId);
                renderFiles();
                showNotification('File deleted successfully');
            } else {
                const error = await response.json();
                showNotification(error.message || 'Failed to delete file', true);
            }
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Failed to delete file', true);
        }
    }
}

// Show notification
function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.classList.remove('error');

    if (isError) {
        notification.classList.add('error');
        notification.querySelector('i').className = 'fas fa-exclamation-circle';
    } else {
        notification.querySelector('i').className = 'fas fa-check-circle';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load user files from server
async function loadUserFiles() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_BASE_URL}/files`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            files = data.files.map(file => ({
                id: file._id,
                name: file.name,
                type: file.type,
                size: formatFileSize(file.size),
                content: `${API_BASE_URL}/files/${file._id}/download`,
                uploadDate: new Date(file.uploadDate).toLocaleDateString(),
                uploader: file.uploader,
                uploaderEmail: file.uploaderEmail
            }));
            renderFiles();
        } else {
            console.error('Failed to load files');
            showNotification('Failed to load your files. Please try refreshing.', true);
        }
    } catch (error) {
        console.error('Error loading files:', error);
    }
}





// Test server connection
async function testConnection() {
    try {
        console.log(`Testing connection to ${API_BASE_URL}...`);
        // Try to fetch the root URL (remove /api)
        const serverUrl = API_BASE_URL.replace('/api', '');
        const response = await fetch(serverUrl + '/');

        if (response.ok) {
            console.log('Server connection successful');
        } else {
            console.warn('Server reachable but returned status:', response.status);
        }
    } catch (error) {
        console.error('Server connection failed:', error);
        showNotification(`Cannot connect to server at ${API_BASE_URL}. Is "node server.js" running? Error: ${error.message}`, true);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
