import { useState, useMemo } from "@wordpress/element";
import { useCommandLoader } from "@wordpress/commands";
import { Modal } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import { listView } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";

/**
 * Custom hook to count block usage in the current post/page.
 * Recursively walks through all blocks including nested ones.
 *
 * @return {Object} Object with block names as keys and their counts as values
 */
function useBlockCounts() {
  const blocks = useSelect((select) => select(blockEditorStore).getBlocks());

  return useMemo(() => {
    const counts = {};
    const walkBlocks = (blocks) => {
      blocks.forEach((block) => {
        counts[block.name] = (counts[block.name] || 0) + 1;
        if (block.innerBlocks?.length) {
          walkBlocks(block.innerBlocks);
        }
      });
    };
    walkBlocks(blocks);
    return counts;
  }, [blocks]);
}

/**
 * Custom hook to check if the current post type is viewable on the frontend.
 *
 * @return {boolean} True if the post type is viewable, false otherwise
 */
function useIsViewablePostType() {
  return useSelect((select) => {
    const { getCurrentPostType } = select(editorStore);
    const { getPostType } = select(coreStore);
    return getPostType(getCurrentPostType())?.viewable ?? false;
  }, []);
}

/**
 * Modal component to display the block usage.
 *
 * @param {Object} props - The component props
 * @param {Function} props.onClose - The function to close the modal
 * @returns {JSX.Element} The modal component
 */
const BlockUsageModal = ({ onClose }) => {
  const blockCounts = useBlockCounts();
  const hasBlocks = Object.keys(blockCounts).length > 0;

  return (
    <Modal title={__("Block Usage", "myplugin")} onRequestClose={onClose}>
      {hasBlocks ? (
        <ul>
          {Object.entries(blockCounts).map(([name, count]) => (
            <li key={name}>
              <strong>{name}</strong>: {count}
            </li>
          ))}
        </ul>
      ) : (
        <p>{__("No blocks found in this content.", "myplugin")}</p>
      )}
    </Modal>
  );
};

function useBlockUsageCommands(onOpen) {
  const isViewable = useIsViewablePostType();

  const commands = useMemo(() => {
    if (!isViewable) return [];

    return [
      {
        name: "myplugin/show-block-usage",
        label: __("Show Block Usage", "myplugin"),
        icon: listView,
        context: "entity-edit",
        callback: ({ close }) => {
          onOpen();
          close();
        },
      },
    ];
  }, [isViewable, onOpen]);

  return { commands, isLoading: false };
}

export default function BlockUsageCommand() {
  const [isOpen, setIsOpen] = useState(false);

  useCommandLoader({
    name: "myplugin/block-usage-loader",
    hook: () => useBlockUsageCommands(() => setIsOpen(true)),
  });

  return isOpen ? <BlockUsageModal onClose={() => setIsOpen(false)} /> : null;
}
