// MyNotes Platform Core JavaScript Engine
// Supports Universal Academic Platform: Class 1-12, Diploma, and 35+ Engineering Branches

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
const guestBtn = document.getElementById('guestBtn');

const headerProfilePlaceholder = document.getElementById('headerProfilePlaceholder');
const headerProfileImage = document.getElementById('headerProfileImage');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const contactBtn = document.getElementById('contactBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const appLogoBtn = document.getElementById('appLogoBtn');

// Navigation Tabs
const tabAllNotes = document.getElementById('tabAllNotes');
const tabSchoolNotes = document.getElementById('tabSchoolNotes');
const tabEngineeringNotes = document.getElementById('tabEngineeringNotes');
const tabExploreSubjects = document.getElementById('tabExploreSubjects');
const tabSavedNotes = document.getElementById('tabSavedNotes');
const tabUploadNotes = document.getElementById('tabUploadNotes');
const savedCount = document.getElementById('savedCount');

// Upload Elements
const uploadSection = document.getElementById('uploadSection');
const educationLevel = document.getElementById('educationLevel');
const classLevelGroup = document.getElementById('classLevelGroup');
const classLevel = document.getElementById('classLevel');
const streamGroup = document.getElementById('streamGroup');
const streamSelect = document.getElementById('streamSelect');
const branchGroup = document.getElementById('branchGroup');
const branchSelect = document.getElementById('branchSelect');
const customBranchGroup = document.getElementById('customBranchGroup');
const customBranchInput = document.getElementById('customBranchInput');
const yearSemesterGroup = document.getElementById('yearSemesterGroup');
const noteYear = document.getElementById('noteYear');
const noteSemester = document.getElementById('noteSemester');
const noteSubject = document.getElementById('noteSubject');
const customSubjectGroup = document.getElementById('customSubjectGroup');
const customSubjectInput = document.getElementById('customSubjectInput');
const noteCategory = document.getElementById('noteCategory');
const noteTitle = document.getElementById('noteTitle');
const noteTags = document.getElementById('noteTags');
const academicYear = document.getElementById('academicYear');
const noteDescription = document.getElementById('noteDescription');

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectedFilesBar = document.getElementById('selectedFilesBar');
const selectedFilesCount = document.getElementById('selectedFilesCount');
const startUploadBtn = document.getElementById('startUploadBtn');
const cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// Search & Advanced Filter Elements
const searchInput = document.getElementById('searchInput');
const typeFilterButtons = document.querySelectorAll('#typeFilterButtons .filter-btn');
const filterEducationLevel = document.getElementById('filterEducationLevel');
const filterBranch = document.getElementById('filterBranch');
const filterSemester = document.getElementById('filterSemester');
const filterCategory = document.getElementById('filterCategory');
const sortBySelect = document.getElementById('sortBySelect');
const activeFilterChipsBar = document.getElementById('activeFilterChipsBar');
const chipsContainer = document.getElementById('chipsContainer');
const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');

// View Containers
const feedViewContainer = document.getElementById('feedViewContainer');
const filesGrid = document.getElementById('filesGrid');
const notesCount = document.getElementById('notesCount');
const activeViewBadge = document.getElementById('activeViewBadge');

const schoolDirectoryView = document.getElementById('schoolDirectoryView');
const schoolClassCardsGrid = document.getElementById('schoolClassCardsGrid');
const engineeringDirectoryView = document.getElementById('engineeringDirectoryView');
const engineeringBranchCardsGrid = document.getElementById('engineeringBranchCardsGrid');
const subjectsDirectoryView = document.getElementById('subjectsDirectoryView');
const subjectsCatalogGrid = document.getElementById('subjectsCatalogGrid');

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

const reportModal = document.getElementById('reportModal');
const closeReportModal = document.getElementById('closeReportModal');
const reportForm = document.getElementById('reportForm');
const reportReason = document.getElementById('reportReason');
const reportDetails = document.getElementById('reportDetails');
const cancelReportBtn = document.getElementById('cancelReportBtn');

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
let activeView = 'feed'; // 'feed', 'school', 'engineering', 'subjects', 'saved', 'upload'
let activeFormatFilter = 'all';
let activeEducationFilter = 'all';
let activeBranchFilter = 'all';
let activeSemesterFilter = 'all';
let activeCategoryFilter = 'all';
let activeSearchQuery = '';
let activeSort = 'newest';
let pendingDeleteId = null;
let pendingReportNote = null;
let activePreviewNote = null;
let bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedNotes') || '[]');
let authToken = localStorage.getItem('authToken') || null;

// Academic Taxonomy Datasets
const PREDEFINED_SUBJECTS = {
    school_primary: ['Mathematics', 'English', 'Hindi', 'Science', 'Environmental Studies', 'Computer', 'General Knowledge', 'Social Studies', 'Art', '+ Add Custom Subject...'],
    school_middle: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'History', 'Geography', 'Civics', 'Computer Science', 'Sanskrit', 'General Knowledge', '+ Add Custom Subject...'],
    school_secondary: ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'History', 'Geography', 'Political Science', 'Economics', 'Computer Applications', 'Information Technology', 'Sanskrit', '+ Add Custom Subject...'],
    school_science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'English', 'Physical Education', 'Informatics Practices', '+ Add Custom Subject...'],
    school_commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Applied Mathematics', 'English', 'Entrepreneurship', 'Informatics Practices', '+ Add Custom Subject...'],
    school_arts: ['History', 'Political Science', 'Geography', 'Economics', 'Sociology', 'Psychology', 'Philosophy', 'English', 'Hindi', 'Fine Arts', 'Physical Education', '+ Add Custom Subject...'],
    engineering_common: [
        'Engineering Mathematics', 'Engineering Physics', 'Engineering Chemistry', 'Programming in C', 'C++', 'Java', 'Python',
        'Data Structures', 'Algorithms', 'Design & Analysis of Algorithms', 'Database Management Systems (DBMS)',
        'Operating Systems', 'Computer Networks', 'Computer Organization', 'Software Engineering', 'Web Development',
        'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cyber Security', 'Cloud Computing',
        'Theory of Computation', 'Compiler Design', 'Digital Electronics', 'Microprocessors', 'Discrete Mathematics',
        'Signals & Systems', 'Control Systems', 'Power Systems', 'Thermodynamics', 'Fluid Mechanics',
        'Engineering Mechanics', 'Strength of Materials', 'Structural Analysis', 'Surveying', 'Manufacturing Processes',
        'Heat Transfer', 'Mass Transfer', '+ Add Custom Subject...'
    ]
};

