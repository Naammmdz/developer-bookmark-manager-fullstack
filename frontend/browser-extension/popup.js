// Extension popup functionality
class DevBookmarksExtension {
    constructor() {
        this.apiUrl = 'http://localhost:8080';
        this.token = null;
        this.collections = [];
        this.bookmarks = [];
        this.currentTab = null;
        this.currentView = 'add';
        this.searchQuery = '';
        this.selectedCollection = '';
        this.sortBy = 'recent';
        
        this.init();
    }

    async init() {
        // Load settings
        await this.loadSettings();
        
        // Get current tab info
        await this.getCurrentTab();
        
        // Check authentication
        await this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['apiUrl', 'token']);
            if (result.apiUrl) {
                this.apiUrl = result.apiUrl;
            }
            if (result.token) {
                this.token = result.token;
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({
                apiUrl: this.apiUrl,
                token: this.token
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
            
            // Update UI with current page info
            document.getElementById('pageTitle').textContent = tab.title;
            document.getElementById('pageUrl').textContent = tab.url;
            document.getElementById('bookmarkTitle').value = tab.title;
        } catch (error) {
            console.error('Failed to get current tab:', error);
        }
    }

    async checkAuth() {
        if (!this.token) {
            this.showLoginSection();
            return;
        }

        try {
            // Use POST with token as path variable
            const encodedToken = encodeURIComponent(this.token);
            const response = await this.makeRequest(`/api/auth/me/${encodedToken}`, 'POST');
            if (response.ok) {
                this.showBookmarkSection();
                await this.loadCollections();
            } else {
                this.showLoginSection();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showLoginSection();
        }
    }

    async login(username, password) {
        try {
            const response = await this.makeRequest('/api/auth/login', 'POST', {
                username,
                password
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                await this.saveSettings();
                this.showBookmarkSection();
                await this.loadCollections();
                this.showSuccess('Login successful!');
            } else {
                const error = await response.text();
                this.showError('loginError', error || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showError('loginError', 'Login failed: ' + error.message);
        }
    }

    async loadCollections() {
        try {
            const response = await this.makeRequest('/api/collections', 'GET');
            if (response.ok) {
                this.collections = await response.json();
                this.populateCollectionsDropdown();
            }
        } catch (error) {
            console.error('Failed to load collections:', error);
        }
    }

    populateCollectionsDropdown() {
        const select = document.getElementById('bookmarkCollection');
        select.innerHTML = '<option value="">Select a collection</option>';
        
        this.collections.forEach(collection => {
            const option = document.createElement('option');
            option.value = collection.id;
            option.textContent = collection.name;
            select.appendChild(option);
        });
    }

    async saveBookmark() {
        const title = document.getElementById('bookmarkTitle').value.trim();
        const description = document.getElementById('bookmarkDescription').value.trim();
        const collectionId = document.getElementById('bookmarkCollection').value;
        const tagsText = document.getElementById('bookmarkTags').value.trim();
        
        if (!title) {
            this.showError('errorMessage', 'Title is required');
            return;
        }

        if (!collectionId) {
            this.showError('errorMessage', 'Please select a collection');
            return;
        }

        const tags = tagsText ? tagsText.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        const bookmarkData = {
            title,
            url: this.currentTab.url,
            description: description || null,
            collectionId: parseInt(collectionId),
            tags
        };

        try {
            this.setLoading(true);
            const response = await this.makeRequest('/api/bookmarks', 'POST', bookmarkData);
            
            if (response.ok) {
                this.showSuccess('Bookmark saved successfully!');
                // Clear form
                document.getElementById('bookmarkDescription').value = '';
                document.getElementById('bookmarkTags').value = '';
                document.getElementById('bookmarkCollection').value = '';
            } else {
                const error = await response.text();
                this.showError('errorMessage', error || 'Failed to save bookmark');
            }
        } catch (error) {
            console.error('Failed to save bookmark:', error);
            this.showError('errorMessage', 'Failed to save bookmark: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.apiUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        return fetch(url, options);
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // Login
        document.getElementById('loginBtn').addEventListener('click', async () => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                this.showError('loginError', 'Please enter username and password');
                return;
            }

            await this.login(username, password);
        });

        // Save bookmark
        document.getElementById('saveBtn').addEventListener('click', async () => {
            await this.saveBookmark();
        });

        // Open app
        document.getElementById('openAppBtn').addEventListener('click', () => {
            const appUrl = this.apiUrl.replace(':8080', ':5173') + '/app';
            chrome.tabs.create({ url: appUrl });
        });

        // Search and filter
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchQuery = document.getElementById('searchInput').value.trim();
            this.loadBookmarks();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchQuery = e.target.value.trim();
                this.loadBookmarks();
            }
        });

        document.getElementById('collectionFilter').addEventListener('change', (e) => {
            this.selectedCollection = e.target.value;
            this.loadBookmarks();
        });

        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.loadBookmarks();
        });

        // Collection management
        document.getElementById('addCollectionBtn').addEventListener('click', () => {
            this.showAddCollectionModal();
        });

        document.getElementById('closeCollectionModal').addEventListener('click', () => {
            this.hideAddCollectionModal();
        });

        document.getElementById('cancelCollectionBtn').addEventListener('click', () => {
            this.hideAddCollectionModal();
        });

        document.getElementById('saveCollectionBtn').addEventListener('click', async () => {
            await this.saveCollection();
        });

        // Settings toggle
        document.getElementById('settingsToggle').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Save settings
        document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
            const apiUrl = document.getElementById('apiUrl').value.trim();
            if (apiUrl) {
                this.apiUrl = apiUrl;
                await this.saveSettings();
                this.showSuccess('Settings saved!');
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Enter key handling
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const activeSection = document.querySelector('.login-section:not([style*="display: none"]), .bookmark-section:not([style*="display: none"]), .settings-section:not([style*="display: none"])');
                
                if (activeSection && activeSection.classList.contains('login-section')) {
                    document.getElementById('loginBtn').click();
                } else if (activeSection && activeSection.classList.contains('bookmark-section')) {
                    document.getElementById('saveBtn').click();
                }
            }
        });
    }

    switchView(view) {
        // Update current view
        this.currentView = view;

        // Update UI
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        const sections = ['add', 'browse', 'collections'];
        sections.forEach(section => {
            const sectionId = section.charAt(0).toUpperCase() + section.slice(1) + 'Section';
            document.getElementById(sectionId.toLowerCase()).style.display = section === view ? 'block' : 'none';
        });

        // Load data if needed
        if (view === 'browse') {
            this.loadBookmarks();
        } else if (view === 'collections') {
            this.loadCollections();
        }
    }

    async loadBookmarks() {
        try {
            this.setLoading(true);
            let endpoint = '/api/bookmarks?';
            if (this.searchQuery) {
                endpoint += `q=${encodeURIComponent(this.searchQuery)}&`;
            }
            if (this.selectedCollection) {
                endpoint += `collection=${this.selectedCollection}&`;
            }
            endpoint += `sort=${this.sortBy}`;

            const response = await this.makeRequest(endpoint, 'GET');
            if (response.ok) {
                this.bookmarks = await response.json();
                this.displayBookmarks();
            } else {
                throw new Error('Failed to load bookmarks');
            }
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
            this.showError('bookmarksLoading', 'Failed to load bookmarks.');
        } finally {
            this.setLoading(false);
        }
    }

    displayBookmarks() {
        const bookmarksList = document.getElementById('bookmarksList');
        bookmarksList.innerHTML = '';

        if (this.bookmarks.length === 0) {
            document.getElementById('noBookmarks').style.display = 'block';
            return;
        }

        document.getElementById('noBookmarks').style.display = 'none';

        this.bookmarks.forEach(bookmark => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.classList.add('bookmark-item');

            const title = bookmark.title || '(No Title)';
            const description = bookmark.description || '';

            bookmarkItem.innerHTML = `
                <div class="bookmark-title">${title}</div>
                <div class="bookmark-url">${bookmark.url}</div>
                <div class="bookmark-description">${description}</div>
                <div class="bookmark-meta">
                    <div class="bookmark-tags">
                        ${bookmark.tags.map(tag => `<span class="bookmark-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="bookmark-actions">
                        <button class="btn btn-secondary">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>
                </div>
            `;

            bookmarksList.appendChild(bookmarkItem);
        });
    }

    showAddCollectionModal() {
        document.getElementById('addCollectionModal').style.display = 'block';
    }

    hideAddCollectionModal() {
        document.getElementById('addCollectionModal').style.display = 'none';
    }

    async saveCollection() {
        const name = document.getElementById('collectionName').value.trim();
        const description = document.getElementById('collectionDescription').value.trim();
        if (!name) {
            this.showError('addCollectionModal', 'Collection name is required.');
            return;
        }

        try {
            const data = {
                name,
                description,
                icon: document.getElementById('collectionIcon').value
            };
            const response = await this.makeRequest('/api/collections', 'POST', data);
            if (response.ok) {
                this.showSuccess('Collection added successfully!');
                this.hideAddCollectionModal();
                this.loadCollections();
            } else {
                throw new Error('Failed to add collection');
            }
        } catch (error) {
            console.error('Failed to add collection:', error);
            this.showError('addCollectionModal', 'Failed to add collection.');
        }
    }

    displayCollections() {
        const collectionsList = document.getElementById('collectionsList');
        collectionsList.innerHTML = '';

        if (this.collections.length === 0) {
            collectionsList.innerHTML = '<div class="no-collections">No collections added yet.</div>';
            return;
        }

        this.collections.forEach(collection => {
            const collectionItem = document.createElement('div');
            collectionItem.classList.add('collection-item');
            collectionItem.innerHTML = `
                <div class="collection-header">
                    <div class="collection-title">
                        <span>${collection.name}</span>
                        <div class="collection-count">${collection.count || 0}</div>
                    </div>
                    <div class="collection-actions">
                        <button class="btn btn-secondary btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
                <div class="collection-description">${collection.description || ''}</div>
            `;
            collectionsList.appendChild(collectionItem);
        });
    }

    showLoginSection() {
        this.hideAllSections();
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('loginSection').classList.add('active');
        document.getElementById('logoutBtn').style.display = 'none';
        this.updateStatus('disconnected', 'Not logged in');
    }

    showBookmarkSection() {
        this.hideAllSections();
        
        // Show view tabs
        const viewTabs = document.getElementById('viewTabs');
        if (viewTabs) {
            viewTabs.style.display = 'flex';
        }
        
        // Show the default view (add)
        this.switchView('add');
        
        document.getElementById('logoutBtn').style.display = 'block';
        this.updateStatus('connected', 'Connected');
    }

    showSettingsSection() {
        this.hideAllSections();
        document.getElementById('settingsSection').style.display = 'block';
        document.getElementById('settingsSection').classList.add('active');
        document.getElementById('apiUrl').value = this.apiUrl;
    }

    hideAllSections() {
        const sections = ['loginSection', 'bookmarkSection', 'browseSection', 'collectionsSection', 'settingsSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
                section.classList.remove('active');
            }
        });
        
        // Hide view tabs
        const viewTabs = document.getElementById('viewTabs');
        if (viewTabs) {
            viewTabs.style.display = 'none';
        }
    }

    toggleSettings() {
        const settingsSection = document.getElementById('settingsSection');
        if (settingsSection.style.display === 'none' || !settingsSection.style.display) {
            this.showSettingsSection();
        } else {
            // Go back to previous section
            if (this.token) {
                this.showBookmarkSection();
            } else {
                this.showLoginSection();
            }
        }
    }

    updateStatus(status, text) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        statusDot.className = 'status-dot';
        if (status === 'connected') {
            statusDot.classList.add('connected');
        } else if (status === 'loading') {
            statusDot.classList.add('loading');
        }
        
        statusText.textContent = text;
    }

    setLoading(loading) {
        const saveBtn = document.getElementById('saveBtn');
        if (loading) {
            saveBtn.classList.add('loading');
            saveBtn.disabled = true;
        } else {
            saveBtn.classList.remove('loading');
            saveBtn.disabled = false;
        }
    }

    showSuccess(message) {
        const successElement = document.getElementById('successMessage');
        successElement.textContent = message;
        successElement.style.display = 'flex';
        
        // Hide after 3 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 3000);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    logout() {
        this.token = null;
        chrome.storage.sync.remove(['token']);
        this.showLoginSection();
    }
}

// Initialize the extension when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new DevBookmarksExtension();
});
