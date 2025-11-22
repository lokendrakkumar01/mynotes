// DOM Elements
const loader = document.getElementById('loader');
const connectionStatus = document.getElementById('connectionStatus');
const connectionText = document.getElementById('connectionText');
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

// State
let currentUser = null;
let files = [];
let currentFilter = 'all';
let currentSearch = '';
let profileImageData = null;
let authToken = localStorage.getItem('authToken') || null;

// Detect if running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

// API URL
const API_BASE_URL = isGitHubPages
    ? null // No backend on GitHub Pages
    : (window.location.protocol === 'file:'
        ? 'http://localhost:3000/api'
        : `${window.location.protocol}//${window.location.hostname}:3000/api`);

console.log('Environment:', isGitHubPages ? 'GitHub Pages' : 'Local');
console.log('API Base URL:', API_BASE_URL || 'N/A');

// Initialize
function init() {
    console.log('Initializing app...');

    // Check if on GitHub Pages
    if (isGitHubPages) {
        showGitHubPagesMessage();
        hideLoader();
        return;
    }

    setupEventListeners();
    loadThemePreference();
    checkLoginStatus();
    testConnection();
    hideLoader();
}

function showGitHubPagesMessage() {
    if (loader) loader.style.display = 'none';
    if (connectionStatus) connectionStatus.style.display = 'none';

    if (loginContainer) {
        loginContainer.innerHTML = `
            <div class="login-form" style="max-width: 600px; text-align: center; padding: 30px;">
                <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                <h2 style="color: #ef4444; margin-bottom: 20px;">
                    GitHub Pages - Demo Only
                </h2>
                
                <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: left;">
                    <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
                        <strong>यह application को चलाने के लिए backend server की जरूरत है।</strong>
                    </p>
                    <p style="margin-bottom: 0; font-size: 14px; color: #991b1b;">
                        GitHub Pages सिर्फ static files host कर सकता है - Node.js server नहीं चला सकता।
                    </p>
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: left;">
                    <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">
                        📱 Locally कैसे चलाएं:
                    </h3>
                    <ol style="margin-left: 20px; line-height: 1.8; font-size: 14px;">
                        <li>Repository clone करें</li>
                        <li><code style="background: white; padding: 3px 8px; border-radius: 4px;">npm install</code> चलाएं</li>
                        <li><code style="background: white; padding: 3px 8px; border-radius: 4px;">node server.js</code> चलाएं</li>
                        <li>Browser में <code style="background: white; padding: 3px 8px; border-radius: 4px;">localhost:3000</code> खोलें</li>
                    </ol>
                </div>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #166534; font-size: 14px;">
                        💡 <strong>Full features के लिए:</strong><br>
                        Computer पर locally run करें
                    </p>
                </div>
                
                <a href="https://github.com/lokendrakkumar01/mynotes" 
                   class="btn btn-primary" 
                   target="_blank"
                   style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px;">
                    <i class="fab fa-github"></i> GitHub Repository
                </a>
                
                <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
                    इस page को computer पर खोलें और locally run करें।
                </p>
            </div>
        `;
        loginContainer.style.display = 'flex';
    }

    // Also hide app container completely
    if (appContainer) appContainer.style.display = 'none';
}

function hideLoader() {
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 1000);
}

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

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    registerLink.addEventListener('click', showRegisterForm);
    loginLink.addEventListener('click', showLoginForm);
    profileUploadBtn.addEventListener('click', () => profileImageInput.click());
    profileImageInput.addEventListener('change', handleProfileImageUpload);
    logoutBtn.addEventListener('click', handleLogout);
    contactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    closeContact.addEventListener('click', () => contactModal.classList.remove('active'));
    contactForm.addEventListener('submit', handleContactForm);
    themeToggle.addEventListener('click', toggleTheme);
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);

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
        handleFiles(e.dataTransfer.files);
    });

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

    closePreview.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

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

function showLoginForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    resetRegisterForm();
}

function showRegisterForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
}

function resetRegisterForm() {
    registerForm.reset();
    profileImageData = null;
    profilePlaceholder.style.display = 'flex';
    profileImage.style.display = 'none';
}

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

async function handleLogin(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showNotification('Please enter username and password', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loadUserFiles();
            showApp();
            showNotification(`Welcome back, ${username}!`);
        } else {
            showNotification(data.message || 'Login failed', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Cannot connect to server. Make sure it is running!', true);
    }
}

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, profileImage: profileImageData })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loadUserFiles();
            showApp();
            showNotification(`Account created! Welcome, ${username}!`);
        } else {
            showNotification(data.message || 'Registration failed', true);
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Cannot connect to server. Make sure it is running!', true);
    }
}

function handleLogout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    files = [];
    showLogin();
    showNotification('You have been logged out');
}

function handleContactForm(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We will get back to you soon.');
    contactModal.classList.remove('active');
    contactForm.reset();
}

