import { useState } from "react";
import getFileIcon from "../utils/getFileIcon";

const Explorer = ({ repos = [], tree = [], onRepoClick, onFileClick, activeFile }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (path) => {
    setOpenFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderTree = (nodes = [], level = 0) => {
    return nodes.map((node) => {
      const isFolder = node.type === "folder";
      const isOpen = openFolders[node.path];

      return (
        <div key={node.path}>
          <div
            className={`explorer-item ${activeFile?.path === node.path ? "active" : ""}`}
            style={{ paddingLeft: `${level * 14}px` }}
            onClick={() =>
              isFolder ? toggleFolder(node.path) : onFileClick(node)
            }
          >
            <div className="explorer-row">
              <span className="icon">
                {isFolder ? "📁" : getFileIcon(node.name)}
              </span>
              <span className="name">{node.name}</span>
            </div>
          </div>

          {isFolder && isOpen && node.children && (
            <div>{renderTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="explorer">
      <div className="panel-title">EXPLORER</div>

      {repos.map((repo) => (
        <div key={repo.id}>
          <div className="repo-title" onClick={() => onRepoClick(repo)}>
            📦 {repo.name}
          </div>

          {renderTree(tree)}
        </div>
      ))}
    </div>
  );
};

export default Explorer;