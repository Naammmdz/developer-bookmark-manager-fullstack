# DevBookmarks - Quick Save Extension

A Chrome extension to quickly save bookmarks to your DevBookmarks manager.

## Features

- **Quick Save**: Save bookmarks with one click from the extension popup
- **Auto-fill**: Automatically fills in the current page title and URL
- **Collections**: Choose which collection to save your bookmark to
- **Tags**: Add tags to organize your bookmarks
- **Context Menu**: Right-click to save bookmarks (when logged in)
- **Keyboard Shortcut**: Use Ctrl+Shift+S (Cmd+Shift+S on Mac) to quickly save
- **Status Badge**: Shows login status in the extension icon

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `browser-extension` folder
4. The extension will appear in your extensions list

## Usage

1. **First Time Setup**:
   - Click the extension icon in your Chrome toolbar
   - Click "⚙️ Settings" to configure your API URL if needed (default: http://localhost:8080)
   - Enter your DevBookmarks username and password to login

2. **Save a Bookmark**:
   - Navigate to any webpage
   - Click the extension icon
   - The title and URL will be auto-filled
   - Add a description and tags if desired
   - Select a collection
   - Click "Save Bookmark"

3. **Quick Save Methods**:
   - **Extension Icon**: Click the extension icon in toolbar
   - **Keyboard Shortcut**: Press Ctrl+Shift+S (Cmd+Shift+S on Mac)
   - **Context Menu**: Right-click on any page and select "Save to DevBookmarks"

## Configuration

- **API URL**: Set your DevBookmarks API URL in settings (default: http://localhost:8080)
- **Auto-Login**: The extension remembers your login credentials
- **Badge Status**: 
  - Green ✓: Logged in and ready
  - Red !: Not logged in

## Development

The extension consists of:

- `manifest.json`: Extension configuration
- `popup.html/css/js`: Main user interface
- `background.js`: Background service worker for context menu and shortcuts
- `content.js`: Content script (currently minimal)

## API Integration

The extension integrates with your DevBookmarks API:

- `POST /api/auth/login`: User authentication
- `POST /api/auth/me/{token}`: Check authentication status
- `GET /api/collections`: Load user collections
- `POST /api/bookmarks`: Save new bookmarks

## Troubleshooting

1. **Login Issues**: Check that your API URL is correct in settings
2. **Collections Not Loading**: Ensure you're logged in and your API is running
3. **Extension Not Working**: Check Chrome's extension page for any errors

## Keyboard Shortcuts

- **Ctrl+Shift+S** (Windows/Linux) or **Cmd+Shift+S** (Mac): Quick save current page
- **Enter**: Submit forms in the popup (login or save bookmark)

## Permissions

The extension requires these permissions:
- `activeTab`: To get current page information
- `storage`: To save settings and authentication
- `contextMenus`: To add right-click context menu
- `host_permissions`: To communicate with your DevBookmarks API
