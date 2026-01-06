import { useCommand } from "@wordpress/commands";
import { copy } from "@wordpress/icons";
import { select, dispatch } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { store as editorStore } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";

export default function CopyPostContent () {
  useCommand({
    name: "myplugin/copy-post-content",
    label: __("Copy Post Content to Clipboard", "myplugin"),
    icon: copy,
    context: "entity-edit",
    callback: ({ close }) => {
      const content = select(editorStore).getEditedPostContent();

      if (!content) {
        dispatch(noticesStore).createNotice(
          "error",
          __("No post content to copy.", "myplugin"),
          { type: "snackbar" }
        );
        close();
        return;
      }

      navigator.clipboard.writeText(content).then(() => {
        dispatch(noticesStore).createNotice(
          "success",
          __("Post content copied to clipboard!", "myplugin"),
          { type: "snackbar" }
        );
      });

      close();
    },
  });

  return null;
};