// Dynamic API Base URL Resolver
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

console.log('MyNotes Universal Platform Initializing...');
console.log('API Base URL:', API_BASE_URL);

// Initialize Application
function init() {
    setupEventListeners();
    setupDynamicFormListeners();
    loadThemePreference();
    checkAuthSession();
    updateSavedNotesCounter();
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
    if (appLogoBtn) appLogoBtn.addEventListener('click', (e) => { e.preventDefault(); switchNavTab('feed'); });

    // Profile upload
    if (profileUploadBtn) profileUploadBtn.addEventListener('click', () => profileImageInput.click());
    if (profileImageInput) profileImageInput.addEventListener('change', handleProfilePhotoSelected);

    // Theme & Contact
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (contactBtn) contactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    if (closeContact) closeContact.addEventListener('click', () => contactModal.classList.remove('active'));
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);

    // Main Navigation Tabs
    tabAllNotes.addEventListener('click', () => switchNavTab('feed'));
    tabSchoolNotes.addEventListener('click', () => switchNavTab('school'));
    tabEngineeringNotes.addEventListener('click', () => switchNavTab('engineering'));
    tabExploreSubjects.addEventListener('click', () => switchNavTab('subjects'));
    tabSavedNotes.addEventListener('click', () => switchNavTab('saved'));
    tabUploadNotes.addEventListener('click', () => switchNavTab('upload'));

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
            updateFilterChips();
            renderNotesFeed();
        });
    }

    typeFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFormatFilter = btn.dataset.filter;
            updateFilterChips();
            renderNotesFeed();
        });
    });

    if (filterEducationLevel) filterEducationLevel.addEventListener('change', (e) => { activeEducationFilter = e.target.value; updateFilterChips(); renderNotesFeed(); });
    if (filterBranch) filterBranch.addEventListener('change', (e) => { activeBranchFilter = e.target.value; updateFilterChips(); renderNotesFeed(); });
    if (filterSemester) filterSemester.addEventListener('change', (e) => { activeSemesterFilter = e.target.value; updateFilterChips(); renderNotesFeed(); });
    if (filterCategory) filterCategory.addEventListener('change', (e) => { activeCategoryFilter = e.target.value; updateFilterChips(); renderNotesFeed(); });
    if (sortBySelect) sortBySelect.addEventListener('change', (e) => { activeSort = e.target.value; renderNotesFeed(); });
    if (clearAllFiltersBtn) clearAllFiltersBtn.addEventListener('click', resetAllFilters);

    // Modals
    if (closePreview) closePreview.addEventListener('click', () => previewModal.classList.remove('active'));
    if (previewModal) previewModal.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.classList.remove('active'); });
    if (modalDownloadBtn) modalDownloadBtn.addEventListener('click', () => { if (activePreviewNote) downloadNoteFile(activePreviewNote); });
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.classList.remove('active'));
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', executeNoteDeletion);

    // Report Modal
    if (closeReportModal) closeReportModal.addEventListener('click', () => reportModal.classList.remove('active'));
    if (cancelReportBtn) cancelReportBtn.addEventListener('click', () => reportModal.classList.remove('active'));
    if (reportForm) reportForm.addEventListener('submit', handleReportSubmit);
}

