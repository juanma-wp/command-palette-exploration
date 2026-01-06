import { useEffect, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useCommandLoader } from "@wordpress/commands";
import { store as editorStore } from "@wordpress/editor";
import { plugins } from "@wordpress/icons";
import apiFetch from "@wordpress/api-fetch";
import to from "await-to-js";

/**
 * Fetches all installed WordPress plugins via the REST API.
 *
 * @return {Promise<Array>} Array of plugin objects with status, name, and plugin file info
 */
async function fetchPlugins() {
  return apiFetch({ path: "/wp/v2/plugins" });
}

/**
 * Toggles a plugin's activation status via the WordPress REST API.
 *
 * @param {string} action - The action to perform ("activate" or "deactivate")
 * @param {string} pluginFile - The plugin file identifier (e.g., "plugin-name/plugin-name.php")
 */
async function togglePlugin(action, pluginFile) {
  try {
    const status = action === "activate" ? "active" : "inactive";

    await apiFetch({
      path: `/wp/v2/plugins/${encodeURIComponent(pluginFile)}`,
      method: "POST",
      data: { status },
    });

    // Redirect to plugins page after successful toggle
    window.location.href = "plugins.php";
  } catch (error) {
    console.error(`Failed to ${action} plugin:`, error);
    window.location.href = "plugins.php";
  }
}

/**
 * Hook that returns plugin commands for useCommandLoader
 */
function usePluginCommands() {
  const [allPlugins, setAllPlugins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in the block editor by checking for current post
  const isBlockEditor = useSelect((select) => {
    try {
      const postId = select(editorStore)?.getCurrentPostId?.();
      return postId !== undefined && postId !== null;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Only fetch plugins if we're NOT in the block editor
    if (!isBlockEditor) {
      (async () => {
        const [error, plugins] = await to(fetchPlugins());
        if (!error && plugins) {
          setAllPlugins(plugins);
        }
        setIsLoading(false);
      })();
    } else {
      setIsLoading(false);
    }
  }, [isBlockEditor]);

  const commands = [];

  // Only register commands if NOT in block editor
  if (!isBlockEditor && !isLoading) {
    commands.push({
      name: "myplugin/open-settings",
      label: "Open Plugin Settings",
      callback: () => (window.location.href = "admin.php?page=myplugin-settings"),
    });

    allPlugins.forEach((plugin) => {
      const isActive = plugin.status === "active";
      const pluginSlug = plugin.plugin;
      const pluginName = plugin.name;

      if (!isActive) {
        commands.push({
          name: `myplugin/activate-${pluginSlug}`,
          label: `Activate ${pluginName}`,
          icon: plugins,
          callback: () => togglePlugin("activate", pluginSlug),
        });
      } else {
        commands.push({
          name: `myplugin/deactivate-${pluginSlug}`,
          label: `Deactivate ${pluginName}`,
          icon: plugins,
          callback: () => togglePlugin("deactivate", pluginSlug),
        });
      }
    });
  }

  return { commands, isLoading };
}

export { usePluginCommands };
