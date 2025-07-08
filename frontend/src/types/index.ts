export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  collection: string;
  isPublic: boolean;
  isFavorite: boolean;
  favicon: string;
  createdAt: string;
}

export interface Collection {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
}
