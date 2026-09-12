// MyNotes Platform Core JavaScript Engine
// Supports Dual Mode: Firebase Cloud Storage (GitHub Pages & Live Web) + Node.js Express REST API

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
const googleLoginBtn = document.getElementById('googleLoginBtn');
const guestBtn = document.getElementById('guestBtn');

const headerProfilePlaceholder = document.getElementById('headerProfilePlaceholder');
const headerProfileImage = document.getElementById('headerProfileImage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const contactBtn = document.getElementById('contactBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Upload Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const noteTitle = document.getElementById('noteTitle');
const noteSubject = document.getElementById('noteSubject');
const noteCourse = document.getElementById('noteCourse');
const noteSemester = document.getElementById('noteSemester');
const noteDescription = document.getElementById('noteDescription');
const selectedFilesBar = document.getElementById('selectedFilesBar');
const selectedFilesCount = document.getElementById('selectedFilesCount');
const startUploadBtn = document.getElementById('startUploadBtn');
const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Search & Filter Elements
const searchInput = document.getElementById('searchInput');
const typeFilterButtons = document.querySelectorAll('#typeFilterButtons .filter-btn');
const subjectFilter = document.getElementById('subjectFilter');
const semesterFilter = document.getElementById('semesterFilter');
const sortBySelect = document.getElementById('sortBySelect');
const filesGrid = document.getElementById('filesGrid');
const notesCount = document.getElementById('notesCount');

// Modals
const previewModal = document.getElementById('previewModal');
const closePreview = document.getElementById('closePreview');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteConfirmText = document.getElementById('deleteConfirmText');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const contactModal = document.getElementById('contactModal');
const closeContact = document.getElementById('closeContact');
const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const notificationIcon = document.getElementById('notificationIcon');

// Application State
let currentUser = null;
let notesFeed = [];
let pendingFiles = [];
let activeTypeFilter = 'all';
let activeSubjectFilter = 'all';
let activeSemesterFilter = 'all';
let activeSearchQuery = '';
let activeSort = 'newest';
let pendingDeleteId = null;
let activePreviewNote = null;
let authToken = localStorage.getItem('authToken') || null;

// Determine Backend Provider Mode
const isGitHubPages = window.location.hostname.includes('github.io');
const isFirebaseAvailable = (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0);

const API_BASE_URL = (window.location.protocol === 'file:'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.hostname}:3000/api`);

console.log('MyNotes Platform Initializing...');
console.log('Environment:', isGitHubPages ? 'GitHub Pages' : 'Local / Custom Server');
console.log('Cloud Provider:', isFirebaseAvailable ? 'Firebase Enabled' : 'Local Node API');

// Initialize Application
function init() {
    setupEventListeners();
    loadThemePreference();
    checkAuthSession();
    loadSharedNotesFeed();
    hideLoader();
}

function hideLoader() {
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 300);
        }
    }, 400);
}

// Authentication Session Manager
function checkAuthSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showAppView();
        } catch (e) {
            showLoginView();
        }
    } else {
        // Default to Guest Student browsing mode so students aren't blocked from notes
        currentUser = { id: 'guest-' + Date.now(), username: 'Guest Student', email: 'student@mynotes.edu', isGuest: true };
        showAppView();
    }
}

function setupEventListeners() {
    // Auth listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    registerLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
    loginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
    if (guestBtn) guestBtn.addEventListener('click', handleGuestAccess);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Profile upload
    if (profileUploadBtn) profileUploadBtn.addEventListener('click', () => profileImageInput.click());
    if (profileImageInput) profileImageInput.addEventListener('change', handleProfilePhotoSelected);

    // Theme & Contact
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (contactBtn) contactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    if (closeContact) closeContact.addEventListener('click', () => contactModal.classList.remove('active'));
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    // Upload Dropzone listeners
    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFilesSelected(e.dataTransfer.files);
        });
    }

    if (fileInput) fileInput.addEventListener('change', (e) => handleFilesSelected(e.target.files));
    if (startUploadBtn) startUploadBtn.addEventListener('click', processFileUploads);
    if (cancelSelectionBtn) cancelSelectionBtn.addEventListener('click', clearPendingSelection);

    // Search, Filter & Sort listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeSearchQuery = e.target.value.toLowerCase().trim();
            renderNotesFeed();
        });
    }

    typeFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeTypeFilter = btn.dataset.filter;
            renderNotesFeed();
        });
    });

    if (subjectFilter) subjectFilter.addEventListener('change', (e) => { activeSubjectFilter = e.target.value; renderNotesFeed(); });
    if (semesterFilter) semesterFilter.addEventListener('change', (e) => { activeSemesterFilter = e.target.value; renderNotesFeed(); });
    if (sortBySelect) sortBySelect.addEventListener('change', (e) => { activeSort = e.target.value; renderNotesFeed(); });

    // Modals
    if (closePreview) closePreview.addEventListener('click', () => previewModal.classList.remove('active'));
    if (previewModal) previewModal.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.classList.remove('active'); });
    if (modalDownloadBtn) modalDownloadBtn.addEventListener('click', () => { if (activePreviewNote) downloadNoteFile(activePreviewNote); });

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.classList.remove('active'));
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', executeNoteDeletion);
}

// Authentication Handlers
function showLoginForm() {
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
}

function showRegisterForm() {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
}

function handleGuestAccess() {
    currentUser = { id: 'guest-' + Date.now(), username: 'Guest Student', email: 'student@mynotes.edu', isGuest: true };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showAppView();
    showNotification('Welcome! Browsing shared notes as Guest Student.');
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
            showAppView();
            showNotification(`Welcome back, ${currentUser.username}!`);
        } else {
            showNotification(data.message || 'Login failed', true);
        }
    } catch (err) {
        // Fallback local login for offline/guest
        currentUser = { id: 'user-' + Date.now(), username, email: `${username}@mynotes.edu` };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAppView();
        showNotification(`Logged in as ${username}`);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = regUsernameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = regConfirmPasswordInput.value;

    if (!username || !email || !password) {
        showNotification('Please fill in all required fields', true);
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
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showAppView();
            showNotification(`Account created! Welcome, ${username}!`);
        } else {
            showNotification(data.message || 'Registration failed', true);
        }
    } catch (err) {
        currentUser = { id: 'user-' + Date.now(), username, email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAppView();
        showNotification(`Welcome to MyNotes, ${username}!`);
    }
}

function handleLogout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    showLoginView();
    showNotification('Logged out successfully');
}

function handleProfilePhotoSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        profilePlaceholder.style.display = 'none';
        profileImage.src = evt.target.result;
        profileImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function showLoginView() {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}

function showAppView() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';

    if (currentUser) {
        userName.textContent = currentUser.username;
        userEmail.textContent = currentUser.email;
    }
    renderNotesFeed();
}

// File Selection & Upload System
function handleFilesSelected(fileList) {
    if (!fileList || fileList.length === 0) return;

    const validFiles = Array.from(fileList).filter(file => {
        if (file.size > 50 * 1024 * 1024) {
            showNotification(`File ${file.name} exceeds 50MB limit`, true);
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    pendingFiles = validFiles;
    selectedFilesCount.textContent = `${pendingFiles.length} file(s) selected for upload`;
    selectedFilesBar.style.display = 'flex';

    if (!noteTitle.value) {
        noteTitle.value = pendingFiles[0].name.replace(/\.[^/.]+$/, "");
    }
}

function clearPendingSelection() {
    pendingFiles = [];
    fileInput.value = '';
    selectedFilesBar.style.display = 'none';
}

async function processFileUploads() {
    if (pendingFiles.length === 0) return;

    const title = noteTitle.value.trim() || pendingFiles[0].name;
    const subject = noteSubject.value;
    const course = noteCourse.value;
    const semester = noteSemester.value;
    const description = noteDescription.value.trim();

    progressContainer.style.display = 'block';
    progressBar.style.width = '10%';
    progressText.textContent = 'Uploading notes to shared storage...';

    if (isFirebaseAvailable) {
        // Firebase Cloud Storage & Firestore Integration for Live Shared Platform
        try {
            const storageRef = firebase.storage().ref();
            const dbRef = firebase.firestore().collection('notes');
            let completed = 0;

            for (const file of pendingFiles) {
                const fileRef = storageRef.child(`shared_notes/${Date.now()}_${file.name}`);
                const uploadTask = fileRef.put(file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        progressBar.style.width = `${percent}%`;
                    },
                    (error) => {
                        console.error('Firebase upload error:', error);
                        showNotification('Upload failed: ' + error.message, true);
                        progressContainer.style.display = 'none';
                    },
                    async () => {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        const noteRecord = {
                            title: title,
                            name: file.name,
                            url: downloadURL,
                            type: getFileTypeCategory(file.type, file.name),
                            mimetype: file.type || 'application/octet-stream',
                            size: file.size,
                            subject: subject,
                            course: course,
                            semester: semester,
                            description: description,
                            uploader: currentUser ? currentUser.username : 'Student',
                            uploaderId: currentUser ? currentUser.id : 'anonymous',
                            downloadCount: 0,
                            uploadDate: firebase.firestore.FieldValue.serverTimestamp()
                        };

                        await dbRef.add(noteRecord);
                        completed++;
                        if (completed === pendingFiles.length) {
                            progressContainer.style.display = 'none';
                            clearPendingSelection();
                            resetUploadForm();
                            showNotification('Notes uploaded to shared storage!');
                            loadSharedNotesFeed();
                        }
                    }
                );
            }
        } catch (err) {
            console.error('Cloud upload error:', err);
            fallbackLocalUpload(title, subject, course, semester, description);
        }
    } else {
        // Local Node Server Upload API
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subject', subject);
        formData.append('course', course);
        formData.append('semester', semester);
        formData.append('description', description);

        pendingFiles.forEach(file => formData.append('files', file));

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    progressBar.style.width = percent + '%';
                    progressText.textContent = `Uploading... ${percent}%`;
                }
            });

            xhr.addEventListener('load', () => {
                progressContainer.style.display = 'none';
                if (xhr.status === 201 || xhr.status === 200) {
                    clearPendingSelection();
                    resetUploadForm();
                    showNotification(`${pendingFiles.length} note file(s) uploaded successfully!`);
                    loadSharedNotesFeed();
                } else {
                    showNotification('Upload failed on server', true);
                }
            });

            xhr.addEventListener('error', () => {
                progressContainer.style.display = 'none';
                fallbackLocalUpload(title, subject, course, semester, description);
            });

            xhr.open('POST', `${API_BASE_URL}/files/upload`);
            if (authToken) xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
            xhr.send(formData);
        } catch (err) {
            progressContainer.style.display = 'none';
            fallbackLocalUpload(title, subject, course, semester, description);
        }
    }
}

function fallbackLocalUpload(title, subject, course, semester, description) {
    // In-memory fallback if server is offline
    pendingFiles.forEach(file => {
        const fileUrl = URL.createObjectURL(file);
        const record = {
            id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            title: title || file.name,
            name: file.name,
            url: fileUrl,
            content: fileUrl,
            type: getFileTypeCategory(file.type, file.name),
            size: file.size,
            subject: subject,
            course: course,
            semester: semester,
            description: description,
            uploader: currentUser ? currentUser.username : 'Student',
            uploaderId: currentUser ? currentUser.id : 'anonymous',
            downloadCount: 0,
            uploadDate: new Date().toLocaleDateString()
        };
        notesFeed.unshift(record);
    });
    progressContainer.style.display = 'none';
    clearPendingSelection();
    resetUploadForm();
    showNotification('Notes saved locally!');
    renderNotesFeed();
}

function resetUploadForm() {
    noteTitle.value = '';
    noteDescription.value = '';
}

// Fetch Shared Notes Feed Across Platform
async function loadSharedNotesFeed() {
    updateConnectionStatus('connecting', 'Connecting to notes feed...');

    if (isFirebaseAvailable) {
        try {
            const snapshot = await firebase.firestore().collection('notes')
                .orderBy('uploadDate', 'desc')
                .get();

            notesFeed = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    uploadDate: data.uploadDate ? (data.uploadDate.toDate ? data.uploadDate.toDate().toLocaleDateString() : 'Recent') : 'Recent',
                    content: data.url
                };
            });
            updateConnectionStatus('connected', 'Cloud Storage Connected');
            renderNotesFeed();
            return;
        } catch (err) {
            console.warn('Firebase feed fetch error:', err.message);
        }
    }

    // Try Local REST API
    try {
        const response = await fetch(`${API_BASE_URL}/files`);
        if (response.ok) {
            const data = await response.json();
            notesFeed = data.files.map(file => ({
                id: file.id || file._id,
                title: file.title || file.name,
                name: file.name,
                type: file.type || getFileTypeCategory(file.mimetype, file.name),
                size: file.size,
                subject: file.subject || 'General',
                course: file.course || 'General',
                semester: file.semester || 'Sem 1',
                description: file.description || '',
                uploader: file.uploader || 'Student',
                uploaderId: file.uploaderId || file.userId,
                downloadCount: file.downloadCount || file.download_count || 0,
                content: `${API_BASE_URL}/files/${file.id || file._id}/download`,
                uploadDate: file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : 'Recent'
            }));
            updateConnectionStatus('connected', 'Connected to Express Backend');
            renderNotesFeed();
            return;
        }
    } catch (err) {
        console.warn('Local API connect error:', err.message);
    }

    updateConnectionStatus('connected', 'Local Notes Storage Ready');
    renderNotesFeed();
}

// Render Notes Feed with Multi-Field Search & Filters
function renderNotesFeed() {
    if (!filesGrid) return;
    filesGrid.innerHTML = '';

    const filtered = notesFeed.filter(note => {
        // Multi-field search
        const q = activeSearchQuery;
        const matchesSearch = !q || (
            (note.title && note.title.toLowerCase().includes(q)) ||
            (note.name && note.name.toLowerCase().includes(q)) ||
            (note.subject && note.subject.toLowerCase().includes(q)) ||
            (note.course && note.course.toLowerCase().includes(q)) ||
            (note.semester && note.semester.toLowerCase().includes(q)) ||
            (note.description && note.description.toLowerCase().includes(q))
        );

        // Type filter
        const matchesType = (activeTypeFilter === 'all') || (note.type === activeTypeFilter);
        // Subject filter
        const matchesSubject = (activeSubjectFilter === 'all') || (note.subject === activeSubjectFilter);
        // Semester filter
        const matchesSemester = (activeSemesterFilter === 'all') || (note.semester === activeSemesterFilter);

        return matchesSearch && matchesType && matchesSubject && matchesSemester;
    });

    // Sort notes
    filtered.sort((a, b) => {
        if (activeSort === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
        if (activeSort === 'title') return (a.title || a.name).localeCompare(b.title || b.name);
        if (activeSort === 'size') return (b.size || 0) - (a.size || 0);
        return 0; // newest first by default
    });

    if (notesCount) notesCount.textContent = filtered.length;

    if (filtered.length === 0) {
        filesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No notes found matching criteria</h3>
                <p>Try clearing your search term or adjusting category filters.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(note => {
        const card = createNoteCardElement(note);
        filesGrid.appendChild(card);
    });
}

// Build Note Card Component
function createNoteCardElement(note) {
    const card = document.createElement('div');
    card.className = 'file-card';

    const fileIconClass = getFileIcon(note.type);
    const formattedSize = formatBytes(note.size);

    card.innerHTML = `
        <div class="file-card-top">
            <div class="file-card-header">
                <div class="file-type-icon ${escapeHTML(note.type)}">
                    <i class="${fileIconClass}"></i>
                </div>
                <div class="file-title-block">
                    <div class="note-title" title="${escapeHTML(note.title)}">${escapeHTML(note.title)}</div>
                    <div class="original-filename"><i class="fas fa-paperclip"></i> ${escapeHTML(note.name)}</div>
                </div>
            </div>

            <div class="note-badges">
                <span class="badge badge-subject">${escapeHTML(note.subject || 'General')}</span>
                <span class="badge badge-semester">${escapeHTML(note.semester || 'Sem 1')}</span>
                <span class="badge badge-course">${escapeHTML(note.course || 'B.Tech')}</span>
                <span class="badge badge-size">${formattedSize}</span>
            </div>

            ${note.description ? `<p class="note-description">${escapeHTML(note.description)}</p>` : ''}

            <div class="file-card-meta">
                <span class="uploader-info"><i class="fas fa-user-circle"></i> ${escapeHTML(note.uploader || 'Student')}</span>
                <span class="download-stat"><i class="fas fa-download"></i> ${note.downloadCount || 0} downloads</span>
            </div>
        </div>

        <div class="file-card-actions">
            <button type="button" class="btn btn-outline preview-btn">
                <i class="fas fa-eye"></i> Preview
            </button>
            <button type="button" class="btn btn-primary download-btn">
                <i class="fas fa-download"></i> Download
            </button>
            <button type="button" class="btn btn-outline share-btn" title="Share with friends">
                <i class="fas fa-share-alt"></i> Share
            </button>
            <button type="button" class="btn btn-danger-outline delete-btn" title="Delete note">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    card.querySelector('.preview-btn').addEventListener('click', () => openNotePreview(note));
    card.querySelector('.download-btn').addEventListener('click', () => downloadNoteFile(note));
    card.querySelector('.share-btn').addEventListener('click', () => shareNoteLink(note));
    card.querySelector('.delete-btn').addEventListener('click', () => promptNoteDeletion(note.id));

    return card;
}

