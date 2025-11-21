# TODO List for Notes Manager Backend Integration

## Backend Setup
- [x] Create package.json with required dependencies
- [x] Create .env file with MongoDB connection string and password
- [x] Install npm packages
- [x] Create server.js with MongoDB connection and API endpoints
- [x] Set up user authentication (register/login)
- [x] Set up file upload functionality
- [x] Create API endpoints for CRUD operations on files

## Frontend Integration
- [ ] Update script.js to use API calls instead of localStorage
- [ ] Modify authentication functions to use backend API
- [ ] Update file upload to send files to server
- [ ] Update file management functions (delete, rename, etc.)
- [ ] Add error handling for API calls
- [ ] Update file preview to fetch from server

## Database Operations
- [ ] Ensure all user registration data is stored in MongoDB
- [ ] Ensure all login activities are logged in MongoDB
- [ ] Ensure all file uploads are stored in MongoDB
- [ ] Create endpoints to retrieve all documents from database
- [ ] Add user activity tracking

## Testing
- [ ] Test user registration and login with MongoDB
- [ ] Test file upload and storage in MongoDB
- [ ] Test file retrieval and display
- [ ] Test file operations (delete, rename)
- [ ] Verify all data is properly stored in database
