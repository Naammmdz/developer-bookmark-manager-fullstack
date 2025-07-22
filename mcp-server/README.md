# Bookmark Manager MCP Server

A Model Context Protocol (MCP) server that provides tools for managing bookmarks through your existing bookmark manager application.

## Features

This MCP server provides the following tools:

- **get_bookmarks** - Retrieve all bookmarks with optional filtering
- **get_bookmark** - Get a specific bookmark by ID
- **create_bookmark** - Create a new bookmark
- **update_bookmark** - Update an existing bookmark
- **delete_bookmark** - Delete a bookmark
- **get_collections** - Get all bookmark collections
- **create_collection** - Create a new collection
- **search_bookmarks** - Search bookmarks by query

## Prerequisites

- Node.js (version 18 or higher)
- Your bookmark manager backend running on `http://localhost:8080`
- Valid admin credentials for the bookmark manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
BOOKMARK_API_BASE_URL=http://localhost:8080/api
BOOKMARK_API_USERNAME=admin
BOOKMARK_API_PASSWORD=admin123
```

3. Build the project:
```bash
npm run build
```

## Usage

Run the MCP server:
```bash
npm start
```

Or run in development mode:
```bash
npm run dev
```

The server will connect to your bookmark manager backend and provide MCP tools for bookmark management.

## MCP Client Configuration

To use this server with an MCP client, configure it with:

```json
{
  "name": "bookmark-manager",
  "command": "node",
  "args": ["path/to/mcp-server/dist/index.js"]
}
```

## Available Tools

### get_bookmarks
Retrieve bookmarks with optional filtering.

**Parameters:**
- `query` (optional): Search query
- `tags` (optional): Array of tags to filter by
- `collectionId` (optional): Collection ID to filter by
- `limit` (optional): Maximum number of results
- `offset` (optional): Offset for pagination

### create_bookmark
Create a new bookmark.

**Parameters:**
- `title` (required): Bookmark title
- `url` (required): Bookmark URL
- `description` (optional): Bookmark description
- `tags` (optional): Array of tags
- `collectionId` (optional): Collection ID

### search_bookmarks
Search bookmarks by query.

**Parameters:**
- `query` (required): Search query string

## License

MIT
