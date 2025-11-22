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
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const regEmailInput = document.getElementById('regEmail');
const regPasswordInput = document.getElementById('regPassword');
const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const headerProfileImage = document.getElementById('headerProfileImage');
const headerProfilePlaceholder = document.getElementById('headerProfilePlaceholder');
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

// Initialize
function init() {
    console.log('Initializing Firebase Notes Manager...');
    setupEventListeners();
    loadThemePreference();

    // Check Firebase auth state
    auth.onAuthStateChanged((user) => {
        hideLoader();
        if (user) {
            currentUser = user;
            showApp();
            loadUserFiles();
            updateConnectionStatus('connected', 'Connected to Firebase');
        } else {
            showLogin();
            updateConnectionStatus('disconnected', 'Not logged in');
        }
    });
}

function hideLoader() {
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 500);
}

function setupEventListeners() {
    // Auth
    loginForm.addEventListener('submit', handleEmailLogin);
    registerForm.addEventListener('submit', handleEmailRegister);
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
    googleSignupBtn.addEventListener('click', handleGoogleLogin);
    registerLink.addEventListener('click', showRegisterForm);
    loginLink.addEventListener('click', showLoginForm);
    logoutBtn.addEventListener('click', handleLogout);

    // Contact
    contactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    closeContact.addEventListener('click', () => contactModal.classList.remove('active'));
    contactForm.addEventListener('submit', handleContactForm);

    // Theme
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
        handleFiles(e.dataTransfer.files);
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

    // Modals
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

// Authentication Functions
async function handleGoogleLogin() {
    try {
        updateConnectionStatus('connecting', 'Signing in with Google...');
        await auth.signInWithPopup(googleProvider);
        showNotification('Welcome! Signed in with Google');
    } catch (error) {
        console.error('Google login error:', error);
        showNotification('Google login failed: ' + error.message, true);
        updateConnectionStatus('disconnected', 'Sign in failed');
    }
}

async function handleEmailLogin(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showNotification('Please enter email and password', true);
        return;
    }

    try {
        updateConnectionStatus('connecting', 'Signing in...');
        await auth.signInWithEmailAndPassword(email, password);
        showNotification('Welcome back!');
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed: ' + error.message, true);
        updateConnectionStatus('disconnected', 'Login failed');
    }
}

async function handleEmailRegister(e) {
    e.preventDefault();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;

    if (!email || !password) {
        showNotification('Please fill in all fields', true);
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', true);
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', true);
        return;
    }

    try {
        updateConnectionStatus('connecting', 'Creating account...');
        await auth.createUserWithEmailAndPassword(email, password);
        showNotification('Account created successfully!');
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Registration failed: ' + error.message, true);
        updateConnectionStatus('disconnected', 'Registration failed');
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        files = [];
        showNotification('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed', true);
    }
}

// UI Functions
function showLoginForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    emailInput.value = '';
    passwordInput.value = '';
}

function showRegisterForm(e) {
    e.preventDefault();
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
    regEmailInput.value = '';
    regPasswordInput.value = '';
    regConfirmPasswordInput.value = '';
}

function showLogin() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
}

function showApp() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';

    if (currentUser) {
        userName.textContent = currentUser.displayName || currentUser.email.split('@')[0];
        userEmail.textContent = currentUser.email;

        if (currentUser.photoURL) {
            headerProfilePlaceholder.style.display = 'none';
            headerProfileImage.src = currentUser.photoURL;
            headerProfileImage.style.display = 'block';
        } else {
            headerProfilePlaceholder.style.display = 'flex';
            headerProfileImage.style.display = 'none';
        }
    }

    renderFiles();
}

// File Operations
function handleFileUpload(e) {
    handleFiles(e.target.files);
    fileInput.value = '';
}

