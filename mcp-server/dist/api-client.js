import axios from 'axios';
export class BookmarkManagerApiClient {
    api;
    token = null;
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor to include auth token
        this.api.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });
    }
    // Authentication methods
    async login(credentials) {
        const response = await this.api.post('/auth/login', credentials);
        this.token = response.data.token;
        return response.data;
    }
    async logout() {
        this.token = null;
    }
    // Bookmark methods
    async getBookmarks(filter) {
        const params = new URLSearchParams();
        if (filter?.query)
            params.append('query', filter.query);
        if (filter?.tags)
            params.append('tags', filter.tags.join(','));
        if (filter?.collectionId)
            params.append('collectionId', filter.collectionId.toString());
        if (filter?.startDate)
            params.append('startDate', filter.startDate);
        if (filter?.endDate)
            params.append('endDate', filter.endDate);
        if (filter?.limit)
            params.append('limit', filter.limit.toString());
        if (filter?.offset)
            params.append('offset', filter.offset.toString());
        const response = await this.api.get(`/bookmarks?${params}`);
        return response.data;
    }
    async getBookmark(id) {
        const response = await this.api.get(`/bookmarks/${id}`);
        return response.data;
    }
    async createBookmark(bookmark) {
        const response = await this.api.post('/bookmarks', bookmark);
        return response.data;
    }
    async updateBookmark(id, bookmark) {
        const response = await this.api.put(`/bookmarks/${id}`, bookmark);
        return response.data;
    }
    async deleteBookmark(id) {
        await this.api.delete(`/bookmarks/${id}`);
    }
    async searchBookmarks(query) {
        const response = await this.api.get(`/bookmarks/search?q=${encodeURIComponent(query)}`);
        return response.data;
    }
    // Collection methods
    async getCollections() {
        const response = await this.api.get('/collections');
        return response.data;
    }
    async getCollection(id) {
        const response = await this.api.get(`/collections/${id}`);
        return response.data;
    }
    async createCollection(collection) {
        const response = await this.api.post('/collections', collection);
        return response.data;
    }
    async updateCollection(id, collection) {
        const response = await this.api.put(`/collections/${id}`, collection);
        return response.data;
    }
    async deleteCollection(id) {
        await this.api.delete(`/collections/${id}`);
    }
    // CodeBlock methods
    async getCodeBlocks() {
        const response = await this.api.get('/codeblocks');
        return response.data;
    }
    async getCodeBlock(id) {
        const response = await this.api.get(`/codeblocks/${id}`);
        return response.data;
    }
    async createCodeBlock(codeBlock) {
        const response = await this.api.post('/codeblocks', codeBlock);
        return response.data;
    }
    async updateCodeBlock(id, codeBlock) {
        const response = await this.api.put(`/codeblocks/${id}`, codeBlock);
        return response.data;
    }
    async deleteCodeBlock(id) {
        await this.api.delete(`/codeblocks/${id}`);
    }
    async toggleFavoriteCodeBlock(id) {
        const response = await this.api.patch(`/codeblocks/${id}/favorite`);
        return response.data;
    }
    async searchCodeBlocks(query, collection) {
        const params = new URLSearchParams();
        params.append('q', query);
        if (collection) {
            params.append('collection', collection);
        }
        const response = await this.api.get(`/codeblocks/search?${params}`);
        return response.data;
    }
    async getCodeBlocksByCollection(collection) {
        const response = await this.api.get(`/codeblocks/collection/${encodeURIComponent(collection)}`);
        return response.data;
    }
    async getFavoriteCodeBlocks() {
        const response = await this.api.get('/codeblocks/favorites');
        return response.data;
    }
    async getCodeBlocksByLanguage(language) {
        const response = await this.api.get(`/codeblocks/language/${encodeURIComponent(language)}`);
        return response.data;
    }
    async getCodeBlockCollections() {
        const response = await this.api.get('/codeblocks/collections');
        return response.data;
    }
    async getCodeBlockCountByCollection(collection) {
        const response = await this.api.get(`/codeblocks/collection/${encodeURIComponent(collection)}/count`);
        return response.data;
    }
    // User methods (admin only)
    async getUsers() {
        const response = await this.api.get('/admin/users');
        return response.data;
    }
    async getUser(id) {
        const response = await this.api.get(`/admin/users/${id}`);
        return response.data;
    }
    // Health check
    async healthCheck() {
        try {
            await this.api.get('/test');
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=api-client.js.map