// MyNotes Platform Core JavaScript Engine
// Supports Dual Mode: Express REST API with Cloudinary & MongoDB Atlas + Fallback Cloud Storage

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

// Determine Dynamic API Base URL
function resolveApiBaseUrl() {
    if (window.location.protocol === 'file:') {
        return 'http://localhost:3000/api';
    }
    const hostname = window.location.hostname;
    const host = window.location.host;

    if (hostname.includes('github.io')) {
        return 'https://mynotes-5jj4.onrender.com/api';
    }

    return `${window.location.protocol}//${host}/api`;
}

const API_BASE_URL = resolveApiBaseUrl();
const isFirebaseAvailable = (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0);

console.log('MyNotes Platform Initializing...');
console.log('API Base URL:', API_BASE_URL);

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
            setTimeout(() => loader.style.display = 'none', 350);
        }
    }, 450);
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
        noteTitle.value = cleanFilename(pendingFiles[0].name.replace(/\.[^/.]+$/, ""));
    }
}

function clearPendingSelection() {
    pendingFiles = [];
    fileInput.value = '';
    selectedFilesBar.style.display = 'none';
}

async function processFileUploads() {
    if (pendingFiles.length === 0) return;

    const title = cleanFilename(noteTitle.value.trim() || pendingFiles[0].name);
    const subject = noteSubject.value;
    const course = noteCourse.value;
    const semester = noteSemester.value;
    const description = noteDescription.value.trim();

    progressContainer.style.display = 'block';
    progressBar.style.width = '10%';
    progressText.textContent = 'Uploading notes to Cloud (Cloudinary & MongoDB)...';

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
                progressText.textContent = `Uploading notes... ${percent}%`;
            }
        });

        xhr.addEventListener('load', () => {
            progressContainer.style.display = 'none';
            if (xhr.status === 201 || xhr.status === 200) {
                clearPendingSelection();
                resetUploadForm();
                showNotification(`✅ ${pendingFiles.length} note file(s) uploaded successfully!`);
                loadSharedNotesFeed();
            } else {
                console.warn('Backend upload non-200 status:', xhr.status);
                fallbackLocalUpload(title, subject, course, semester, description);
            }
        });

        xhr.addEventListener('error', (err) => {
            console.error('XHR upload error:', err);
            progressContainer.style.display = 'none';
            fallbackLocalUpload(title, subject, course, semester, description);
        });

        xhr.open('POST', `${API_BASE_URL}/files/upload`);
        if (authToken) xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);
    } catch (err) {
        console.error('Backend upload exception:', err);
        progressContainer.style.display = 'none';
        fallbackLocalUpload(title, subject, course, semester, description);
    }
}

function fallbackLocalUpload(title, subject, course, semester, description) {
    pendingFiles.forEach(file => {
        const fileUrl = URL.createObjectURL(file);
        const safeName = cleanFilename(file.name);
        const record = {
            id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            title: title || safeName,
            name: safeName,
            url: fileUrl,
            content: fileUrl,
            type: getFileTypeCategory(file.type, safeName),
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
    updateConnectionStatus('connecting', 'Connecting to MyNotes Server...');

    // Primary: Express REST API with Cloudinary & MongoDB Atlas
    try {
        const response = await fetch(`${API_BASE_URL}/files`);
        if (response.ok) {
            const data = await response.json();
            notesFeed = data.files.map(file => ({
                id: file.id || file._id,
                title: cleanFilename(file.title || file.name),
                name: cleanFilename(file.name),
                type: file.type || getFileTypeCategory(file.mimetype, file.name),
                size: file.size,
                subject: file.subject || 'General',
                course: file.course || 'General',
                semester: file.semester || 'Sem 1',
                description: file.description || '',
                uploader: file.uploader || 'Student',
                uploaderId: file.uploaderId || file.userId,
                downloadCount: file.downloadCount || file.download_count || 0,
                content: file.url || `${API_BASE_URL}/files/${file.id || file._id}/download`,
                url: file.url || `${API_BASE_URL}/files/${file.id || file._id}/download`,
                uploadDate: file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : 'Recent'
            }));
            updateConnectionStatus('connected', 'Cloud Database Active (MongoDB Atlas & Cloudinary)');
            renderNotesFeed();
            return;
        }
    } catch (err) {
        console.warn('Express API connect error:', err.message);
    }

    // Fallback: Firebase Firestore
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
                    name: cleanFilename(data.name || data.title),
                    title: cleanFilename(data.title || data.name),
                    uploadDate: data.uploadDate ? (data.uploadDate.toDate ? data.uploadDate.toDate().toLocaleDateString() : 'Recent') : 'Recent',
                    content: data.url,
                    url: data.url
                };
            });
            updateConnectionStatus('connected', 'Cloud Storage Connected (Firebase)');
            renderNotesFeed();
            return;
        } catch (err) {
            console.warn('Firebase feed fetch error:', err.message);
        }
    }

    updateConnectionStatus('connected', 'Local Notes Storage Ready');
    renderNotesFeed();
}

