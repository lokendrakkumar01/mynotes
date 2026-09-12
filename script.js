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
const tabArticles = document.getElementById('tabArticles');
const tabCurrentAffairs = document.getElementById('tabCurrentAffairs');
const tabSavedNotes = document.getElementById('tabSavedNotes');
const tabAdminPortal = document.getElementById('tabAdminPortal');
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

const articlesViewContainer = document.getElementById('articlesViewContainer');
const articlesGrid = document.getElementById('articlesGrid');
const articleSingleContainer = document.getElementById('articleSingleContainer');
const createArticleBtn = document.getElementById('createArticleBtn');

const currentAffairsViewContainer = document.getElementById('currentAffairsViewContainer');
const newsGrid = document.getElementById('newsGrid');
const newsCategoryFilter = document.getElementById('newsCategoryFilter');
const refreshNewsBtn = document.getElementById('refreshNewsBtn');

const adminLoginViewContainer = document.getElementById('adminLoginViewContainer');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminUsernameInput = document.getElementById('adminUsername');
const adminPasswordInput = document.getElementById('adminPassword');

const adminDashboardViewContainer = document.getElementById('adminDashboardViewContainer');
const refreshAdminStatsBtn = document.getElementById('refreshAdminStatsBtn');
const statTotalUsers = document.getElementById('statTotalUsers');
const statTotalNotes = document.getElementById('statTotalNotes');
const statTotalDownloads = document.getElementById('statTotalDownloads');
const statPendingReports = document.getElementById('statPendingReports');

const adminSubTabUsers = document.getElementById('adminSubTabUsers');
const adminSubTabNotes = document.getElementById('adminSubTabNotes');
const adminSubTabReports = document.getElementById('adminSubTabReports');
const adminSubTabArticles = document.getElementById('adminSubTabArticles');
const adminSubTabNews = document.getElementById('adminSubTabNews');

const adminPanelUsers = document.getElementById('adminPanelUsers');
const adminPanelNotes = document.getElementById('adminPanelNotes');
const adminPanelReports = document.getElementById('adminPanelReports');
const adminPanelArticles = document.getElementById('adminPanelArticles');
const adminPanelNews = document.getElementById('adminPanelNews');

const adminUsersTableBody = document.getElementById('adminUsersTableBody');
const adminNotesTableBody = document.getElementById('adminNotesTableBody');
const adminReportsTableBody = document.getElementById('adminReportsTableBody');
const adminArticleForm = document.getElementById('adminArticleForm');
const adminArticlesList = document.getElementById('adminArticlesList');
const adminNewsList = document.getElementById('adminNewsList');
const adminSyncNewsBtn = document.getElementById('adminSyncNewsBtn');

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
    verifyUserSession();
    handleInitialRoute();
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

// Authentication & Role Session Manager
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
        currentUser = { id: 'guest-' + Date.now(), username: 'Guest Student', email: 'student@mynotes.edu', isGuest: true, role: 'user' };
        showAppView();
    }
    updateRoleUI();
}

async function verifyUserSession() {
    if (!authToken) return;
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateRoleUI();
        }
    } catch (e) {
        console.warn('Verify session warning:', e.message);
    }
}

function updateRoleUI() {
    if (currentUser && currentUser.role === 'admin') {
        if (tabAdminPortal) {
            tabAdminPortal.style.display = 'inline-flex';
            tabAdminPortal.innerHTML = '<i class="fas fa-user-shield"></i> Admin Dashboard';
        }
        if (createArticleBtn) createArticleBtn.style.display = 'inline-flex';
    } else {
        if (tabAdminPortal) {
            tabAdminPortal.style.display = 'none';
        }
        if (createArticleBtn) createArticleBtn.style.display = 'none';
    }
}

function handleInitialRoute() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin/login')) {
        switchNavTab('admin-login');
    } else if (path.includes('/admin')) {
        switchNavTab('admin');
    } else if (path.includes('/articles')) {
        switchNavTab('articles');
    } else if (path.includes('/current-affairs')) {
        switchNavTab('current-affairs');
    }
}

window.addEventListener('popstate', handleInitialRoute);

