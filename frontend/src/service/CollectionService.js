// src/services/CollectionService.js

import axios from 'axios';

const API = '/api/collections';

const getAllCollections = () => axios.get(API);
const getCollectionById = (id) => axios.get(`${API}/${id}`);
const createCollection = (data) => axios.post(API, data);
const updateCollection = (id, data) => axios.put(`${API}/${id}`, data);
const deleteCollection = (id) => axios.delete(`${API}/${id}`);
const getBookmarksInCollection = (id) => axios.get(`${API}/${id}/bookmarks`);
const addBookmarkToCollection = (id, bookmarkData) =>
  axios.post(`${API}/${id}/bookmarks`, bookmarkData);
const removeBookmarkFromCollection = (collectionId, bookmarkId) =>
  axios.delete(`${API}/${collectionId}/bookmarks/${bookmarkId}`);

export default {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getBookmarksInCollection,
  addBookmarkToCollection,
  removeBookmarkFromCollection,
};
