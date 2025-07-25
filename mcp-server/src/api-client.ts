import axios, { AxiosInstance } from 'axios';
import { 
  Bookmark, 
  Collection, 
  User, 
  AuthResponse, 
  LoginRequest, 
  BookmarkRequest, 
  CollectionRequest, 
  SearchFilter,
  CodeBlock,
  CodeBlockRequest
} from './types.js';

export class BookmarkManagerApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
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
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    this.token = response.data.token;
    return response.data;
  }

  async logout(): Promise<void> {
    this.token = null;
  }

  // Bookmark methods
  async getBookmarks(filter?: SearchFilter): Promise<Bookmark[]> {
    const params = new URLSearchParams();
    if (filter?.query) params.append('query', filter.query);
    if (filter?.tags) params.append('tags', filter.tags.join(','));
    if (filter?.collectionId) params.append('collectionId', filter.collectionId.toString());
    if (filter?.startDate) params.append('startDate', filter.startDate);
    if (filter?.endDate) params.append('endDate', filter.endDate);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const response = await this.api.get<Bookmark[]>(`/bookmarks?${params}`);
    return response.data;
  }

  async getBookmark(id: number): Promise<Bookmark> {
    const response = await this.api.get<Bookmark>(`/bookmarks/${id}`);
    return response.data;
  }

  async createBookmark(bookmark: BookmarkRequest): Promise<Bookmark> {
    const response = await this.api.post<Bookmark>('/bookmarks', bookmark);
    return response.data;
  }

  async updateBookmark(id: number, bookmark: Partial<BookmarkRequest>): Promise<Bookmark> {
    const response = await this.api.put<Bookmark>(`/bookmarks/${id}`, bookmark);
    return response.data;
  }

  async deleteBookmark(id: number): Promise<void> {
    await this.api.delete(`/bookmarks/${id}`);
  }

  async searchBookmarks(query: string): Promise<Bookmark[]> {
    const response = await this.api.get<Bookmark[]>(`/bookmarks/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Collection methods
  async getCollections(): Promise<Collection[]> {
    const response = await this.api.get<Collection[]>('/collections');
    return response.data;
  }

  async getCollection(id: number): Promise<Collection> {
    const response = await this.api.get<Collection>(`/collections/${id}`);
    return response.data;
  }

  async createCollection(collection: CollectionRequest): Promise<Collection> {
    const response = await this.api.post<Collection>('/collections', collection);
    return response.data;
  }

  async updateCollection(id: number, collection: Partial<CollectionRequest>): Promise<Collection> {
    const response = await this.api.put<Collection>(`/collections/${id}`, collection);
    return response.data;
  }

  async deleteCollection(id: number): Promise<void> {
    await this.api.delete(`/collections/${id}`);
  }

  // CodeBlock methods
  async getCodeBlocks(): Promise<CodeBlock[]> {
    const response = await this.api.get<CodeBlock[]>('/codeblocks');
    return response.data;
  }

  async getCodeBlock(id: number): Promise<CodeBlock> {
    const response = await this.api.get<CodeBlock>(`/codeblocks/${id}`);
    return response.data;
  }

  async createCodeBlock(codeBlock: CodeBlockRequest): Promise<CodeBlock> {
    const response = await this.api.post<CodeBlock>('/codeblocks', codeBlock);
    return response.data;
  }

  async updateCodeBlock(id: number, codeBlock: Partial<CodeBlockRequest>): Promise<CodeBlock> {
    const response = await this.api.put<CodeBlock>(`/codeblocks/${id}`, codeBlock);
    return response.data;
  }

  async deleteCodeBlock(id: number): Promise<void> {
    await this.api.delete(`/codeblocks/${id}`);
  }

  async toggleFavoriteCodeBlock(id: number): Promise<CodeBlock> {
    const response = await this.api.patch<CodeBlock>(`/codeblocks/${id}/favorite`);
    return response.data;
  }

  async searchCodeBlocks(query: string, collection?: string): Promise<CodeBlock[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (collection) {
      params.append('collection', collection);
    }
    const response = await this.api.get<CodeBlock[]>(`/codeblocks/search?${params}`);
    return response.data;
  }

  async getCodeBlocksByCollection(collection: string): Promise<CodeBlock[]> {
    const response = await this.api.get<CodeBlock[]>(`/codeblocks/collection/${encodeURIComponent(collection)}`);
    return response.data;
  }

  async getFavoriteCodeBlocks(): Promise<CodeBlock[]> {
    const response = await this.api.get<CodeBlock[]>('/codeblocks/favorites');
    return response.data;
  }

  async getCodeBlocksByLanguage(language: string): Promise<CodeBlock[]> {
    const response = await this.api.get<CodeBlock[]>(`/codeblocks/language/${encodeURIComponent(language)}`);
    return response.data;
  }

  async getCodeBlockCollections(): Promise<string[]> {
    const response = await this.api.get<string[]>('/codeblocks/collections');
    return response.data;
  }

  async getCodeBlockCountByCollection(collection: string): Promise<number> {
    const response = await this.api.get<number>(`/codeblocks/collection/${encodeURIComponent(collection)}/count`);
    return response.data;
  }

  // User methods (admin only)
  async getUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/admin/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.api.get<User>(`/admin/users/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/test');
      return true;
    } catch {
      return false;
    }
  }
}
