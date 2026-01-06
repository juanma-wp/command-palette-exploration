# Command Palette Exploration

A WordPress plugin that demonstrates how to extend the Command Palette API with custom commands. The Command Palette (triggered with `⌘K` or `Ctrl+K`) allows users to quickly access actions and navigate WordPress admin.

## Features

This plugin showcases **five different command types** using various registration methods:

### 📚 Handbook Links
Quick access to WordPress developer documentation directly from the command palette:
- Block Editor Handbook
- Plugin Developer Handbook  
- Theme Developer Handbook
- REST API Handbook

### 🔌 Plugin Actions
Activate or deactivate any installed plugin directly from the command palette. Only available outside the block editor context.

### 📝 Latest Posts
Opens a modal showing the 5 most recently modified posts with:
- Creation and modification dates
- Quick links to view or edit each post

### 📋 Copy Post Content
Copies the current post's block content to your clipboard. Only available when editing a post with content.

### 📊 Block Usage
Displays a breakdown of all blocks used in the current post/page, including nested blocks. Only available for viewable post types.

## Installation

1. Clone or download this repository into your WordPress `wp-content/plugins/` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. Activate the plugin in WordPress admin

## Development

Start the development server with hot reloading:

```bash
npm run start
```

Build for production:

```bash
npm run build
```

## How It Works

This plugin demonstrates three different approaches to registering commands with the WordPress Command Palette API:

### 1. Global Commands via Dispatcher

Use `dispatch(commandsStore).registerCommand()` for commands that should be available across all admin pages:

```javascript
import { dispatch } from "@wordpress/data";
import { store as commandsStore } from "@wordpress/commands";

dispatch(commandsStore).registerCommand({
  name: "my-plugin/my-command",
  label: "My Command",
  callback: () => { /* action */ },
});
```

### 2. Context-Aware Commands via `useCommand`

Use the `useCommand` hook for commands tied to specific contexts (e.g., only in the editor):

```javascript
import { useCommand } from "@wordpress/commands";

useCommand({
  name: "my-plugin/editor-command",
  label: "Editor Command",
  context: "entity-edit", // Only in post/page editor
  callback: ({ close }) => { /* action */ },
});
```

### 3. Dynamic Commands via `useCommandLoader`

Use `useCommandLoader` for commands that need to be generated dynamically based on data:

```javascript
import { useCommandLoader } from "@wordpress/commands";

useCommandLoader({
  name: "my-plugin/dynamic-loader",
  hook: useMyCustomCommands, // Returns { commands, isLoading }
});
```

## Command Contexts

- **Global**: Available everywhere in WordPress admin
- `site-editor`: Available in the Site Editor
- `entity-edit`: Available when editing posts, pages, or other entities

## Requirements

- WordPress 6.3+ (Command Palette API)
- Node.js 18+
- npm 9+

## Dependencies

- `@wordpress/scripts` - Build tooling
- `@wordpress/icons` - Icon components
- `await-to-js` - Async/await error handling utility

## License

GPL-2.0-or-later