function setupEventListeners() {
    // Auth listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    registerLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterForm(); });
    loginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginForm(); });
    
    // Secret shortcut for Admin Portal Access: Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            showAppView();
            switchNavTab('admin-login');
            showNotification('Admin Portal Login View Activated', false);
        }
    });

    const headerUploadBtn = document.getElementById('headerUploadBtn');
    if (headerUploadBtn) headerUploadBtn.addEventListener('click', () => switchNavTab('upload'));

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
    if (tabAllNotes) tabAllNotes.addEventListener('click', () => switchNavTab('feed'));
    if (tabSchoolNotes) tabSchoolNotes.addEventListener('click', () => switchNavTab('school'));
    if (tabEngineeringNotes) tabEngineeringNotes.addEventListener('click', () => switchNavTab('engineering'));
    if (tabExploreSubjects) tabExploreSubjects.addEventListener('click', () => switchNavTab('subjects'));
    if (tabArticles) tabArticles.addEventListener('click', () => switchNavTab('articles'));
    if (tabCurrentAffairs) tabCurrentAffairs.addEventListener('click', () => switchNavTab('current-affairs'));
    if (tabSavedNotes) tabSavedNotes.addEventListener('click', () => switchNavTab('saved'));
    if (tabAdminPortal) tabAdminPortal.addEventListener('click', () => switchNavTab('admin'));
    if (tabUploadNotes) tabUploadNotes.addEventListener('click', () => switchNavTab('upload'));
}
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

    // Articles & Current Affairs
    if (refreshNewsBtn) refreshNewsBtn.addEventListener('click', () => loadCurrentAffairs(newsCategoryFilter ? newsCategoryFilter.value : 'all'));
    if (newsCategoryFilter) newsCategoryFilter.addEventListener('change', (e) => loadCurrentAffairs(e.target.value));

    // Admin Portal Form & Sub-tabs
    if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
    if (refreshAdminStatsBtn) refreshAdminStatsBtn.addEventListener('click', loadAdminDashboard);
    if (adminArticleForm) adminArticleForm.addEventListener('submit', handleCreateArticle);
    if (adminSyncNewsBtn) adminSyncNewsBtn.addEventListener('click', handleSyncNews);

    // Edit Note Modal Listeners
    const editNoteForm = document.getElementById('editNoteForm');
    const closeEditNoteModal = document.getElementById('closeEditNoteModal');
    const cancelEditNoteBtn = document.getElementById('cancelEditNoteBtn');
    const editNoteModal = document.getElementById('editNoteModal');

    if (editNoteForm) editNoteForm.addEventListener('submit', handleEditNoteSubmit);
    if (closeEditNoteModal) closeEditNoteModal.addEventListener('click', () => editNoteModal.classList.remove('active'));
    if (cancelEditNoteBtn) cancelEditNoteBtn.addEventListener('click', () => editNoteModal.classList.remove('active'));

    if (adminSubTabUsers) adminSubTabUsers.addEventListener('click', () => switchAdminPanel('users'));
    if (adminSubTabNotes) adminSubTabNotes.addEventListener('click', () => switchAdminPanel('notes'));
    if (adminSubTabReports) adminSubTabReports.addEventListener('click', () => switchAdminPanel('reports'));
    if (adminSubTabArticles) adminSubTabArticles.addEventListener('click', () => switchAdminPanel('articles'));
    if (adminSubTabNews) adminSubTabNews.addEventListener('click', () => switchAdminPanel('news'));
}

