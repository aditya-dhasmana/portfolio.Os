let cachedWork = null;

import { fetchRepos, fetchRepoTree } from "../api/github";

const attachParents = (nodes = [], parent = null) => {
  return nodes.map((node) => {
    const newNode = {
      ...node,
      parent,
    };

    if (node.children) {
      newNode.children = attachParents(node.children, newNode);
    }

    return newNode;
  });
};

export const buildWorkLocation = async () => {
  if (window.__WORK_DATA__) return window.__WORK_DATA__;
  if (cachedWork) return cachedWork;

  const repos = await fetchRepos();

  const repoFolders = await Promise.all(
    repos.map(async (repo) => {
      if (!repo.name) return null;

      let tree = [];

      try {
        tree = await fetchRepoTree(repo.owner.login, repo.name);
      } catch {
        tree = [];
      }

      const sourceFolder = {
        id: `${repo.id}-source`,
        name: "Source Code",
        icon: "/images/folder.png",
        kind: "folder",
        children: tree,
      };

      return {
        id: repo.id,
        name: repo.name,
        icon: "/images/folder.png",
        kind: "folder",
        children: [
          sourceFolder,
          {
            id: `${repo.id}-live`,
            name: "Live Site",
            icon: "/images/safari.png",
            kind: "file",
            fileType: "url",
            href: repo.homepage || repo.html_url,
          },
          {
            id: `${repo.id}-txt`,
            name: "Project.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            description: [repo.description || "No description available."],
          },
        ],
      };
    })
  );

  const rawWork = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: repoFolders.filter(Boolean),
  };

  cachedWork = attachParents([rawWork])[0];
  window.__WORK_DATA__ = cachedWork;

  return cachedWork;
};