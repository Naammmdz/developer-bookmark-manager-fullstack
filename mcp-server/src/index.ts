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
import { BookmarkRequest, CollectionRequest, CodeBlockRequest } from './types.js';

// Load environment variables from .env file
dotenv.config();

const apiBaseUrl = process.env.BOOKMARK_API_BASE_URL || 'http://localhost:8080/api';
const apiUsername = process.env.BOOKMARK_API_USERNAME || 'admin';
const apiPassword = process.env.BOOKMARK_API_PASSWORD || 'admin123';

class DeveloperResourcesMCPServer {
  private server: Server;
  private apiClient: BookmarkManagerApiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'developer-resources-mcp-server',
        version: '2.0.0',
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
          },
          // CodeBlock tools
          {
            name: 'get_codeblocks',
            description: 'Get all code blocks for the authenticated user',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'get_codeblock',
            description: 'Get a specific code block by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'CodeBlock ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'create_codeblock',
            description: 'Create a new code block',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Code block title' },
                code: { type: 'string', description: 'Code content' },
                language: { type: 'string', description: 'Programming language' },
                description: { type: 'string', description: 'Code block description' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Code block tags' },
                collection: { type: 'string', description: 'Collection name' },
                isPublic: { type: 'boolean', description: 'Is code block public' },
                isFavorite: { type: 'boolean', description: 'Is code block favorite' }
              },
              required: ['title', 'code', 'language'],
              additionalProperties: false
            }
          },
          {
            name: 'update_codeblock',
            description: 'Update an existing code block',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'CodeBlock ID' },
                title: { type: 'string', description: 'Code block title' },
                code: { type: 'string', description: 'Code content' },
                language: { type: 'string', description: 'Programming language' },
                description: { type: 'string', description: 'Code block description' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Code block tags' },
                collection: { type: 'string', description: 'Collection name' },
                isPublic: { type: 'boolean', description: 'Is code block public' },
                isFavorite: { type: 'boolean', description: 'Is code block favorite' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'delete_codeblock',
            description: 'Delete a code block by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'CodeBlock ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'toggle_favorite_codeblock',
            description: 'Toggle favorite status of a code block',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'number', description: 'CodeBlock ID' }
              },
              required: ['id'],
              additionalProperties: false
            }
          },
          {
            name: 'search_codeblocks',
            description: 'Search code blocks by query',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                collection: { type: 'string', description: 'Filter by collection' }
              },
              required: ['query'],
              additionalProperties: false
            }
          },
          {
            name: 'get_codeblocks_by_collection',
            description: 'Get code blocks by collection',
            inputSchema: {
              type: 'object',
              properties: {
                collection: { type: 'string', description: 'Collection name' }
              },
              required: ['collection'],
              additionalProperties: false
            }
          },
          {
            name: 'get_favorite_codeblocks',
            description: 'Get favorite code blocks',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'get_codeblocks_by_language',
            description: 'Get code blocks by programming language',
            inputSchema: {
              type: 'object',
              properties: {
                language: { type: 'string', description: 'Programming language' }
              },
              required: ['language'],
              additionalProperties: false
            }
          },
          {
            name: 'get_codeblock_collections',
            description: 'Get distinct collections used for code blocks',
            inputSchema: {
              type: 'object',
              properties: {},
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

          // CodeBlock tool handlers
          case 'get_codeblocks':
            const codeBlocks = await this.apiClient.getCodeBlocks();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlocks, null, 2)
                }
              ]
            };

          case 'get_codeblock':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            const codeBlock = await this.apiClient.getCodeBlock(args.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlock, null, 2)
                }
              ]
            };

          case 'create_codeblock':
            if (!args || typeof args !== 'object') {
              throw new Error('Missing code block data');
            }
            const newCodeBlock = await this.apiClient.createCodeBlock(args as unknown as CodeBlockRequest);
            return {
              content: [
                {
                  type: 'text',
                  text: `Code block created successfully: ${JSON.stringify(newCodeBlock, null, 2)}`
                }
              ]
            };

          case 'update_codeblock':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            const { id: codeBlockId, ...codeBlockUpdateData } = args as any;
            const updatedCodeBlock = await this.apiClient.updateCodeBlock(codeBlockId, codeBlockUpdateData);
            return {
              content: [
                {
                  type: 'text',
                  text: `Code block updated successfully: ${JSON.stringify(updatedCodeBlock, null, 2)}`
                }
              ]
            };

          case 'delete_codeblock':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            await this.apiClient.deleteCodeBlock(args.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: `Code block with ID ${args.id} deleted successfully`
                }
              ]
            };

          case 'toggle_favorite_codeblock':
            if (!args || typeof args !== 'object' || !('id' in args)) {
              throw new Error('Missing required parameter: id');
            }
            const toggledCodeBlock = await this.apiClient.toggleFavoriteCodeBlock(args.id as number);
            return {
              content: [
                {
                  type: 'text',
                  text: `Code block favorite status toggled: ${JSON.stringify(toggledCodeBlock, null, 2)}`
                }
              ]
            };

          case 'search_codeblocks':
            if (!args || typeof args !== 'object' || !('query' in args)) {
              throw new Error('Missing required parameter: query');
            }
            const codeBlockSearchResults = await this.apiClient.searchCodeBlocks(
              args.query as string,
              args.collection as string | undefined
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlockSearchResults, null, 2)
                }
              ]
            };

          case 'get_codeblocks_by_collection':
            if (!args || typeof args !== 'object' || !('collection' in args)) {
              throw new Error('Missing required parameter: collection');
            }
            const codeBlocksByCollection = await this.apiClient.getCodeBlocksByCollection(args.collection as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlocksByCollection, null, 2)
                }
              ]
            };

          case 'get_favorite_codeblocks':
            const favoriteCodeBlocks = await this.apiClient.getFavoriteCodeBlocks();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(favoriteCodeBlocks, null, 2)
                }
              ]
            };

          case 'get_codeblocks_by_language':
            if (!args || typeof args !== 'object' || !('language' in args)) {
              throw new Error('Missing required parameter: language');
            }
            const codeBlocksByLanguage = await this.apiClient.getCodeBlocksByLanguage(args.language as string);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlocksByLanguage, null, 2)
                }
              ]
            };

          case 'get_codeblock_collections':
            const codeBlockCollections = await this.apiClient.getCodeBlockCollections();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(codeBlockCollections, null, 2)
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
    console.error('Developer Resources MCP Server started');
  }
}

// Start the server
const server = new DeveloperResourcesMCPServer();
server.start().catch(console.error);

