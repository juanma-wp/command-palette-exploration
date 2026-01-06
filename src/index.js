import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import registerHandbookLinksCommands from "./commands/handbookLinks";
import LatestPostsCommand from "./commands/latestPosts";
import CopyPostContent from "./commands/copyPostContent";
import BlockUsageCommand from "./commands/blockUsage";

// 1- Register handbook links commands - for all pages in the Admin area (using dispatcher)
registerHandbookLinksCommands();    

// 2- Render the latest posts command - for all pages in the Admin area (using Hooks)
domReady(() => {
  const container = document.createElement("div");
  container.id = "myplugin-global-hook-commands";
  document.body.appendChild(container);
  createRoot(container).render(<LatestPostsCommand />);
});

// 3- Copy post content to clipboard - for pages only in the Block Editor (using registerPlugin)
registerPlugin("command-api-exploration-copy-post-content", {
  render: CopyPostContent,
});

// 4- Block usage - for pages only in the Block Editor (using registerPlugin)
registerPlugin("command-api-exploration-block-usage", {
  render: BlockUsageCommand,
});