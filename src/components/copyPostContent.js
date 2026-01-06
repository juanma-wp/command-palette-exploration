import { useCommand } from "@wordpress/commands";
import { copy } from "@wordpress/icons";
import { useSelect, useDispatch, select } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { store as editorStore } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";

export default function CopyPostContent () {
  const { createNotice } = useDispatch(noticesStore);

  const hasContent = useSelect((select) => {
    const content = select(editorStore).getEditedPostContent();
    return !!content && content.trim().length > 0;
  }, []);

  useCommand({
    name: "myplugin/copy-post-content",
    label: hasContent
      ? __("Copy Post Content to Clipboard", "myplugin")
      : __("Copy Post Content (No content)", "myplugin"),
    icon: copy,
    context: "entity-edit",
    disabled: !hasContent,
    callback: ({ close }) => {
      const content = select(editorStore).getEditedPostContent();

      if (!content) {
        createNotice(
          "error",
          __("No post content to copy.", "myplugin"),
          { type: "snackbar" }
        );
        close();
        return;
      }

      navigator.clipboard.writeText(content).then(() => {
        createNotice(
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