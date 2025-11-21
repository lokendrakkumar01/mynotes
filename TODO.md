# TODO List for Notes Manager Fixes

## 1. Fix Edit and Delete Button Visibility on Desktop
- [x] Hide rename button on desktop by adding `display: none;` to `.rename-btn` in style.css

## 2. Add Share Option for PDFs Only
- [x] Modify `createFileCard()` in script.js to show share button only for PDF files
- [x] Add event listener for share button in script.js

## 3. Add Video Upload Support
- [x] Add "Videos" filter button in index.html
- [x] Add video file icon styling in style.css (purple background)
- [x] Update `getFileType()` in script.js to detect video files
- [x] Update `getFileIconClass()` in script.js to include video icon
- [x] Update `previewFile()` in script.js to handle video previews
- [x] Ensure video files are accepted in file input (update accept attribute if needed)

## 4. Testing
- [ ] Test layout on desktop for button visibility
- [ ] Test PDF sharing functionality
- [ ] Test video upload and preview