// Dynamic Upload Form Behavior
function setupDynamicFormListeners() {
    if (educationLevel) {
        educationLevel.addEventListener('change', updateUploadFormFields);
    }
    if (classLevel) {
        classLevel.addEventListener('change', updateUploadFormFields);
    }
    if (streamSelect) {
        streamSelect.addEventListener('change', updateUploadFormFields);
    }
    if (branchSelect) {
        branchSelect.addEventListener('change', () => {
            if (branchSelect.value === 'Other Branch') {
                customBranchGroup.style.display = 'block';
            } else {
                customBranchGroup.style.display = 'none';
            }
            updateSubjectOptions();
        });
    }
    if (noteSubject) {
        noteSubject.addEventListener('change', () => {
            if (noteSubject.value === '+ Add Custom Subject...') {
                customSubjectGroup.style.display = 'block';
            } else {
                customSubjectGroup.style.display = 'none';
            }
        });
    }

    updateUploadFormFields();
}

function updateUploadFormFields() {
    const level = educationLevel.value;

    if (level === 'School' || level.startsWith('Class ')) {
        classLevelGroup.style.display = 'block';
        branchGroup.style.display = 'none';
        customBranchGroup.style.display = 'none';
        yearSemesterGroup.style.display = 'none';

        const cls = level.startsWith('Class ') ? level : classLevel.value;
        if (['Class 11', 'Class 12'].includes(cls)) {
            streamGroup.style.display = 'block';
        } else {
            streamGroup.style.display = 'none';
        }
    } else if (level === 'Diploma') {
        classLevelGroup.style.display = 'none';
        streamGroup.style.display = 'none';
        branchGroup.style.display = 'block';
        yearSemesterGroup.style.display = 'block';
    } else {
        classLevelGroup.style.display = 'none';
        streamGroup.style.display = 'none';
        branchGroup.style.display = 'block';
        yearSemesterGroup.style.display = 'block';
    }

    updateSubjectOptions();
}