function switchAdminPanel(panelName) {
    [adminSubTabUsers, adminSubTabNotes, adminSubTabReports, adminSubTabArticles, adminSubTabNews].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    [adminPanelUsers, adminPanelNotes, adminPanelReports, adminPanelArticles, adminPanelNews].forEach(p => {
        if (p) p.style.display = 'none';
    });

    if (panelName === 'users') {
        if (adminSubTabUsers) adminSubTabUsers.classList.add('active');
        if (adminPanelUsers) adminPanelUsers.style.display = 'block';
        loadAdminUsers();
    } else if (panelName === 'notes') {
        if (adminSubTabNotes) adminSubTabNotes.classList.add('active');
        if (adminPanelNotes) adminPanelNotes.style.display = 'block';
        loadAdminNotes();
    } else if (panelName === 'reports') {
        if (adminSubTabReports) adminSubTabReports.classList.add('active');
        if (adminPanelReports) adminPanelReports.style.display = 'block';
        loadAdminReports();
    } else if (panelName === 'articles') {
        if (adminSubTabArticles) adminSubTabArticles.classList.add('active');
        if (adminPanelArticles) adminPanelArticles.style.display = 'block';
        loadArticles();
    } else if (panelName === 'news') {
        if (adminSubTabNews) adminSubTabNews.classList.add('active');
        if (adminPanelNews) adminPanelNews.style.display = 'block';
        loadCurrentAffairs();
    }
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
    if (targetView === 'feed' && tabAllNotes) tabAllNotes.classList.add('active');
    if (targetView === 'school' && tabSchoolNotes) tabSchoolNotes.classList.add('active');
    if (targetView === 'engineering' && tabEngineeringNotes) tabEngineeringNotes.classList.add('active');
    if (targetView === 'subjects' && tabExploreSubjects) tabExploreSubjects.classList.add('active');
    if (targetView === 'articles' && tabArticles) tabArticles.classList.add('active');
    if (targetView === 'current-affairs' && tabCurrentAffairs) tabCurrentAffairs.classList.add('active');
    if (targetView === 'saved' && tabSavedNotes) tabSavedNotes.classList.add('active');
    if (targetView === 'admin' && tabAdminPortal) tabAdminPortal.classList.add('active');
    if (targetView === 'upload' && tabUploadNotes) tabUploadNotes.classList.add('active');

    // Hide all view containers
    if (feedViewContainer) feedViewContainer.style.display = 'none';
    if (schoolDirectoryView) schoolDirectoryView.style.display = 'none';
    if (engineeringDirectoryView) engineeringDirectoryView.style.display = 'none';
    if (subjectsDirectoryView) subjectsDirectoryView.style.display = 'none';
    if (articlesViewContainer) articlesViewContainer.style.display = 'none';
    if (currentAffairsViewContainer) currentAffairsViewContainer.style.display = 'none';
    if (adminLoginViewContainer) adminLoginViewContainer.style.display = 'none';
    if (adminDashboardViewContainer) adminDashboardViewContainer.style.display = 'none';
    if (uploadSection) uploadSection.style.display = 'none';

    if (targetView === 'feed') {
        if (feedViewContainer) feedViewContainer.style.display = 'block';
        if (activeViewBadge) activeViewBadge.innerHTML = '<i class="fas fa-globe"></i> Universal Feed';
        renderNotesFeed();
    } else if (targetView === 'school') {
        if (schoolDirectoryView) schoolDirectoryView.style.display = 'block';
        renderSchoolDirectory();
    } else if (targetView === 'engineering') {
        if (engineeringDirectoryView) engineeringDirectoryView.style.display = 'block';
        renderEngineeringDirectory();
    } else if (targetView === 'subjects') {
        if (subjectsDirectoryView) subjectsDirectoryView.style.display = 'block';
        renderSubjectsCatalog();
    } else if (targetView === 'articles') {
        if (articlesViewContainer) articlesViewContainer.style.display = 'block';
        loadArticles();
    } else if (targetView === 'current-affairs') {
        if (currentAffairsViewContainer) currentAffairsViewContainer.style.display = 'block';
        loadCurrentAffairs();
    } else if (targetView === 'admin-login') {
        if (adminLoginViewContainer) adminLoginViewContainer.style.display = 'block';
    } else if (targetView === 'admin') {
        if (!currentUser || currentUser.role !== 'admin') {
            switchNavTab('admin-login');
            return;
        }
        if (adminDashboardViewContainer) adminDashboardViewContainer.style.display = 'block';
        loadAdminDashboard();
    } else if (targetView === 'saved') {
        if (feedViewContainer) feedViewContainer.style.display = 'block';
        if (activeViewBadge) activeViewBadge.innerHTML = '<i class="fas fa-bookmark"></i> My Saved Notes';
        renderSavedNotesFeed();
    } else if (targetView === 'upload') {
        if (uploadSection) uploadSection.style.display = 'block';
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
                const uploadedCount = pendingFiles.length || 1;
                clearPendingSelection();
                resetUploadForm();
                showNotification(`✅ ${uploadedCount} note file(s) uploaded successfully!`);
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
            checkSharedNoteQueryParam();
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
            checkSharedNoteQueryParam();
            return;
        } catch (err) {
            console.warn('Firebase feed fetch error:', err.message);
        }
    }

    updateConnectionStatus('connected', 'Local Notes Storage Ready');
    renderNotesFeed();
    checkSharedNoteQueryParam();
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
            ${(currentUser && currentUser.role === 'admin') ? `
            <button type="button" class="btn btn-outline edit-note-btn" title="Edit Note Details">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn btn-danger-outline delete-btn" title="Delete note">
                <i class="fas fa-trash"></i>
            </button>` : ''}
            <button type="button" class="btn btn-outline bookmark-btn ${isBookmarked ? 'active' : ''}" title="Save Note">
                <i class="fas fa-bookmark"></i>
            </button>
            <button type="button" class="btn btn-outline share-btn" title="Share with friends">
                <i class="fas fa-share-alt"></i>
            </button>
            <button type="button" class="btn btn-outline report-btn" title="Report Note" style="color: var(--warning);">
                <i class="fas fa-flag"></i>
            </button>
        </div>
    `;

    card.querySelector('.preview-btn').addEventListener('click', () => openNotePreview(note));
    card.querySelector('.download-btn').addEventListener('click', () => downloadNoteFile(note));
    
    const editBtn = card.querySelector('.edit-note-btn');
    if (editBtn) editBtn.addEventListener('click', () => openEditNoteModal(note));

    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) deleteBtn.addEventListener('click', () => promptNoteDeletion(note.id));

    card.querySelector('.bookmark-btn').addEventListener('click', () => toggleBookmarkNote(note));
    card.querySelector('.share-btn').addEventListener('click', () => shareNoteLink(note));
    card.querySelector('.report-btn').addEventListener('click', () => openReportModal(note));

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
    previewTitle.innerHTML = `<i class="${getFileIcon(note.type)}"></i> Preview: ${escapeHTML(note.title)}`;
    
    // Top Action Bar inside preview modal
    const viewUrl = `${API_BASE_URL}/files/${note.id}/view`;
    let directUrl = note.url || note.content || viewUrl;

    if (directUrl.includes('/image/upload/') && note.type === 'pdf') {
        directUrl = directUrl.replace('/image/upload/', '/raw/upload/');
    }

    const actionHeader = `
        <div class="preview-action-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; margin-bottom: 12px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <div style="font-size: 13px; color: var(--text-secondary);">
                <strong>Format:</strong> ${escapeHTML(note.type ? note.type.toUpperCase() : 'DOC')} | <strong>Size:</strong> ${formatBytes(note.size)}
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="${viewUrl}" target="_blank" class="btn btn-outline btn-sm">
                    <i class="fas fa-external-link-alt"></i> Open Fullscreen
                </a>
                <button type="button" class="btn btn-primary btn-sm" id="modalHeaderDownloadBtn">
                    <i class="fas fa-download"></i> Download Note
                </button>
            </div>
        </div>
        <div id="previewContainer"></div>
    `;

    previewBody.innerHTML = actionHeader;
    const modalHeaderDownloadBtn = previewBody.querySelector('#modalHeaderDownloadBtn');
    if (modalHeaderDownloadBtn) {
        modalHeaderDownloadBtn.addEventListener('click', () => downloadNoteFile(note));
    }

    const previewContainer = previewBody.querySelector('#previewContainer');
    previewContainer.innerHTML = '<div style="text-align:center; padding: 50px;"><i class="fas fa-spinner fa-spin" style="font-size: 36px; color: var(--primary);"></i><p style="margin-top: 14px; font-weight: 600;">Loading note document preview...</p></div>';
    previewModal.classList.add('active');

    // 1. Image Preview
    if (note.type === 'img') {
        previewContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = viewUrl;
        img.onerror = () => { img.src = directUrl; };
        img.alt = note.title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '520px';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '8px';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        previewContainer.appendChild(img);
        return;
    }

    // 2. PDF Document Preview
    if (note.type === 'pdf') {
        let pdfTargetUrl = viewUrl;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            const res = await fetch(viewUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const blob = await res.blob();
                if (blob.size > 0) {
                    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                    pdfTargetUrl = URL.createObjectURL(pdfBlob);
                }
            }
        } catch (e) {
            console.warn('PDF blob fetch warning:', e.message);
        }

        previewContainer.innerHTML = '';

        const pdfCard = document.createElement('div');
        pdfCard.style.display = 'flex';
        pdfCard.style.flexDirection = 'column';
        pdfCard.style.gap = '10px';

        const iframe = document.createElement('iframe');
        iframe.src = pdfTargetUrl;
        iframe.style.width = '100%';
        iframe.style.height = '520px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        pdfCard.appendChild(iframe);

        const pdfFooter = document.createElement('div');
        pdfFooter.className = 'glass-card';
        pdfFooter.style.padding = '10px 16px';
        pdfFooter.style.display = 'flex';
        pdfFooter.style.justifyContent = 'space-between';
        pdfFooter.style.alignItems = 'center';
        pdfFooter.style.flexWrap = 'wrap';
        pdfFooter.style.gap = '10px';
        pdfFooter.innerHTML = `
            <div style="font-size: 13px; color: var(--text-secondary);">
                <i class="fas fa-file-pdf" style="color: var(--danger);"></i> <strong>${escapeHTML(note.title)}</strong> (.PDF Document)
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="${viewUrl}" target="_blank" class="btn btn-outline btn-sm">
                    <i class="fas fa-external-link-alt"></i> Open PDF in New Window
                </a>
                <button type="button" class="btn btn-primary btn-sm" id="modalFooterPdfDownloadBtn">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        `;
        pdfFooter.querySelector('#modalFooterPdfDownloadBtn').addEventListener('click', () => downloadNoteFile(note));
        pdfCard.appendChild(pdfFooter);

        previewContainer.appendChild(pdfCard);
        return;
    }

    // 3. Text Notes Preview
    if (note.type === 'txt') {
        try {
            const res = await fetch(viewUrl);
            if (res.ok) {
                const text = await res.text();
                previewContainer.innerHTML = '';
                const box = document.createElement('pre');
                box.className = 'preview-text-box';
                box.style.maxHeight = '500px';
                box.style.overflowY = 'auto';
                box.style.padding = '16px';
                box.style.background = 'rgba(0,0,0,0.03)';
                box.style.borderRadius = '8px';
                box.style.whiteSpace = 'pre-wrap';
                box.style.wordBreak = 'break-word';
                box.textContent = text;
                previewContainer.appendChild(box);
                return;
            }
        } catch (e) {}
    }

    // 4. Word / PowerPoint / Excel / Office Documents
    if (['doc', 'ppt', 'xls'].includes(note.type)) {
        previewContainer.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '14px';

        const embedUrl = (directUrl.startsWith('http://') || directUrl.startsWith('https://')) ? directUrl : (window.location.origin + viewUrl);
        const docsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(embedUrl)}&embedded=true`;

        const iframe = document.createElement('iframe');
        iframe.src = docsViewerUrl;
        iframe.style.width = '100%';
        iframe.style.height = '440px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        wrapper.appendChild(iframe);

        // Fallback helper info card in case viewer has "No preview available"
        const noticeBox = document.createElement('div');
        noticeBox.className = 'glass-card';
        noticeBox.style.padding = '12px 18px';
        noticeBox.style.display = 'flex';
        noticeBox.style.justifyContent = 'space-between';
        noticeBox.style.alignItems = 'center';
        noticeBox.style.flexWrap = 'wrap';
        noticeBox.style.gap = '10px';
        noticeBox.innerHTML = `
            <div style="font-size: 13px;">
                <i class="fas fa-info-circle" style="color: var(--primary);"></i> 
                If document preview displays <em>"No preview available"</em> above, open or download directly:
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="${viewUrl}" target="_blank" class="btn btn-outline btn-sm">
                    <i class="fas fa-external-link-alt"></i> Open Document Window
                </a>
                <button type="button" class="btn btn-primary btn-sm" id="modalDocDownloadBtn">
                    <i class="fas fa-download"></i> Download ${escapeHTML(note.type.toUpperCase())}
                </button>
            </div>
        `;
        noticeBox.querySelector('#modalDocDownloadBtn').addEventListener('click', () => downloadNoteFile(note));
        wrapper.appendChild(noticeBox);

        previewContainer.appendChild(wrapper);
        return;
    }

    renderFallbackPreview(note);
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
            <p>Click <strong>Download Note</strong> below to open and view the file on your device.</p>
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
            showNotification(`✅ Downloaded ${downloadName}`);
            return;
        }
    } catch (err) {
        console.warn('Backend download error, falling back to direct link:', err.message);
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
    const shareUrl = `${window.location.origin}${window.location.pathname}?note=${encodeURIComponent(note.id)}`;
    const shareData = {
        title: note.title,
        text: `Check out "${note.title}" on ${note.subject} (${note.branch || note.classLevel || 'General'}) - MyNotes:`,
        url: shareUrl
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => copyToClipboard(shareUrl));
    } else {
        copyToClipboard(shareUrl);
    }
}

function checkSharedNoteQueryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedNoteId = urlParams.get('note');
    if (sharedNoteId && notesFeed.length > 0) {
        const found = notesFeed.find(n => n.id === sharedNoteId || n._id === sharedNoteId);
        if (found) {
            openNotePreview(found);
            showNotification(`Opened shared note: ${found.title}`);
        }
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Direct note link copied to clipboard!');
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

// Articles & Blog Reader Engine
async function loadArticles() {
    if (!articlesGrid) return;
    articlesGrid.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Loading educational articles & study guides...</p>';
    if (articleSingleContainer) articleSingleContainer.style.display = 'none';
    articlesGrid.style.display = 'grid';

    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        const data = await response.json();
        const articles = data.articles || [];

        if (articles.length === 0) {
            articlesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-newspaper"></i>
                    <h3>No articles published yet</h3>
                    <p>Check back soon for exam guides, syllabus breakdowns, and study tips!</p>
                </div>
            `;
            return;
        }

        articlesGrid.innerHTML = '';
        articles.forEach(art => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '20px';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 8px;">${escapeHTML(art.category || 'Study Guide')}</div>
                <h3 style="margin-bottom: 10px;">${escapeHTML(art.title)}</h3>
                <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">${escapeHTML(art.summary || '')}</p>
                <div style="font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                    <span><i class="fas fa-user"></i> ${escapeHTML(art.author || 'MyNotes Editorial')}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(art.createdAt).toLocaleDateString()}</span>
                </div>
            `;
            card.addEventListener('click', () => renderSingleArticle(art));
            articlesGrid.appendChild(card);
        });
    } catch (err) {
        articlesGrid.innerHTML = '<p class="error">Failed to load articles.</p>';
    }
}

