import { dispatch } from "@wordpress/data";
import { store as commandsStore } from "@wordpress/commands";

const handbookLinks = [
  {
    name: "block-editor",
    label: "Block Editor Handbook",
    url: "https://developer.wordpress.org/block-editor/",
  },
  {
    name: "plugin-dev",
    label: "Plugin Developer Handbook",
    url: "https://developer.wordpress.org/plugins/",
  },
  {
    name: "theme-dev",
    label: "Theme Developer Handbook",
    url: "https://developer.wordpress.org/themes/",
  },
  {
    name: "rest-api",
    label: "REST API Handbook",
    url: "https://developer.wordpress.org/rest-api/",
  },
];

export default function registerHandbookLinksCommands() { 
  handbookLinks.forEach((link) => {
    dispatch(commandsStore).registerCommand({
      name: `command-api-exploration/docs/${link.name}`,
      label: `${link.label}`,
      keywords: ["Docs", "Developer Documentation"],
      callback: () => window.open(link.url, "_blank"),
    });
  });
}
