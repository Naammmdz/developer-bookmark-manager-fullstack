# MCP Integration Guide

This guide shows how to integrate your Bookmark Manager MCP server with various MCP-compatible clients.

## Quick Setup

Run the setup script to automatically configure Claude Desktop:

```powershell
.\setup-mcp.ps1
```

## Manual Integration Options

### 1. Claude Desktop

Claude Desktop has built-in MCP support and is the easiest to set up.

#### Configuration Location:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration:
```json
{
  "mcpServers": {
    "bookmark-manager": {
      "command": "node",
      "args": ["E:\\developer-bookmark-manager-fullstack\\mcp-server\\dist\\index.js"],
      "env": {
        "BOOKMARK_API_BASE_URL": "http://localhost:8080/api",
        "BOOKMARK_API_USERNAME": "admin",
        "BOOKMARK_API_PASSWORD": "admin123"
      }
    }
  }
}
```

#### Usage:
After restarting Claude Desktop, you can:
- "Get my bookmarks"
- "Create a new bookmark for https://example.com with title 'Example Site'"
- "Search for bookmarks about JavaScript"
- "Show me my bookmark collections"

### 2. Continue.dev (VSCode Extension)

Continue.dev supports MCP servers through custom configurations.

#### Configuration:
Add to your Continue.dev config:

```json
{
  "models": [...],
  "mcpServers": [
    {
      "name": "bookmark-manager",
      "command": "node",
      "args": ["E:\\developer-bookmark-manager-fullstack\\mcp-server\\dist\\index.js"]
    }
  ]
}
```

### 3. Custom MCP Client

If you're building your own MCP client, here's how to connect:

#### Node.js Example:
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

const serverProcess = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  cwd: 'E:\\developer-bookmark-manager-fullstack\\mcp-server'
});

const transport = new StdioClientTransport({
  stdin: serverProcess.stdin,
  stdout: serverProcess.stdout
});

const client = new Client({
  name: 'bookmark-client',
  version: '1.0.0'
});

await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log('Available tools:', tools);

// Call a tool
const result = await client.callTool({
  name: 'get_bookmarks',
  arguments: { limit: 10 }
});
console.log('Bookmarks:', result);
```

### 4. Other MCP Clients

Any MCP-compatible client can use this server. Common configuration pattern:

```json
{
  "name": "bookmark-manager",
  "command": "node",
  "args": ["path/to/mcp-server/dist/index.js"],
  "env": {
    "BOOKMARK_API_BASE_URL": "http://localhost:8080/api",
    "BOOKMARK_API_USERNAME": "admin",
    "BOOKMARK_API_PASSWORD": "admin123"
  }
}
```

## Available Tools

Your MCP server provides these tools:

| Tool | Description | Required Parameters |
|------|-------------|-------------------|
| `get_bookmarks` | Retrieve bookmarks with filtering | None (all optional) |
| `get_bookmark` | Get specific bookmark by ID | `id` |
| `create_bookmark` | Create new bookmark | `title`, `url` |
| `update_bookmark` | Update existing bookmark | `id` |
| `delete_bookmark` | Delete bookmark | `id` |
| `get_collections` | Get bookmark collections | None |
| `create_collection` | Create new collection | `name` |
| `search_bookmarks` | Search bookmarks | `query` |

## Example Usage with Claude Desktop

Once configured, you can interact with your bookmarks naturally:

**User**: "Show me my bookmarks"
**Claude**: *Uses get_bookmarks tool and displays results*

**User**: "Create a bookmark for https://github.com/microsoft/vscode with title 'VS Code Repository'"
**Claude**: *Uses create_bookmark tool*

**User**: "Search for bookmarks about Python"
**Claude**: *Uses search_bookmarks tool*

## Troubleshooting

### Common Issues:

1. **Server not starting**: Make sure your bookmark manager backend is running
2. **Authentication failed**: Check your credentials in the `.env` file
3. **Tools not showing**: Restart your MCP client after configuration
4. **Permission errors**: Ensure the MCP server has permission to access the API

### Debug Mode:

Run the server directly to see debug output:
```bash
npm run dev
```

### Test the API Connection:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Next Steps

1. Start your bookmark manager backend
2. Configure your preferred MCP client
3. Test the integration with simple commands
4. Explore advanced features like filtering and collections

For more information about MCP, visit: https://modelcontextprotocol.io/