function renderSingleArticle(art) {
    if (!articleSingleContainer || !articlesGrid) return;
    articlesGrid.style.display = 'none';
    articleSingleContainer.style.display = 'block';
    articleSingleContainer.innerHTML = `
        <button class="btn btn-outline btn-sm" id="backToArticlesBtn" style="margin-bottom: 15px;">
            <i class="fas fa-arrow-left"></i> Back to Articles
        </button>
        <div class="glass-card" style="padding: 24px;">
            <span class="badge badge-course" style="margin-bottom: 10px; display: inline-block;">${escapeHTML(art.category)}</span>
            <h2>${escapeHTML(art.title)}</h2>
            <div style="font-size: 13px; color: var(--text-secondary); margin: 10px 0 20px 0;">
                Published by <strong>${escapeHTML(art.author || 'Admin')}</strong> on ${new Date(art.createdAt).toLocaleDateString()}
            </div>
            <div class="article-content" style="line-height: 1.7; font-size: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                ${escapeHTML(art.content).replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
    document.getElementById('backToArticlesBtn').addEventListener('click', () => {
        articleSingleContainer.style.display = 'none';
        articlesGrid.style.display = 'grid';
    });
}

// Current Affairs & Daily Exam News Engine
async function loadCurrentAffairs(category = 'all') {
    if (!newsGrid) return;
    newsGrid.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Fetching current affairs & daily exam news...</p>';

    try {
        const url = category === 'all' ? `${API_BASE_URL}/current-affairs` : `${API_BASE_URL}/current-affairs?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        const newsList = data.news || [];

        if (newsList.length === 0) {
            newsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-globe-americas"></i>
                    <h3>No current affairs news available</h3>
                    <p>Click refresh or check back later.</p>
                </div>
            `;
            return;
        }

        newsGrid.innerHTML = '';
        newsList.forEach(news => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '18px';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';

            const tags = news.examTags || ['UPSC', 'GATE'];
            const tagsHTML = tags.map(t => `<span class="badge badge-subject" style="background: rgba(16, 185, 129, 0.1); color: #10b981; margin-right: 4px;">${escapeHTML(t)}</span>`).join('');

            card.innerHTML = `
                <div style="margin-bottom: 8px;">${tagsHTML}</div>
                <h4 style="margin-bottom: 8px;"><a href="${escapeHTML(news.url)}" target="_blank" style="color: inherit; text-decoration: none;">${escapeHTML(news.title)}</a></h4>
                <p style="font-size: 13px; color: var(--text-secondary); flex: 1; margin-bottom: 12px;">${escapeHTML(news.summary || '')}</p>
                <div style="font-size: 11px; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 8px;">
                    <span>Source: ${escapeHTML(news.source || 'News')}</span>
                    <span>${new Date(news.publishedAt).toLocaleDateString()}</span>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    } catch (err) {
        newsGrid.innerHTML = '<p class="error">Failed to load current affairs news.</p>';
    }
}

