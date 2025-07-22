#!/usr/bin/env node

import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { BookmarkManagerApiClient } from './api-client.js';
import { BookmarkRequest, CollectionRequest } from './types.js';

// Load environment variables from .env file
dotenv.config();

const apiBaseUrl = process.env.BOOKMARK_API_BASE_URL || 'http://localhost:8080/api';
const apiUsername = process.env.BOOKMARK_API_USERNAME || 'admin';
const apiPassword = process.env.BOOKMARK_API_PASSWORD || 'admin123';

class BookmarkManagerMCPServer {
  private server: Server;
  private apiClient: BookmarkManagerApiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'bookmark-manager-mcp-server',
        version: '1.0.0',
      }
    );

    this.apiClient = new BookmarkManagerApiClient(apiBaseUrl);
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_bookmarks',
            description: 'Get all bookmarks or filter by query, tags, or collection',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Filter by tags' },
                collectionId: { type: 'number', description: 'Filter by collection ID' },
                limit: { type: 'number', description: 'Maximum number of results' },
                offset: { type: 'number', description: 'Offset for pagination' }
              },
              additionalProperties: false
            }
          },
          {
            name: 'get_bookmark',
            description: 'Get a specific bookmark by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'Bookmark ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'create_bookmark',
            description: 'Create a new bookmark',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Bookmark title' },
                url: { type: 'string', description: 'Bookmark URL' },
                description: { type: 'string', description: 'Bookmark description' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Bookmark tags' },
                collectionId: { type: 'number', description: 'Collection ID' }
              },
              required: ['title', 'url'],
              additionalProperties: false
            }
          },
          {
            name: 'update_bookmark',
            description: 'Update an existing bookmark',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'Bookmark ID' },
                title: { type: 'string', description: 'Bookmark title' },
                url: { type: 'string', description: 'Bookmark URL' },
                description: { type: 'string', description: 'Bookmark description' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Bookmark tags' },
                collectionId: { type: 'number', description: 'Collection ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'delete_bookmark',
            description: 'Delete a bookmark by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'Bookmark ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'get_collections',
            description: 'Get all collections',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'create_collection',
            description: 'Create a new collection',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Collection name' },
                description: { type: 'string', description: 'Collection description' },
                color: { type: 'string', description: 'Collection color' }
              },
              required: ['name'],
              additionalProperties: false
            }
          },
          {
            name: 'search_bookmarks',
            description: 'Search bookmarks by query',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' }
              },
              required: ['query'],
              additionalProperties: false
            }
          }
        ] as Tool[]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_bookmarks':
            const bookmarks = await this.apiClient.getBookmarks(args || {});
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(bookmarks, null, 2)
                }
              ]
            };

          case 'get_bookmark':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            const bookmark = await this.apiClient.getBookmark(args.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(bookmark, null, 2)
                }
              ]
            };

          case 'create_bookmark':
            if (!args || typeof args !== 'object') {
              throw new Error('Missing bookmark data');
            }
            const newBookmark = await this.apiClient.createBookmark(args as unknown as BookmarkRequest);
            return {
              content: [
                {
                  type: 'text',
                  text: `Bookmark created successfully: ${JSON.stringify(newBookmark, null, 2)}`
                }
              ]
            };

          case 'update_bookmark':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            const { id, ...updateData } = args as any;
            const updatedBookmark = await this.apiClient.updateBookmark(id, updateData);
            return {
              content: [
                {
                  type: 'text',
                  text: `Bookmark updated successfully: ${JSON.stringify(updatedBookmark, null, 2)}`
                }
              ]
            };

          case 'delete_bookmark':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            await this.apiClient.deleteBookmark(args.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: `Bookmark with ID ${args.id} deleted successfully`
                }
              ]
            };

          case 'get_collections':
            const collections = await this.apiClient.getCollections();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(collections, null, 2)
                }
              ]
            };

          case 'create_collection':
            if (!args || typeof args !== 'object') {
              throw new Error('Missing collection data');
            }
            const newCollection = await this.apiClient.createCollection(args as unknown as CollectionRequest);
            return {
              content: [
                {
                  type: 'text',
                  text: `Collection created successfully: ${JSON.stringify(newCollection, null, 2)}`
                }
              ]
            };

          case 'search_bookmarks':
            if (!args || typeof args !== 'object' || !('query' in args)) {
              throw new Error('Missing required parameter: query');
            }
            const searchResults = await this.apiClient.searchBookmarks(args.query as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(searchResults, null, 2)
                }
              ]
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async start() {
    // Login to the bookmark manager API
    try {
      await this.apiClient.login({ username: apiUsername, password: apiPassword });
      console.error('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }

    // Connect to MCP communication using stdio
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Bookmark Manager MCP Server started');
  }
}

// Start the server
const server = new BookmarkManagerMCPServer();
server.start().catch(console.error);