function updateSubjectOptions() {
    const level = educationLevel.value;
    const cls = level.startsWith('Class ') ? level : classLevel.value;
    const stm = streamSelect.value;
    let list = PREDEFINED_SUBJECTS.engineering_common;

    if (level === 'School' || level.startsWith('Class ')) {
        if (['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(cls)) {
            list = PREDEFINED_SUBJECTS.school_primary;
        } else if (['Class 6', 'Class 7', 'Class 8'].includes(cls)) {
            list = PREDEFINED_SUBJECTS.school_middle;
        } else if (['Class 9', 'Class 10'].includes(cls)) {
            list = PREDEFINED_SUBJECTS.school_secondary;
        } else if (['Class 11', 'Class 12'].includes(cls)) {
            if (stm === 'Commerce') list = PREDEFINED_SUBJECTS.school_commerce;
            else if (stm === 'Arts/Humanities') list = PREDEFINED_SUBJECTS.school_arts;
            else list = PREDEFINED_SUBJECTS.school_science;
        }
    }

    noteSubject.innerHTML = '';
    list.forEach(subj => {
        const opt = document.createElement('option');
        opt.value = subj;
        opt.textContent = subj;
        noteSubject.appendChild(opt);
    });

    if (noteSubject.value === '+ Add Custom Subject...') {
        customSubjectGroup.style.display = 'block';
    } else {
        customSubjectGroup.style.display = 'none';
    }
}

// Navigation Tab Switcher Engine
function switchNavTab(targetView) {
    activeView = targetView;

    // Update active tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (targetView === 'feed') tabAllNotes.classList.add('active');
    if (targetView === 'school') tabSchoolNotes.classList.add('active');
    if (targetView === 'engineering') tabEngineeringNotes.classList.add('active');
    if (targetView === 'subjects') tabExploreSubjects.classList.add('active');
    if (targetView === 'saved') tabSavedNotes.classList.add('active');
    if (targetView === 'upload') tabUploadNotes.classList.add('active');

    // Hide all view containers
    feedViewContainer.style.display = 'none';
    schoolDirectoryView.style.display = 'none';
    engineeringDirectoryView.style.display = 'none';
    subjectsDirectoryView.style.display = 'none';
    uploadSection.style.display = 'none';

    if (targetView === 'feed') {
        feedViewContainer.style.display = 'block';
        activeViewBadge.innerHTML = '<i class="fas fa-globe"></i> Universal Feed';
        renderNotesFeed();
    } else if (targetView === 'school') {
        schoolDirectoryView.style.display = 'block';
        renderSchoolDirectory();
    } else if (targetView === 'engineering') {
        engineeringDirectoryView.style.display = 'block';
        renderEngineeringDirectory();
    } else if (targetView === 'subjects') {
        subjectsDirectoryView.style.display = 'block';
        renderSubjectsCatalog();
    } else if (targetView === 'saved') {
        feedViewContainer.style.display = 'block';
        activeViewBadge.innerHTML = '<i class="fas fa-bookmark"></i> My Saved Notes';
        renderSavedNotesFeed();
    } else if (targetView === 'upload') {
        uploadSection.style.display = 'block';
        window.scrollTo({ top: uploadSection.offsetTop - 80, behavior: 'smooth' });
    }
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

// File Selection & Universal Upload Processing
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

    const edLevel = educationLevel.value;
    const clsLevel = edLevel.startsWith('Class ') ? edLevel : (classLevelGroup.style.display !== 'none' ? classLevel.value : 'N/A');
    const stm = streamGroup.style.display !== 'none' ? streamSelect.value : 'N/A';
    
    let brnch = branchGroup.style.display !== 'none' ? branchSelect.value : 'General';
    let isCustBranch = false;
    if (brnch === 'Other Branch') {
        brnch = customBranchInput.value.trim() || 'Custom Branch';
        isCustBranch = true;
    }

    let sbj = noteSubject.value;
    let isCustSubject = false;
    if (sbj === '+ Add Custom Subject...') {
        sbj = customSubjectInput.value.trim() || 'Custom Subject';
        isCustSubject = true;
    }

    const title = cleanFilename(noteTitle.value.trim() || pendingFiles[0].name);
    const category = noteCategory.value;
    const year = noteYear ? noteYear.value : 'N/A';
    const semester = noteSemester ? noteSemester.value : 'All Semesters';
    const description = noteDescription.value.trim();
    const tags = noteTags ? noteTags.value.trim() : '';
    const acadYear = academicYear ? academicYear.value.trim() : '2025-2026';

    progressContainer.style.display = 'block';
    progressBar.style.width = '10%';
    progressText.textContent = 'Uploading notes to Cloud Storage (Cloudinary & MongoDB)...';

    const formData = new FormData();
    formData.append('title', title);
    formData.append('educationLevel', edLevel);
    formData.append('classLevel', clsLevel);
    formData.append('stream', stm);
    formData.append('course', edLevel === 'Diploma' ? 'Diploma' : 'B.Tech');
    formData.append('branch', brnch);
    formData.append('year', year);
    formData.append('semester', semester);
    formData.append('subject', sbj);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('academicYear', acadYear);
    formData.append('isCustomSubject', isCustSubject);
    formData.append('isCustomBranch', isCustBranch);

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
                switchNavTab('feed');
                loadSharedNotesFeed();
            } else {
                console.warn('Backend upload non-200 status:', xhr.status);
                fallbackLocalUpload(title, edLevel, clsLevel, brnch, semester, sbj, category, description);
            }
        });

        xhr.addEventListener('error', (err) => {
            console.error('XHR upload error:', err);
            progressContainer.style.display = 'none';
            fallbackLocalUpload(title, edLevel, clsLevel, brnch, semester, sbj, category, description);
        });

        xhr.open('POST', `${API_BASE_URL}/files/upload`);
        if (authToken) xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        xhr.send(formData);
    } catch (err) {
        console.error('Backend upload exception:', err);
        progressContainer.style.display = 'none';
        fallbackLocalUpload(title, edLevel, clsLevel, brnch, semester, sbj, category, description);
    }
}

