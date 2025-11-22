# TODO: Fix GitHub Login Network Error and Ensure Data Saving

## Information Gathered
- Backend (server.js): Implements GitHub OAuth using passport-github2. Routes: /auth/github (initiates login), /auth/github/callback (handles callback, redirects to http://localhost:3001?token=...). Saves user data to MongoDB on first login.
- Frontend (index.html, script.js): Currently only supports username/password login via /api/auth/login and /api/auth/register, which don't exist in backend. No GitHub login integration.
- Issue: Frontend calls non-existent API endpoints, causing "Network error". Backend has GitHub auth but frontend doesn't use it. No static file serving for frontend.
- Goal: Integrate GitHub login in frontend, serve frontend files from backend, handle auth flow, ensure user data saves to DB.

## Plan
- Update server.js: Add static file serving for index.html, script.js, style.css, and any other frontend assets.
- Update index.html: Add a GitHub login button to the login form.
- Update script.js: Add GitHub login handler (redirect to /auth/github), check for token in URL on page load, set authToken, fetch user profile, load files. Remove or adjust local login/register if not needed, or keep as alternative.
- Ensure backend routes for notes, upload, profile work with GitHub auth.
- Test: Run server, open frontend, login via GitHub, verify data saves and no errors.

## Dependent Files to Edit
- server.js: Add static serving, ensure CORS allows frontend.
- index.html: Add GitHub button.
- script.js: Add GitHub auth logic, handle token from URL.

## Followup Steps
- Run server: `npm start` or `node server.js`.
- Open browser to http://localhost:3000 (serve frontend).
- Test GitHub login: Click button, authenticate, check if redirected back with token, data loads.
- Verify data saving: Check MongoDB for user and notes.
- If issues, debug network calls.
