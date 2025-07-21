// src/services/BookmarkService.js

import axios from 'axios';

const API = '/api/bookmarks';
const token = localStorage.getItem('token');

const headers = {
  Authorization: `Bearer ${token}`,
};

const BookmarkService = {
  getBookmarksByCollectionId: (collectionId) =>
    axios.get(`/api/collections/${collectionId}/bookmarks`, { headers }),

  addBookmarkToCollection: (collectionId, bookmarkData) =>
    axios.post(`/api/collections/${collectionId}/bookmarks`, bookmarkData, { headers }),

  removeBookmarkFromCollection: (collectionId, bookmarkId) =>
    axios.delete(`/api/collections/${collectionId}/bookmarks/${bookmarkId}`, { headers }),

  // Các API khác nếu có...
};

export default BookmarkService;