// Render Notes Feed with Multi-Field Search & Filters
function renderNotesFeed() {
    if (!filesGrid) return;
    filesGrid.innerHTML = '';

    const filtered = notesFeed.filter(note => {
        const q = activeSearchQuery;
        const matchesSearch = !q || (
            (note.title && note.title.toLowerCase().includes(q)) ||
            (note.name && note.name.toLowerCase().includes(q)) ||
            (note.subject && note.subject.toLowerCase().includes(q)) ||
            (note.course && note.course.toLowerCase().includes(q)) ||
            (note.semester && note.semester.toLowerCase().includes(q)) ||
            (note.description && note.description.toLowerCase().includes(q))
        );

        const matchesType = (activeTypeFilter === 'all') || (note.type === activeTypeFilter);
        const matchesSubject = (activeSubjectFilter === 'all') || (note.subject === activeSubjectFilter);
        const matchesSemester = (activeSemesterFilter === 'all') || (note.semester === activeSemesterFilter);

        return matchesSearch && matchesType && matchesSubject && matchesSemester;
    });

    filtered.sort((a, b) => {
        if (activeSort === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
        if (activeSort === 'title') return (a.title || a.name).localeCompare(b.title || b.name);
        if (activeSort === 'size') return (b.size || 0) - (a.size || 0);
        return 0;
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

    filtered.forEach((note, idx) => {
        const card = createNoteCardElement(note);
        card.style.animationDelay = `${Math.min(idx * 0.05, 0.4)}s`;
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

// Universal File Previews (PDF, Word, PPT, Excel, Images, Text)
async function openNotePreview(note) {
    activePreviewNote = note;
    previewTitle.innerHTML = `<i class="fas fa-file-alt"></i> Preview: ${escapeHTML(note.title)}`;
    previewBody.innerHTML = '';

    const noteUrl = note.url || note.content || `${API_BASE_URL}/files/${note.id}/download`;

    if (!noteUrl) {
        renderMissingStoragePreviewCard(note);
        previewModal.classList.add('active');
        return;
    }

    if (note.type === 'img') {
        const img = document.createElement('img');
        img.src = noteUrl;
        img.alt = note.title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '500px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '8px';
        previewBody.appendChild(img);
        previewModal.classList.add('active');
        return;
    }

    if (note.type === 'pdf' || ['doc', 'ppt', 'xls'].includes(note.type)) {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '520px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';

        // Google Docs Viewer embeds remote Cloudinary PDFs & Office docs cleanly without browser CORS / PDF extension errors
        if (noteUrl.startsWith('http://') || noteUrl.startsWith('https://')) {
            iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(noteUrl)}&embedded=true`;
        } else {
            iframe.src = noteUrl;
        }

        previewBody.appendChild(iframe);
        previewModal.classList.add('active');
        return;
    }

    if (note.type === 'txt') {
        try {
            const testRes = await fetch(noteUrl);
            if (testRes.ok) {
                const text = await testRes.text();
                const box = document.createElement('pre');
                box.className = 'preview-text-box';
                box.textContent = text;
                previewBody.appendChild(box);
                previewModal.classList.add('active');
                return;
            }
        } catch (e) {}
    }

    renderFallbackPreview(note);
    previewModal.classList.add('active');
}

function renderMissingStoragePreviewCard(note) {
    previewBody.innerHTML = `
        <div class="fallback-preview-card">
            <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
            <h4>Note File Unavailable on Server</h4>
            <p>
                The file <strong>"${escapeHTML(note.name)}"</strong> is currently unavailable on server storage.
            </p>
            <p>
                Please upload a new copy of this document using the <strong>Upload Notes</strong> section above.
            </p>
        </div>
    `;
}

function renderFallbackPreview(note) {
    previewBody.innerHTML = `
        <div class="fallback-preview-card">
            <i class="${getFileIcon(note.type)}"></i>
            <h4>${escapeHTML(note.title)}</h4>
            <p>
                Direct browser preview is not available for document format <strong>${escapeHTML(note.type.toUpperCase())}</strong>.
            </p>
            <p>Click <strong>Download</strong> below to open and view the file on your device.</p>
        </div>
    `;
}

// Download Handler
async function downloadNoteFile(note) {
    note.downloadCount = (note.downloadCount || 0) + 1;
    renderNotesFeed();

    const noteId = note.id;
    const downloadName = note.name || note.title || 'student_note';

    showNotification(`Downloading ${downloadName}...`);

    const downloadUrl = `${API_BASE_URL}/files/${noteId}/download`;

    try {
        const response = await fetch(downloadUrl);
        if (response.ok) {
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = downloadName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
            return;
        }
    } catch (err) {
        console.warn('Backend download error, trying direct URL:', err.message);
    }

    const directUrl = note.url || note.content;
    if (directUrl) {
        const a = document.createElement('a');
        a.href = directUrl;
        a.target = '_blank';
        a.download = downloadName;
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

    try {
        await fetch(`${API_BASE_URL}/files/${pendingDeleteId}`, {
            method: 'DELETE',
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        showNotification('Note deleted successfully');
    } catch (err) {
        console.warn('Delete note error:', err.message);
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

function cleanFilename(str) {
    if (!str) return '';
    return String(str)
        .replace(/â€‹/g, '')
        .replace(/â€™/g, "'")
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
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
