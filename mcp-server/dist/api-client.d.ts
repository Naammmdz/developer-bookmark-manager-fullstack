import { Bookmark, Collection, User, AuthResponse, LoginRequest, BookmarkRequest, CollectionRequest, SearchFilter, CodeBlock, CodeBlockRequest } from './types.js';
export declare class BookmarkManagerApiClient {
    private api;
    private token;
    constructor(baseURL: string);
    login(credentials: LoginRequest): Promise<AuthResponse>;
    logout(): Promise<void>;
    getBookmarks(filter?: SearchFilter): Promise<Bookmark[]>;
    getBookmark(id: number): Promise<Bookmark>;
    createBookmark(bookmark: BookmarkRequest): Promise<Bookmark>;
    updateBookmark(id: number, bookmark: Partial<BookmarkRequest>): Promise<Bookmark>;
    deleteBookmark(id: number): Promise<void>;
    searchBookmarks(query: string): Promise<Bookmark[]>;
    getCollections(): Promise<Collection[]>;
    getCollection(id: number): Promise<Collection>;
    createCollection(collection: CollectionRequest): Promise<Collection>;
    updateCollection(id: number, collection: Partial<CollectionRequest>): Promise<Collection>;
    deleteCollection(id: number): Promise<void>;
    getCodeBlocks(): Promise<CodeBlock[]>;
    getCodeBlock(id: number): Promise<CodeBlock>;
    createCodeBlock(codeBlock: CodeBlockRequest): Promise<CodeBlock>;
    updateCodeBlock(id: number, codeBlock: Partial<CodeBlockRequest>): Promise<CodeBlock>;
    deleteCodeBlock(id: number): Promise<void>;
    toggleFavoriteCodeBlock(id: number): Promise<CodeBlock>;
    searchCodeBlocks(query: string, collection?: string): Promise<CodeBlock[]>;
    getCodeBlocksByCollection(collection: string): Promise<CodeBlock[]>;
    getFavoriteCodeBlocks(): Promise<CodeBlock[]>;
    getCodeBlocksByLanguage(language: string): Promise<CodeBlock[]>;
    getCodeBlockCollections(): Promise<string[]>;
    getCodeBlockCountByCollection(collection: string): Promise<number>;
    getUsers(): Promise<User[]>;
    getUser(id: number): Promise<User>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=api-client.d.ts.map