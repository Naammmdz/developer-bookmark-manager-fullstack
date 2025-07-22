export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  favicon?: string;
  createdAt: string;
  updatedAt: string;
  collectionId?: number;
  userId: number;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  color?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  bookmarks?: Bookmark[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface BookmarkRequest {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  collectionId?: number;
}

export interface CollectionRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface CodeBlock {
  id: number;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  collection?: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  userEmail: string;
}

export interface CodeBlockRequest {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  collection?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
}

export interface SearchFilter {
  query?: string;
  tags?: string[];
  collectionId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}
