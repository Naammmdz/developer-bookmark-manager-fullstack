import api from './apiClient';
import { CodeBlock } from '../types';

// API calls for code blocks
// These functions interact with the backend API to manage code blocks

// Get all code blocks
export const getCodeBlocks = () => api.get<CodeBlock[]>('/codeblocks').then(r => r.data);

// Get code blocks by collection
export const getCodeBlocksByCollection = (collection: string) => 
  api.get<CodeBlock[]>(`/codeblocks/collection/${encodeURIComponent(collection)}`).then(r => r.data);

// Get favorite code blocks
export const getFavoriteCodeBlocks = () => 
  api.get<CodeBlock[]>('/codeblocks/favorites').then(r => r.data);

// Get code block by ID
export const getCodeBlockById = (id: number) => 
  api.get<CodeBlock>(`/codeblocks/${id}`).then(r => r.data);

// Add a new code block
export const addCodeBlock = (codeBlock: Omit<CodeBlock, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.post<CodeBlock>('/codeblocks', codeBlock).then(r => r.data);

// Update a code block by ID
export const updateCodeBlock = (id: number, codeBlock: Omit<CodeBlock, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.put<CodeBlock>(`/codeblocks/${id}`, codeBlock).then(r => r.data);

// Delete a code block by ID
export const deleteCodeBlock = (id: number) =>
  api.delete<void>(`/codeblocks/${id}`).then(r => r.data);

// Toggle favorite status of a code block
export const toggleFavoriteCodeBlock = (id: number) =>
  api.patch<CodeBlock>(`/codeblocks/${id}/favorite`).then(r => r.data);

// Search code blocks
export const searchCodeBlocks = (query: string, collection?: string) => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (collection) {
    params.append('collection', collection);
  }
  return api.get<CodeBlock[]>(`/codeblocks/search?${params.toString()}`).then(r => r.data);
};

// Get code blocks by programming language
export const getCodeBlocksByLanguage = (language: string) =>
  api.get<CodeBlock[]>(`/codeblocks/language/${encodeURIComponent(language)}`).then(r => r.data);

// Get distinct collections used by user
export const getDistinctCollections = () =>
  api.get<string[]>('/codeblocks/collections').then(r => r.data);

// Get code block count for a collection
export const getCodeBlockCountByCollection = (collection: string) =>
  api.get<number>(`/codeblocks/collection/${encodeURIComponent(collection)}/count`).then(r => r.data);