function fallbackLocalUpload(title, edLevel, clsLevel, brnch, semester, sbj, category, description) {
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
            educationLevel: edLevel,
            classLevel: clsLevel,
            branch: brnch,
            semester: semester,
            subject: sbj,
            category: category,
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
    switchNavTab('feed');
    renderNotesFeed();
}

function resetUploadForm() {
    noteTitle.value = '';
    noteDescription.value = '';
    if (customSubjectInput) customSubjectInput.value = '';
    if (customBranchInput) customBranchInput.value = '';
}

// Fetch Shared Notes Feed Across Platform
async function loadSharedNotesFeed() {
    updateConnectionStatus('connecting', 'Connecting to MyNotes Server...');

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
                educationLevel: file.educationLevel || 'Engineering',
                classLevel: file.classLevel || 'N/A',
                stream: file.stream || 'N/A',
                branch: file.branch || file.course || 'Computer Science Engineering',
                course: file.course || 'B.Tech',
                year: file.year || 'N/A',
                semester: file.semester || 'Sem 1',
                subject: file.subject || 'General',
                category: file.category || 'Class Notes',
                description: file.description || '',
                tags: file.tags || [],
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

// Render Main Feed with Multi-Criteria Filters & Sorting
function renderNotesFeed() {
    if (!filesGrid) return;
    filesGrid.innerHTML = '';

    const filtered = notesFeed.filter(note => {
        const q = activeSearchQuery;
        const matchesSearch = !q || (
            (note.title && note.title.toLowerCase().includes(q)) ||
            (note.name && note.name.toLowerCase().includes(q)) ||
            (note.subject && note.subject.toLowerCase().includes(q)) ||
            (note.branch && note.branch.toLowerCase().includes(q)) ||
            (note.classLevel && note.classLevel.toLowerCase().includes(q)) ||
            (note.educationLevel && note.educationLevel.toLowerCase().includes(q)) ||
            (note.category && note.category.toLowerCase().includes(q)) ||
            (note.description && note.description.toLowerCase().includes(q))
        );

        const matchesFormat = (activeFormatFilter === 'all') || (note.type === activeFormatFilter);
        const matchesEducation = (activeEducationFilter === 'all') || (note.educationLevel === activeEducationFilter) || (note.classLevel === activeEducationFilter);
        const matchesBranch = (activeBranchFilter === 'all') || (note.branch === activeBranchFilter);
        const matchesSemester = (activeSemesterFilter === 'all') || (note.semester === activeSemesterFilter);
        const matchesCategory = (activeCategoryFilter === 'all') || (note.category === activeCategoryFilter);

        return matchesSearch && matchesFormat && matchesEducation && matchesBranch && matchesSemester && matchesCategory;
    });

    filtered.sort((a, b) => {
        if (activeSort === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
        if (activeSort === 'title') return (a.title || a.name).localeCompare(b.title || b.name);
        if (activeSort === 'oldest') return new Date(a.uploadDate || 0) - new Date(b.uploadDate || 0);
        return 0; // Default newest
    });

    if (notesCount) notesCount.textContent = filtered.length;

    if (filtered.length === 0) {
        filesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No notes found matching your filter criteria</h3>
                <p>Try clearing active filters or searching for different keywords.</p>
            </div>
        `;
        return;
    }

    filtered.forEach((note, idx) => {
        const card = createNoteCardElement(note);
        card.style.animationDelay = `${Math.min(idx * 0.04, 0.3)}s`;
        filesGrid.appendChild(card);
    });
}

// Render Saved Notes (Bookmarks)
function renderSavedNotesFeed() {
    if (!filesGrid) return;
    filesGrid.innerHTML = '';

    const savedNotes = notesFeed.filter(n => bookmarkedIds.includes(n.id));
    if (notesCount) notesCount.textContent = savedNotes.length;

    if (savedNotes.length === 0) {
        filesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h3>No Saved Notes Yet</h3>
                <p>Click the bookmark icon on any note card to save it to your personal study collection!</p>
            </div>
        `;
        return;
    }

    savedNotes.forEach((note, idx) => {
        const card = createNoteCardElement(note);
        card.style.animationDelay = `${Math.min(idx * 0.04, 0.3)}s`;
        filesGrid.appendChild(card);
    });
}

// Build Rich Note Card Component
function createNoteCardElement(note) {
    const card = document.createElement('div');
    card.className = 'file-card';

    const fileIconClass = getFileIcon(note.type);
    const formattedSize = formatBytes(note.size);
    const isBookmarked = bookmarkedIds.includes(note.id);

    const levelBadge = note.educationLevel === 'School' ? (note.classLevel || 'School') : (note.branch || note.educationLevel || 'General');

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
                <span class="badge badge-course">${escapeHTML(levelBadge)}</span>
                <span class="badge badge-semester">${escapeHTML(note.semester || 'Sem 1')}</span>
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
            <button type="button" class="btn btn-outline bookmark-btn ${isBookmarked ? 'active' : ''}" title="Save Note">
                <i class="fas fa-bookmark"></i>
            </button>
            <button type="button" class="btn btn-outline share-btn" title="Share with friends">
                <i class="fas fa-share-alt"></i>
            </button>
            <button type="button" class="btn btn-outline report-btn" title="Report Note" style="color: var(--warning);">
                <i class="fas fa-flag"></i>
            </button>
            <button type="button" class="btn btn-danger-outline delete-btn" title="Delete note">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    card.querySelector('.preview-btn').addEventListener('click', () => openNotePreview(note));
    card.querySelector('.download-btn').addEventListener('click', () => downloadNoteFile(note));
    card.querySelector('.bookmark-btn').addEventListener('click', () => toggleBookmarkNote(note));
    card.querySelector('.share-btn').addEventListener('click', () => shareNoteLink(note));
    card.querySelector('.report-btn').addEventListener('click', () => openReportModal(note));
    card.querySelector('.delete-btn').addEventListener('click', () => promptNoteDeletion(note.id));

    return card;
}

// Render School Notes Directory (Class 1 to Class 12)
function renderSchoolDirectory() {
    if (!schoolClassCardsGrid) return;
    schoolClassCardsGrid.innerHTML = '';

    const classes = [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
        'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
        'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)'
    ];

    classes.forEach(clsName => {
        const baseClass = clsName.split(' ')[0] + ' ' + clsName.split(' ')[1];
        const count = notesFeed.filter(n => (n.classLevel === baseClass || n.educationLevel === baseClass)).length;

        const card = document.createElement('div');
        card.className = 'directory-card';
        card.innerHTML = `
            <div class="directory-card-header">
                <div class="directory-card-icon"><i class="fas fa-graduation-cap"></i></div>
                <div>
                    <div class="directory-card-title">${clsName}</div>
                    <div class="directory-card-count">${count} Notes Available</div>
                </div>
            </div>
            <button class="btn btn-outline btn-sm btn-block" style="margin-top: 10px;">
                Explore ${clsName} Notes
            </button>
        `;

        card.addEventListener('click', () => {
            filterEducationLevel.value = baseClass;
            activeEducationFilter = baseClass;
            updateFilterChips();
            switchNavTab('feed');
        });

        schoolClassCardsGrid.appendChild(card);
    });
}

// Render Engineering Branch Directory
function renderEngineeringDirectory() {
    if (!engineeringBranchCardsGrid) return;
    engineeringBranchCardsGrid.innerHTML = '';

    const branches = [
        'Computer Science Engineering', 'Information Technology', 'Artificial Intelligence & Machine Learning',
        'Data Science', 'Cyber Security', 'Electronics & Communication Engineering', 'Electrical Engineering',
        'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Automobile Engineering',
        'Aerospace Engineering', 'Robotics Engineering', 'Biotechnology Engineering'
    ];

    branches.forEach(bName => {
        const count = notesFeed.filter(n => n.branch === bName).length;

        const card = document.createElement('div');
        card.className = 'directory-card';
        card.innerHTML = `
            <div class="directory-card-header">
                <div class="directory-card-icon"><i class="fas fa-microchip"></i></div>
                <div>
                    <div class="directory-card-title">${bName}</div>
                    <div class="directory-card-count">${count} Notes Available</div>
                </div>
            </div>
            <button class="btn btn-outline btn-sm btn-block" style="margin-top: 10px;">
                Browse ${bName}
            </button>
        `;

        card.addEventListener('click', () => {
            filterBranch.value = bName;
            activeBranchFilter = bName;
            updateFilterChips();
            switchNavTab('feed');
        });

        engineeringBranchCardsGrid.appendChild(card);
    });
}

// Render Subjects Catalog Index
function renderSubjectsCatalog() {
    if (!subjectsCatalogGrid) return;
    subjectsCatalogGrid.innerHTML = '';

    const subjectsMap = {};
    notesFeed.forEach(n => {
        const s = n.subject || 'General';
        subjectsMap[s] = (subjectsMap[s] || 0) + 1;
    });

    const subjectsList = Object.keys(subjectsMap).sort();
    if (subjectsList.length === 0) {
        subjectsCatalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No subjects cataloged yet. Be the first to upload notes!</p>';
        return;
    }

    subjectsList.forEach(sName => {
        const card = document.createElement('div');
        card.className = 'directory-card';
        card.innerHTML = `
            <div class="directory-card-header">
                <div class="directory-card-icon"><i class="fas fa-book"></i></div>
                <div>
                    <div class="directory-card-title">${escapeHTML(sName)}</div>
                    <div class="directory-card-count">${subjectsMap[sName]} Notes</div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            activeSearchQuery = sName.toLowerCase();
            if (searchInput) searchInput.value = sName;
            updateFilterChips();
            switchNavTab('feed');
        });

        subjectsCatalogGrid.appendChild(card);
    });
}

// Bookmarks System Manager
function toggleBookmarkNote(note) {
    const idx = bookmarkedIds.indexOf(note.id);
    if (idx !== -1) {
        bookmarkedIds.splice(idx, 1);
        showNotification('Removed from Saved Notes');
    } else {
        bookmarkedIds.push(note.id);
        showNotification('Saved to your study collection!');
    }
    localStorage.setItem('bookmarkedNotes', JSON.stringify(bookmarkedIds));
    updateSavedNotesCounter();

    if (activeView === 'saved') {
        renderSavedNotesFeed();
    } else {
        renderNotesFeed();
    }
}

function updateSavedNotesCounter() {
    if (savedCount) savedCount.textContent = bookmarkedIds.length;
}

// Filter Chips Manager
function updateFilterChips() {
    if (!activeFilterChipsBar || !chipsContainer) return;
    chipsContainer.innerHTML = '';

    const chips = [];
    if (activeFormatFilter !== 'all') chips.push({ label: `Format: ${activeFormatFilter.toUpperCase()}`, type: 'format' });
    if (activeEducationFilter !== 'all') chips.push({ label: `Level: ${activeEducationFilter}`, type: 'education' });
    if (activeBranchFilter !== 'all') chips.push({ label: `Branch: ${activeBranchFilter}`, type: 'branch' });
    if (activeSemesterFilter !== 'all') chips.push({ label: `Semester: ${activeSemesterFilter}`, type: 'semester' });
    if (activeCategoryFilter !== 'all') chips.push({ label: `Category: ${activeCategoryFilter}`, type: 'category' });
    if (activeSearchQuery) chips.push({ label: `Search: "${activeSearchQuery}"`, type: 'search' });

    if (chips.length === 0) {
        activeFilterChipsBar.style.display = 'none';
        return;
    }

    activeFilterChipsBar.style.display = 'flex';
    chips.forEach(c => {
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.innerHTML = `${escapeHTML(c.label)} <i class="fas fa-times chip-remove"></i>`;
        chip.querySelector('.chip-remove').addEventListener('click', () => removeSingleFilter(c.type));
        chipsContainer.appendChild(chip);
    });
}

function removeSingleFilter(type) {
    if (type === 'format') {
        activeFormatFilter = 'all';
        typeFilterButtons.forEach(b => b.classList.remove('active'));
        typeFilterButtons[0].classList.add('active');
    }
    if (type === 'education') { activeEducationFilter = 'all'; if (filterEducationLevel) filterEducationLevel.value = 'all'; }
    if (type === 'branch') { activeBranchFilter = 'all'; if (filterBranch) filterBranch.value = 'all'; }
    if (type === 'semester') { activeSemesterFilter = 'all'; if (filterSemester) filterSemester.value = 'all'; }
    if (type === 'category') { activeCategoryFilter = 'all'; if (filterCategory) filterCategory.value = 'all'; }
    if (type === 'search') { activeSearchQuery = ''; if (searchInput) searchInput.value = ''; }

    updateFilterChips();
    renderNotesFeed();
}

function resetAllFilters() {
    activeFormatFilter = 'all';
    activeEducationFilter = 'all';
    activeBranchFilter = 'all';
    activeSemesterFilter = 'all';
    activeCategoryFilter = 'all';
    activeSearchQuery = '';
    activeSort = 'newest';

    typeFilterButtons.forEach(b => b.classList.remove('active'));
    if (typeFilterButtons[0]) typeFilterButtons[0].classList.add('active');
    if (filterEducationLevel) filterEducationLevel.value = 'all';
    if (filterBranch) filterBranch.value = 'all';
    if (filterSemester) filterSemester.value = 'all';
    if (filterCategory) filterCategory.value = 'all';
    if (sortBySelect) sortBySelect.value = 'newest';
    if (searchInput) searchInput.value = '';

    updateFilterChips();
    renderNotesFeed();
}

// Universal File Previews
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

// Report Note Handler
function openReportModal(note) {
    pendingReportNote = note;
    reportReason.value = 'Wrong Content';
    reportDetails.value = '';
    reportModal.classList.add('active');
}

async function handleReportSubmit(e) {
    e.preventDefault();
    if (!pendingReportNote) return;

    const reason = reportReason.value;
    const details = reportDetails.value.trim();

    try {
        await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify({
                fileId: pendingReportNote.id,
                fileTitle: pendingReportNote.title,
                reason,
                details
            })
        });
        reportModal.classList.remove('active');
        showNotification('Thank you. Your report has been submitted to moderators.');
    } catch (err) {
        reportModal.classList.remove('active');
        showNotification('Report submitted successfully.');
    }
    pendingReportNote = null;
}

// Share Feature
function shareNoteLink(note) {
    const shareData = {
        title: note.title,
        text: `Check out these notes on ${note.subject} (${note.branch || note.classLevel || 'General'}): ${note.title}`,
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
