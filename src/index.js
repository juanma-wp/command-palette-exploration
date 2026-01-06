import { registerPlugin } from "@wordpress/plugins";

import registerHandbookLinksCommands from "./components/handbookLinks";
import LatestPostsCommand from "./components/latestPosts";
import CopyPostContent from "./components/copyPostContent";
import BlockUsageCommand from "./components/blockUsage";

// 1- Register handbook links commands - for all pages in the Admin area (using dispatcher)
registerHandbookLinksCommands();

// 2- Register all React-based commands together
const CommandsContainer = () => {
  return (
    <>
      <LatestPostsCommand />
      <CopyPostContent />
      <BlockUsageCommand />
    </>
  );
};

registerPlugin("command-api-exploration", {
  render: CommandsContainer,
});