// Protected Admin Portal Handlers
async function handleAdminLogin(e) {
    e.preventDefault();
    const username = adminUsernameInput.value.trim();
    const password = adminPasswordInput.value;

    if (!username || !password) {
        showNotification('Please enter admin credentials', true);
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
            if (data.user && data.user.role === 'admin') {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateRoleUI();
                switchNavTab('admin');
                showNotification('Admin Authenticated Successfully');
            } else {
                showNotification('Access denied. Administrator privileges required.', true);
            }
        } else {
            showNotification(data.message || 'Admin login failed', true);
        }
    } catch (err) {
        showNotification('Connection error during admin login', true);
    }
}

async function loadAdminDashboard() {
    if (!authToken) return;

    try {
        const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
            const stats = await res.json();
            if (statTotalUsers) statTotalUsers.textContent = stats.totalUsers || 0;
            if (statTotalNotes) statTotalNotes.textContent = stats.totalNotes || 0;
            if (statTotalDownloads) statTotalDownloads.textContent = stats.totalDownloads || 0;
            if (statPendingReports) statPendingReports.textContent = stats.pendingReports || 0;
        }
    } catch (e) {}

    loadAdminUsers();
}

async function loadAdminUsers() {
    if (!adminUsersTableBody || !authToken) return;
    adminUsersTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px;">Loading registered users...</td></tr>';

    try {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        const users = data.users || [];

        adminUsersTableBody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 10px; font-weight: 600;">${escapeHTML(u.username)}</td>
                <td style="padding: 10px;">${escapeHTML(u.email)}</td>
                <td style="padding: 10px;"><span class="badge badge-course">${escapeHTML(u.role || 'user')}</span></td>
                <td style="padding: 10px;">${escapeHTML(u.status || 'active')}</td>
                <td style="padding: 10px;">
                    <button class="btn btn-outline btn-sm toggle-role-btn" data-id="${u.id}">Toggle Role</button>
                    <button class="btn btn-danger-outline btn-sm delete-user-btn" data-id="${u.id}">Delete</button>
                </td>
            `;
            tr.querySelector('.toggle-role-btn').addEventListener('click', () => toggleUserRole(u.id, u.role === 'admin' ? 'user' : 'admin'));
            tr.querySelector('.delete-user-btn').addEventListener('click', () => deleteAdminUser(u.id));
            adminUsersTableBody.appendChild(tr);
        });
    } catch (e) {
        adminUsersTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px; color: var(--danger);">Failed to load users.</td></tr>';
    }
}

async function toggleUserRole(userId, newRole) {
    try {
        await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ role: newRole })
        });
        showNotification(`Role updated to ${newRole}`);
        loadAdminUsers();
    } catch (e) {
        showNotification('Failed to update user role', true);
    }
}

async function deleteAdminUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        showNotification('User deleted');
        loadAdminUsers();
    } catch (e) {
        showNotification('Failed to delete user', true);
    }
}

async function loadAdminNotes() {
    if (!adminNotesTableBody || !authToken) return;
    adminNotesTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px;">Loading notes feed...</td></tr>';

    try {
        const res = await fetch(`${API_BASE_URL}/admin/notes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        const notes = data.files || data.notes || [];

        adminNotesTableBody.innerHTML = '';
        notes.forEach(n => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 10px; font-weight: 600;">${escapeHTML(n.title)}</td>
                <td style="padding: 10px;">${escapeHTML(n.uploader || 'Student')}</td>
                <td style="padding: 10px;">${escapeHTML(n.subject || n.branch || n.category || 'General')}</td>
                <td style="padding: 10px;">${n.downloadCount || 0}</td>
                <td style="padding: 10px; display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm admin-edit-note-btn"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger-outline btn-sm admin-delete-note-btn"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            tr.querySelector('.admin-edit-note-btn').addEventListener('click', () => openEditNoteModal(n));
            tr.querySelector('.admin-delete-note-btn').addEventListener('click', async () => {
                if (!confirm(`Delete note "${n.title}"?`)) return;
                await fetch(`${API_BASE_URL}/admin/notes/${n.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                showNotification('Note deleted by Admin');
                loadAdminNotes();
                loadSharedNotesFeed();
            });
            adminNotesTableBody.appendChild(tr);
        });
    } catch (e) {
        adminNotesTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px;">Failed to load notes.</td></tr>';
    }
}

function openEditNoteModal(note) {
    const editModal = document.getElementById('editNoteModal');
    if (!editModal) return;
    
    document.getElementById('editNoteId').value = note.id;
    document.getElementById('editNoteTitle').value = note.title || '';
    document.getElementById('editNoteEducation').value = note.educationLevel || 'Engineering';
    document.getElementById('editNoteBranch').value = note.branch || '';
    document.getElementById('editNoteSubject').value = note.subject || '';
    document.getElementById('editNoteSemester').value = note.semester || '';
    document.getElementById('editNoteCategory').value = note.category || 'Class Notes';
    document.getElementById('editNoteDescription').value = note.description || '';

    editModal.classList.add('active');
}

async function handleEditNoteSubmit(e) {
    e.preventDefault();
    const noteId = document.getElementById('editNoteId').value;
    const title = document.getElementById('editNoteTitle').value.trim();
    const educationLevel = document.getElementById('editNoteEducation').value;
    const branch = document.getElementById('editNoteBranch').value.trim();
    const subject = document.getElementById('editNoteSubject').value.trim();
    const semester = document.getElementById('editNoteSemester').value.trim();
    const category = document.getElementById('editNoteCategory').value;
    const description = document.getElementById('editNoteDescription').value.trim();

    if (!title || !subject) {
        showNotification('Title and Subject are required', true);
        return;
    }

    try {
        const url = (currentUser && currentUser.role === 'admin') ? `${API_BASE_URL}/admin/notes/${noteId}` : `${API_BASE_URL}/files/${noteId}`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ title, educationLevel, branch, subject, semester, category, description })
        });
        const data = await res.json();
        if (res.ok) {
            showNotification('Note document updated successfully!');
            document.getElementById('editNoteModal').classList.remove('active');
            loadSharedNotesFeed();
            if (currentUser && currentUser.role === 'admin') {
                loadAdminNotes();
            }
        } else {
            showNotification(data.message || 'Failed to update note', true);
        }
    } catch (err) {
        showNotification('Error updating note details', true);
    }
}

async function loadAdminReports() {
    if (!adminReportsTableBody || !authToken) return;
    adminReportsTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px;">Loading content reports...</td></tr>';

    try {
        const res = await fetch(`${API_BASE_URL}/admin/reports`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await res.json();
        const reports = data.reports || [];

        adminReportsTableBody.innerHTML = '';
        if (reports.length === 0) {
            adminReportsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 15px;">No pending content reports.</td></tr>';
            return;
        }

        reports.forEach(r => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 10px; font-weight: 600;">${escapeHTML(r.fileTitle || r.fileId)}</td>
                <td style="padding: 10px;">${escapeHTML(r.reason)}</td>
                <td style="padding: 10px;">${escapeHTML(r.details || '')}</td>
                <td style="padding: 10px;"><span class="badge badge-subject">${escapeHTML(r.status)}</span></td>
                <td style="padding: 10px; display: flex; gap: 6px;">
                    <button class="btn btn-primary btn-sm resolve-report-btn">Resolve</button>
                    <button class="btn btn-danger-outline btn-sm delete-reported-note-btn">Delete Note</button>
                </td>
            `;
            tr.querySelector('.resolve-report-btn').addEventListener('click', async () => {
                await fetch(`${API_BASE_URL}/admin/reports/${r.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                    body: JSON.stringify({ status: 'resolved' })
                });
                showNotification('Report marked as resolved');
                loadAdminReports();
            });
            tr.querySelector('.delete-reported-note-btn').addEventListener('click', async () => {
                if (!confirm('Delete reported file from platform?')) return;
                await fetch(`${API_BASE_URL}/admin/notes/${r.fileId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                await fetch(`${API_BASE_URL}/admin/reports/${r.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                    body: JSON.stringify({ status: 'resolved' })
                });
                showNotification('Reported note deleted and report resolved');
                loadAdminReports();
            });
            adminReportsTableBody.appendChild(tr);
        });
    } catch (e) {
        adminReportsTableBody.innerHTML = '<tr><td colspan="5" style="padding: 10px;">Failed to load reports.</td></tr>';
    }
}

async function handleCreateArticle(e) {
    e.preventDefault();
    const title = document.getElementById('articleTitleInput').value.trim();
    const category = document.getElementById('articleCategoryInput').value.trim();
    const summary = document.getElementById('articleSummaryInput').value.trim();
    const content = document.getElementById('articleContentInput').value.trim();
    const tags = document.getElementById('articleTagsInput').value.trim().split(',').map(t => t.trim()).filter(Boolean);

    try {
        const res = await fetch(`${API_BASE_URL}/admin/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ title, category, summary, content, tags })
        });
        if (res.ok) {
            showNotification('Article published successfully!');
            adminArticleForm.reset();
            loadArticles();
        } else {
            showNotification('Failed to publish article', true);
        }
    } catch (e) {
        showNotification('Error publishing article', true);
    }
}

async function handleSyncNews() {
    if (!authToken) return;
    try {
        showNotification('Fetching and caching current affairs news...');
        const res = await fetch(`${API_BASE_URL}/admin/news/fetch`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (res.ok) {
            showNotification('News updated successfully!');
            loadCurrentAffairs();
        } else {
            showNotification('Failed to sync news', true);
        }
    } catch (e) {
        showNotification('Error syncing news', true);
    }
}

function updateConnectionStatus(status, msg) {
    if (!connectionStatus || !connectionText) return;
    connectionStatus.className = 'connection-status ' + status;
    connectionText.textContent = msg;
    if (status === 'connected') {
        setTimeout(() => {
            if (connectionStatus.classList.contains('connected')) {
                connectionStatus.style.opacity = '0';
                connectionStatus.style.pointerEvents = 'none';
            }
        }, 3000);
    } else {
        connectionStatus.style.opacity = '1';
        connectionStatus.style.pointerEvents = 'auto';
    }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', init);
