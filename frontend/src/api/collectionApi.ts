import api from './apiClient';
import { Collection } from '../types';

// API calls for collections
// These functions interact with the backend API to manage collections
// Get all collections
export const getCollections = () => api.get<Collection[]>('/collections').then(r => r.data);    

// Add a new collection
// Accepts a Collection object without 'id' and 'count' fields  
export const addCollection = (col: Omit<Collection, 'id' | 'count'>) =>
  api.post<Collection>('/collections', col).then(r => r.data);

// Delete a collection by ID
// Accepts an ID and returns a promise that resolves when the collection is deleted
export const deleteCollection = (id: number) =>
  api.delete<void>(`/collections/${id}`).then(r => r.data);

// Update a collection by ID
// Accepts an ID and a partial Collection object with changes to apply
export const updateCollection = (id: number, changes: Partial<Collection>) =>
  api.patch<Collection>(`/collections/${id}`, changes).then(r => r.data);

// Reorder collections
// Accepts an array of collection IDs in the new order
export const reorderCollections = (order: number[]) =>
  api.post<void>('/collections/reorder', { order }).then(r => r.data);

// Fetch a collection by ID
// Returns a promise that resolves to the Collection object
export const fetchCollectionById = (id: number): Promise<Collection> =>
  api.get<Collection>(`/collections/${id}`).then(r => r.data);
