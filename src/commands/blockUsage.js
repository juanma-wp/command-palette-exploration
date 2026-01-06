import { useState, useMemo } from "@wordpress/element";
import { useCommandLoader } from "@wordpress/commands";
import { registerPlugin } from "@wordpress/plugins";
import { Modal } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import { listView } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";

const BlockUsageModal = ({ onClose }) => {
  const blocks = useSelect((select) => select(blockEditorStore).getBlocks());

  const blockCounts = useMemo(() => {
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

export default function BlockUsageCommand() {

  const [isOpen, setIsOpen] = useState(false);

   const { isViewable } = useSelect((select) => {
     const postType = select(editorStore).getCurrentPostType();
     const postTypeObject = select(coreStore).getPostType(postType);
     return {
       isViewable: postTypeObject?.viewable
     };
   }, []);

  const commands = useMemo(() => {
    if (!isViewable) {
      return [];
    }

    return [
      {
        name: "myplugin/show-block-usage",
        label: __("Show Block Usage", "myplugin"),
        icon: listView,
        context: "entity-edit",
        callback: ({ close }) => {
          setIsOpen(true);
          close();
        },
      },
    ];
  }, [isViewable]);

  useCommandLoader({
    name: "myplugin/block-usage-loader",
    hook: () => ({ commands, isLoading: false }),
  });

  return isOpen ? <BlockUsageModal onClose={() => setIsOpen(false)} /> : null;
}
