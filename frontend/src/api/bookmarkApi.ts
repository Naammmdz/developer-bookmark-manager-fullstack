import api from './apiClient';
import { Bookmark} from '../types';

// API calls for bookmarks
// These functions interact with the backend API to manage bookmarks

// Get all bookmarks
// Returns a promise that resolves to an array of Bookmark objects
export const getBookmarks = () => api.get<Bookmark[]>('/bookmarks').then(r => r.data);

// Add a new bookmark
// Accepts a Bookmark object without 'id' and 'createdAt' fields
export const addBookmark = (bm: Omit<Bookmark,'id'|'createdAt'>) =>
  api.post<Bookmark>('/bookmarks', bm).then(r => r.data);

// Delete a bookmark by ID
// Accepts an ID and returns a promise that resolves when the bookmark is deleted
export const deleteBookmark = (id: number) =>
  api.delete<void>(`/bookmarks/${id}`).then(r => r.data);

// Update a bookmark by ID
// Accepts an ID and a partial Bookmark object with changes to apply
export const updateBookmark = (id: number, changes: Partial<Bookmark>) =>
  api.patch<Bookmark>(`/bookmarks/${id}`, changes).then(r => r.data);
