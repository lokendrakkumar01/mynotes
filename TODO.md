# TODO List for Notes Manager Fixes

## 1. Fix Edit and Delete Button Visibility on Desktop
- [ ] Remove `display: none;` from `.delete-btn` in style.css

## 2. Add Share Option for PDFs Only
- [ ] Modify `createFileCard()` in script.js to show share button only for PDF files
- [ ] Add event listener for share button in script.js

## 3. Add Video Upload Support
- [ ] Add "Videos" filter button in index.html
- [ ] Add video file icon styling in style.css (purple background)
- [ ] Update `getFileType()` in script.js to detect video files
- [ ] Update `getFileIconClass()` in script.js to include video icon
- [ ] Update `previewFile()` in script.js to handle video previews
- [ ] Ensure video files are accepted in file input (update accept attribute if needed)

## 4. Testing
- [ ] Test layout on desktop for button visibility
- [ ] Test PDF sharing functionality
- [ ] Test video upload and preview