// File Previews
function openNotePreview(note) {
    activePreviewNote = note;
    previewTitle.innerHTML = `<i class="fas fa-file-alt"></i> Preview: ${escapeHTML(note.title)}`;
    previewBody.innerHTML = '';

    const noteUrl = note.content || note.url;

    if (note.type === 'img') {
        const img = document.createElement('img');
        img.src = noteUrl;
        img.alt = note.title;
        previewBody.appendChild(img);
    } else if (note.type === 'pdf') {
        const iframe = document.createElement('iframe');
        iframe.src = noteUrl;
        previewBody.appendChild(iframe);
    } else if (note.type === 'txt') {
        fetch(noteUrl)
            .then(res => res.text())
            .then(text => {
                const box = document.createElement('pre');
                box.className = 'preview-text-box';
                box.textContent = text;
                previewBody.appendChild(box);
            })
            .catch(() => {
                renderFallbackPreview(note);
            });
        previewModal.classList.add('active');
        return;
    } else {
        renderFallbackPreview(note);
    }

    previewModal.classList.add('active');
}

function renderFallbackPreview(note) {
    previewBody.innerHTML = `
        <div class="fallback-preview-card">
            <i class="${getFileIcon(note.type)}"></i>
            <h4>${escapeHTML(note.title)}</h4>
            <p style="color: var(--text-light); margin: 10px 0;">
                Direct preview is not available in browser for this document format (${escapeHTML(note.type.toUpperCase())}).
            </p>
            <p>Click <strong>Download</strong> below to open and view the full file on your device.</p>
        </div>
    `;
}

