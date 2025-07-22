# Developer Resources MCP Server

A Model Context Protocol (MCP) server that provides comprehensive tools for managing developer resources including bookmarks AND code blocks through your developer resources management application.

## Features

This MCP server provides comprehensive tools for managing developer resources:

### 📖 Bookmark Management
- **get_bookmarks** - Retrieve all bookmarks with optional filtering
- **get_bookmark** - Get a specific bookmark by ID
- **create_bookmark** - Create a new bookmark
- **update_bookmark** - Update an existing bookmark
- **delete_bookmark** - Delete a bookmark
- **search_bookmarks** - Search bookmarks by query

### 💻 Code Block Management  
- **get_codeblocks** - Retrieve all code blocks for the user
- **get_codeblock** - Get a specific code block by ID
- **create_codeblock** - Create a new code block with syntax highlighting
- **update_codeblock** - Update an existing code block
- **delete_codeblock** - Delete a code block
- **toggle_favorite_codeblock** - Toggle favorite status of a code block
- **search_codeblocks** - Search code blocks by query
- **get_codeblocks_by_collection** - Get code blocks by collection
- **get_favorite_codeblocks** - Get favorite code blocks
- **get_codeblocks_by_language** - Get code blocks by programming language
- **get_codeblock_collections** - Get distinct collections for code blocks

### 🗂️ Collection Management
- **get_collections** - Get all collections
- **create_collection** - Create a new collection

## Prerequisites

- Node.js (version 18 or higher)
- Your developer resources backend running on `http://localhost:8080`
- Valid admin credentials for the application

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

The server will connect to your developer resources backend and provide MCP tools for managing both bookmarks and code blocks.

## MCP Client Configuration

To use this server with an MCP client, configure it with:

```json
{
  "name": "developer-resources",
  "command": "node",
  "args": ["path/to/mcp-server/dist/index.js"]
}
```

## Example Usage with Claude Desktop

Once configured, you can interact with your developer resources naturally:

**Managing Bookmarks:**
- "Show me my bookmarks"
- "Create a bookmark for https://github.com/microsoft/vscode with title 'VS Code Repository'"
- "Search for bookmarks about Python"

**Managing Code Blocks:**
- "Show me my JavaScript code blocks"
- "Create a code block with a Python function for sorting arrays"
- "Find code blocks in my 'algorithms' collection"
- "Get my favorite code snippets"

## Key Tool Examples

### create_codeblock
Create a new code block with syntax highlighting.

**Parameters:**
- `title` (required): Code block title
- `code` (required): Code content
- `language` (required): Programming language (e.g., 'javascript', 'python', 'java')
- `description` (optional): Code block description
- `tags` (optional): Array of tags
- `collection` (optional): Collection name
- `isPublic` (optional): Whether code block is public
- `isFavorite` (optional): Whether code block is favorite

### search_codeblocks
Search code blocks by query with optional collection filtering.

**Parameters:**
- `query` (required): Search query string
- `collection` (optional): Filter by collection name

## License

MIT
