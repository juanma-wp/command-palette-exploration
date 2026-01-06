import { useCommand } from "@wordpress/commands";
import { useSelect } from "@wordpress/data";
import { Modal, Spinner, ExternalLink } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { postList } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";

import { useState } from "react";

const LatestPostsModal = ({ onClose }) => {
  const { posts, isLoading } = useSelect((select) => {
    const query = {
      per_page: 5, // 🔢 Limit to 5 most recently modified
      order: "desc",
      orderby: "modified",
    };
    const posts = select(coreStore).getEntityRecords("postType", "post", query);
    const isLoading = !Array.isArray(posts);

    return { posts, isLoading };
  }, []);

  return (
    <Modal
      title={__("Recently Edited Posts", "myplugin")}
      onRequestClose={onClose}
      focusOnMount
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: "1rem" }}>
              <strong>
                {post.title.rendered || __("Untitled", "myplugin")}
              </strong>
              <br />
              {__("Created", "myplugin")}:{" "}
              {new Date(post.date).toLocaleString()}
              <br />
              {__("Updated", "myplugin")}:{" "}
              {new Date(post.modified).toLocaleString()}
              <br />
              <ExternalLink
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {__("View Post", "myplugin")}
              </ExternalLink>{" "}
              |{" "}
              <a
                href={`post.php?post=${post.id}&action=edit`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {__("Edit", "myplugin")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default function LatestPostsCommand () {

  const [isOpen, setIsOpen] = useState(false);

  useCommand({
    name: "myplugin/show-latest-posts",
    label: __("Show Latest Posts", "myplugin"),
    icon: postList,
    callback: () => setIsOpen(true),
    context: "site-editor",
  });

  return isOpen ? <LatestPostsModal onClose={() => setIsOpen(false)} /> : null;
};