async function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    if (!currentUser) {
        showNotification('Please login first', true);
        return;
    }

    progressContainer.style.display = 'block';
    const totalFiles = fileList.length;
    let uploadedFiles = 0;

    for (const file of fileList) {
        try {
            const fileRef = storage.ref(`users/${currentUser.uid}/files/${Date.now()}_${file.name}`);
            const uploadTask = fileRef.put(file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.style.width = progress + '%';
                    progressText.textContent = `Uploading ${file.name}... ${Math.round(progress)}%`;
                },
                (error) => {
                    console.error('Upload error:', error);
                    showNotification(`Failed to upload ${file.name}`, true);
                },
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

                    // Save metadata to Firestore
                    await db.collection('files').add({
                        name: file.name,
                        url: downloadURL,
                        size: file.size,
                        type: getFileType(file.type),
                        mimetype: file.type,
                        userId: currentUser.uid,
                        userEmail: currentUser.email,
                        uploadDate: firebase.firestore.FieldValue.serverTimestamp()
                    });

                    uploadedFiles++;
                    if (uploadedFiles === totalFiles) {
                        progressContainer.style.display = 'none';
                        progressBar.style.width = '0%';
                        showNotification(`${totalFiles} file(s) uploaded successfully!`);
                        loadUserFiles();
                    }
                }
            );
        } catch (error) {
            console.error('File upload error:', error);
            showNotification('Upload failed', true);
        }
    }
}

async function loadUserFiles() {
    if (!currentUser) return;

    try {
        const snapshot = await db.collection('files')
            .where('userId', '==', currentUser.uid)
            .orderBy('uploadDate', 'desc')
            .get();

        files = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            size: formatFileSize(doc.data().size),
            uploadDate: doc.data().uploadDate ? doc.data().uploadDate.toDate().toLocaleDateString() : 'Unknown'
        }));

        renderFiles();
    } catch (error) {
        console.error('Error loading files:', error);
        showNotification('Failed to load files', true);
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
                <i class="fas fa-cloud"></i>
                <h3>No files found</h3>
                <p>${currentSearch || currentFilter !== 'all' ? 'Try adjusting your search or filter' : 'Upload your first file to cloud storage'}</p>
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
                    <span class="file-uploader"><i class="fas fa-cloud"></i> Cloud Storage</span>
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

function previewFile(file) {
    previewTitle.textContent = `Preview: ${file.name}`;
    previewBody.innerHTML = '';

    if (file.type === 'img') {
        const img = document.createElement('img');
        img.src = file.url;
        img.alt = file.name;
        img.className = 'preview-image';
        previewBody.appendChild(img);
    } else if (file.type === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = file.url;
        iframe.width = '100%';
        iframe.height = '500px';
        previewBody.appendChild(iframe);
    } else if (file.type === 'video') {
        const video = document.createElement('video');
        video.src = file.url;
        video.controls = true;
        video.className = 'preview-video';
        previewBody.appendChild(video);
    } else {
        const message = document.createElement('div');
        message.className = 'preview-text';
        message.textContent = 'Preview not available. Click download to view this file.';
        previewBody.appendChild(message);
    }

    previewModal.classList.add('active');
}

function downloadFile(file) {
    const a = document.createElement('a');
    a.href = file.url;
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
        await db.collection('files').doc(fileId).delete();
        files = files.filter(f => f.id !== fileId);
        renderFiles();
        showNotification('File deleted successfully');
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete file', true);
    }
}

// Helper Functions
function getFileType(mimetype) {
    if (mimetype.startsWith('image/')) return 'img';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype === 'text/plain') return 'txt';
    if (mimetype.includes('document') || mimetype.includes('word')) return 'doc';
    if (mimetype.startsWith('video/')) return 'video';
    return 'other';
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

function handleContactForm(e) {
    e.preventDefault();
    showNotification('Thank you! Message sent successfully.');
    contactModal.classList.remove('active');
    contactForm.reset();
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
            case 'connecting':
                icon.className = 'fas fa-sync fa-spin';
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
