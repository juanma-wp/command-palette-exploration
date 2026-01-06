import { registerPlugin } from "@wordpress/plugins";
import { createRoot } from "@wordpress/element";
import { useCommandLoader } from "@wordpress/commands";
import domReady from "@wordpress/dom-ready";

import registerHandbookLinksCommands from "./components/handbookLinks";
import { usePluginCommands } from "./components/pluginActions";
import { LatestPostsCommand } from "./components/latestPosts";
import CopyPostContent from "./components/copyPostContent";
import BlockUsageCommand from "./components/blockUsage";

// 1- Register global commands - for all pages in the Admin area (using dispatcher)
registerHandbookLinksCommands();

// 2- Register all Block Editor commands together
const CommandsContainer = () => {
  return (
    <>
      <CopyPostContent />
      <BlockUsageCommand />
    </>
  );
};

registerPlugin("command-api-exploration", {
  render: CommandsContainer,
});

// 3- Register plugin actions command with custom hydration
const PluginActionsCommand = () => {
  useCommandLoader({
    name: "myplugin/plugin-actions-loader",
    hook: usePluginCommands,
  });

  return null;
};

domReady(() => {
  const container = document.createElement("div");
  container.id = "myplugin-global-commands";
  document.body.appendChild(container);
  createRoot(container).render(
    <>
      <PluginActionsCommand />
      <LatestPostsCommand />
    </>
  );
});