function showLogin() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    usernameInput.value = '';
    passwordInput.value = '';
    resetRegisterForm();
}

function showApp() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';

    userName.textContent = currentUser.username;
    userEmail.textContent = currentUser.email;

    if (currentUser.profileImage) {
        headerProfilePlaceholder.style.display = 'none';
        headerProfileImage.src = currentUser.profileImage;
        headerProfileImage.style.display = 'block';
    } else {
        headerProfilePlaceholder.style.display = 'flex';
        headerProfileImage.style.display = 'none';
    }

    renderFiles();
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function handleFileUpload(e) {
    handleFiles(e.target.files);
    fileInput.value = '';
}

async function handleFiles(fileList) {
    if (fileList.length === 0) return;

    const formData = new FormData();
    Array.from(fileList).forEach(file => {
        formData.append('files', file);
    });

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    try {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Uploading... ${Math.round(percentComplete)}%`;
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 201) {
                loadUserFiles();
                showNotification(`${fileList.length} file(s) uploaded successfully!`);
            } else {
                showNotification('Upload failed', true);
            }
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
            }, 1000);
        });

        xhr.addEventListener('error', () => {
            showNotification('Upload failed', true);
            progressContainer.style.display = 'none';
        });

        xhr.open('POST', `${API_BASE_URL}/files/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Upload failed', true);
        progressContainer.style.display = 'none';
    }
}

async function loadUserFiles() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_BASE_URL}/files`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
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
        }
    } catch (error) {
        console.error('Load files error:', error);
    }
}

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

function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';

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
                    <span class="file-uploader">By: ${file.uploader}</span>
                </div>
            </div>
        </div>
        <div class="file-actions">
            <button class="action-btn preview-btn">
                <i class="fas fa-eye"></i> Preview
            </button>
            <button class="action-btn download-btn">
                <i class="fas fa-download"></i> Download
            </button>
            <button class="action-btn delete-btn">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    card.querySelector('.preview-btn').addEventListener('click', () => previewFile(file));
    card.querySelector('.download-btn').addEventListener('click', () => downloadFile(file));
    card.querySelector('.delete-btn').addEventListener('click', () => deleteFile(file.id));

    return card;
}

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

function previewFile(file) {
    previewTitle.textContent = `Preview: ${file.name}`;
    previewBody.innerHTML = '';

    if (file.type === 'img') {
        const img = document.createElement('img');
        img.src = file.content;
        img.alt = file.name;
        img.className = 'preview-image';
        previewBody.appendChild(img);
    } else if (file.type === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = file.content;
        iframe.width = '100%';
        iframe.height = '500px';
        previewBody.appendChild(iframe);
    } else if (file.type === 'video') {
        const video = document.createElement('video');
        video.src = file.content;
        video.controls = true;
        video.className = 'preview-video';
        previewBody.appendChild(video);
    } else {
        const message = document.createElement('div');
        message.className = 'preview-text';
        message.textContent = 'Preview not available for this file type.';
        previewBody.appendChild(message);
    }

    previewModal.classList.add('active');
}

function downloadFile(file) {
    const a = document.createElement('a');
    a.href = file.content;
    a.download = file.name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification(`Downloading ${file.name}`);
}

async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            files = files.filter(f => f.id !== fileId);
            renderFiles();
            showNotification('File deleted successfully');
        } else {
            showNotification('Failed to delete file', true);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete file', true);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

function updateConnectionStatus(status, message) {
    if (!connectionStatus || !connectionText) return;

    connectionStatus.className = 'connection-status ' + status;
    connectionText.textContent = message;

    const icon = connectionStatus.querySelector('i');
    if (icon) {
        switch (status) {
            case 'connected':
                icon.className = 'fas fa-check-circle';
                break;
            case 'disconnected':
                icon.className = 'fas fa-exclamation-triangle';
                break;
            case 'warning':
                icon.className = 'fas fa-info-circle';
                break;
            default:
                icon.className = 'fas fa-wifi';
        }
    }

    if (status === 'connected') {
        setTimeout(() => {
            connectionStatus.style.opacity = '0';
            setTimeout(() => {
                connectionStatus.style.display = 'none';
            }, 300);
        }, 3000);
    }
}

async function testConnection() {
    updateConnectionStatus('connecting', 'Connecting...');

    try {
        const serverUrl = API_BASE_URL.replace('/api', '');
        const response = await fetch(serverUrl + '/health');

        if (response.ok) {
            console.log('✅ Server connected');
            updateConnectionStatus('connected', 'Connected');
        } else {
            console.warn('⚠️ Server status:', response.status);
            updateConnectionStatus('warning', 'Server issue');
        }
    } catch (error) {
        console.error('❌ Connection failed:', error);
        updateConnectionStatus('disconnected', 'Cannot connect');
        showNotification('Cannot connect to server!', true);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
