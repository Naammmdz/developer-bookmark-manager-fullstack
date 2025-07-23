// Background service worker for DevBookmarks extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('DevBookmarks extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
        apiUrl: 'http://localhost:8080'
    });
});

// Handle context menu for quick bookmark saving
chrome.contextMenus.create({
    id: 'save-to-devbookmarks',
    title: 'Save to DevBookmarks',
    contexts: ['page', 'link']
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'save-to-devbookmarks') {
        // Check if user is logged in
        const result = await chrome.storage.sync.get(['token']);
        
        if (!result.token) {
            // Open popup to login
            chrome.action.openPopup();
            return;
        }

        // If clicking on a link, save the link URL
        const url = info.linkUrl || tab.url;
        const title = info.linkText || tab.title;
        
        // Store the data temporarily and open popup
        await chrome.storage.local.set({
            pendingBookmark: {
                url,
                title,
                timestamp: Date.now()
            }
        });
        
        chrome.action.openPopup();
    }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'save-bookmark') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Store current tab data
        await chrome.storage.local.set({
            pendingBookmark: {
                url: tab.url,
                title: tab.title,
                timestamp: Date.now()
            }
        });
        
        chrome.action.openPopup();
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPendingBookmark') {
        chrome.storage.local.get(['pendingBookmark']).then(result => {
            sendResponse(result.pendingBookmark);
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'clearPendingBookmark') {
        chrome.storage.local.remove(['pendingBookmark']);
        sendResponse({ success: true });
    }
});

// Update badge based on authentication status
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.token) {
        updateBadge(!!changes.token.newValue);
    }
});

function updateBadge(isLoggedIn) {
    if (isLoggedIn) {
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
    } else {
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    }
}

// Initialize badge on startup
chrome.storage.sync.get(['token']).then(result => {
    updateBadge(!!result.token);
});