// Download Handler (Increments Counter & Preserves Original Filename)
async function downloadNoteFile(note) {
    note.downloadCount = (note.downloadCount || 0) + 1;
    renderNotesFeed();

    const noteUrl = note.content || note.url;
    const downloadName = note.name || note.title || 'student_note';

    showNotification(`Downloading ${downloadName}...`);

    try {
        // Fetch as blob to force download with original filename
        const response = await fetch(noteUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
        // Direct link fallback
        const a = document.createElement('a');
        a.href = noteUrl;
        a.download = downloadName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Share Feature
function shareNoteLink(note) {
    const shareData = {
        title: note.title,
        text: `Check out these notes on ${note.subject} (${note.semester}): ${note.title}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => copyToClipboard(shareData.url));
    } else {
        copyToClipboard(shareData.url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Notes platform link copied to clipboard!');
    }).catch(() => {
        showNotification('Share link ready!');
    });
}

// Delete Note Modal Prompt
function promptNoteDeletion(id) {
    pendingDeleteId = id;
    deleteConfirmModal.classList.add('active');
}

async function executeNoteDeletion() {
    if (!pendingDeleteId) return;
    deleteConfirmModal.classList.remove('active');

    if (isFirebaseAvailable) {
        try {
            await firebase.firestore().collection('notes').doc(pendingDeleteId).delete();
            showNotification('Note deleted successfully');
        } catch (err) {
            console.warn('Firebase delete note error:', err.message);
        }
    } else {
        try {
            await fetch(`${API_BASE_URL}/files/${pendingDeleteId}`, {
                method: 'DELETE',
                headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
            });
            showNotification('Note deleted successfully');
        } catch (err) {
            console.warn('Local delete note error:', err.message);
        }
    }

    notesFeed = notesFeed.filter(n => n.id !== pendingDeleteId);
    pendingDeleteId = null;
    renderNotesFeed();
}

// Helper Utilities
function getFileIcon(type) {
    switch (type) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'doc': return 'fas fa-file-word';
        case 'txt': return 'fas fa-file-alt';
        case 'img': return 'fas fa-file-image';
        case 'ppt': return 'fas fa-file-powerpoint';
        case 'xls': return 'fas fa-file-excel';
        case 'video': return 'fas fa-file-video';
        default: return 'fas fa-file';
    }
}

function getFileTypeCategory(mimetype = '', filename = '') {
    const ext = (filename.substring(filename.lastIndexOf('.'))).toLowerCase();
    if (mimetype.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'img';
    if (mimetype === 'application/pdf' || ext === '.pdf') return 'pdf';
    if (mimetype === 'text/plain' || ext === '.txt') return 'txt';
    if (['.doc', '.docx'].includes(ext) || mimetype.includes('word')) return 'doc';
    if (['.ppt', '.pptx'].includes(ext) || mimetype.includes('presentation')) return 'ppt';
    if (['.xls', '.xlsx'].includes(ext) || mimetype.includes('spreadsheet')) return 'xls';
    if (mimetype.startsWith('video/')) return 'video';
    return 'other';
}

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function loadThemePreference() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    contactModal.classList.remove('active');
    contactForm.reset();
    showNotification('Thank you! Your support message has been submitted.');
}

function showNotification(msg, isError = false) {
    if (!notification || !notificationText) return;
    notificationText.textContent = msg;
    notification.classList.remove('error');

    if (isError) {
        notification.classList.add('error');
        if (notificationIcon) notificationIcon.className = 'fas fa-exclamation-circle';
    } else {
        if (notificationIcon) notificationIcon.className = 'fas fa-check-circle';
    }

    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3500);
}

function updateConnectionStatus(status, msg) {
    if (!connectionStatus || !connectionText) return;
    connectionStatus.className = 'connection-status ' + status;
    connectionText.textContent = msg;
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', init);
