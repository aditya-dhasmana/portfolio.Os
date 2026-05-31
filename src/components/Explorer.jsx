import { useMemo, useState } from "react";
import getFileIcon from "../utils/getFileIcon";

const Explorer = ({
  repos = [],
  repoTrees = {},
  onRepoClick,
  onFileClick,
  activeFile,
  loadingRepoId,
}) => {
  const [manualOpenFolders, setManualOpenFolders] = useState({});
  const [manualOpenRepoId, setManualOpenRepoId] = useState(undefined);
  const activeFilePath = activeFile?.path || "";
  const activeFileRepoName = activeFile?.repoName || "";

  // ============================================
  // DERIVE OPEN FOLDERS BASED ON ACTIVE FILE PATH
  // ============================================
  const activeFileFolders = useMemo(() => {
    if (!activeFilePath) return {};

    const parts = activeFilePath.split("/");
    let current = "";

    const foldersToOpen = {};

    parts.slice(0, -1).forEach((part) => {
      current = current ? `${current}/${part}` : part;
      foldersToOpen[current] = true;
    });

    return foldersToOpen;
  }, [activeFilePath]);

  const activeFileRepoId = useMemo(() => {
    const repoMatch = repos.find((repo) => repo.name === activeFileRepoName);
    return repoMatch?.id ?? null;
  }, [activeFileRepoName, repos]);

  const openRepoId = manualOpenRepoId ?? activeFileRepoId;

  const isFolderOpen = (path) => {
    if (Object.hasOwn(manualOpenFolders, path)) {
      return manualOpenFolders[path];
    }

    return activeFileFolders[path] || false;
  };

  // ============================================
  // TOGGLE FOLDER
  // ============================================
  const toggleFolder = (path) => {
    setManualOpenFolders((prev) => ({
      ...prev,
      [path]: !isFolderOpen(path),
    }));
  };

  // ============================================
  // TOGGLE REPO
  // ============================================
  const handleRepoClick = (repo) => {
    setManualOpenRepoId((prev) => (prev === repo.id ? null : repo.id));

    // Keep desktop folders unchanged.
    // This only opens the repo in Explorer/Finder.
    if (onRepoClick) {
      onRepoClick(repo);
    }
  };

  // ============================================
  // RENDER TREE
  // ============================================
  const renderTree = (nodes = [], level = 0) => {
    if (!Array.isArray(nodes)) return null;

    // IMPORTANT:
    // Use [...nodes] before sort() so the original repo tree
    // is never mutated. This prevents desktop folders from changing.
    const sortedNodes = [...nodes].sort((a, b) => {
      if (a.kind === "folder" && b.kind !== "folder") return -1;
      if (a.kind !== "folder" && b.kind === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedNodes.map((node) => {
      const isFolder = node.kind === "folder";
      const isOpen = isFolderOpen(node.path);
      const isActive = activeFile?.path === node.path;

      return (
        <div key={node.path}>
          <div
            className={`explorer-item ${isActive ? "active" : ""}`}
            style={{ paddingLeft: `${level * 14 + 8}px` }}
            onClick={() =>
              isFolder ? toggleFolder(node.path) : onFileClick?.(node)
            }
          >
            <div className="explorer-row">
              <span className="folder-arrow">
                {isFolder ? (isOpen ? "▾" : "▸") : ""}
              </span>

              <span className="icon">
                {isFolder ? "📁" : getFileIcon(node.name)}
              </span>

              <span className="name">{node.name}</span>
            </div>
          </div>

          {isFolder && isOpen && Array.isArray(node.children) && (
            <div className="nested-folder">
              {renderTree(node.children, level + 1)}
            </div>
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
          <div className="repo-title" onClick={() => handleRepoClick(repo)}>
            <span className="arrow">
              {openRepoId === repo.id ? "▾" : "▸"}
            </span>

            📦 {repo.name}

            {loadingRepoId === repo.id && (
              <span className="loading-dot">...</span>
            )}
          </div>

          {openRepoId === repo.id &&
            renderTree(repoTrees?.[repo.id] ?? [])}
        </div>
      ))}
    </div>
  );
};

export default Explorer;
