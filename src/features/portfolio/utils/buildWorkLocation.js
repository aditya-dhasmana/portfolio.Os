/**
 * PURPOSE:
 * Build the portfolio Work folder from GitHub repository data.
 * RESPONSIBILITY:
 * Fetch repositories, fetch limited source trees, and map them into Finder-friendly nodes.
 * USED BY:
 * Portfolio data hook and compatibility exports.
 * DEPENDS ON:
 * GitHub API helpers.
 * SHOULD NOT HANDLE:
 * React state, window globals, rendering, routing, or desktop/mobile shell behavior.
 * SCALING NOTES:
 * If the data source changes later, keep this mapper returning the same portfolio file-system shape.
 */

import { fetchRepos, fetchRepoTree } from "../../../api/github";

let cachedWork = null;

const createFallbackRepos = () => {
  const username = import.meta.env.VITE_GITHUB_USERNAME || "aditya-dhasmana";

  return [
    {
      id: "fallback-macfolio",
      name: "Macfolio",
      description: "Interactive macOS-style portfolio built with React.",
      html_url: `https://github.com/${username}/Macfolio`,
      homepage: "",
      owner: { login: username },
    },
    {
      id: "fallback-portfolio",
      name: "Portfolio",
      description: "Frontend portfolio projects and UI experiments.",
      html_url: `https://github.com/${username}?tab=repositories`,
      homepage: "",
      owner: { login: username },
    },
    {
      id: "fallback-react-projects",
      name: "React Projects",
      description: "React practice projects available from GitHub.",
      html_url: `https://github.com/${username}?tab=repositories`,
      homepage: "",
      owner: { login: username },
    },
  ];
};

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

const buildRepoFolder = async (repo) => {
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
};

export const buildWorkLocation = async () => {
  if (cachedWork) return cachedWork;

  const repos = await fetchRepos();
  const sourceRepos = repos.length > 0 ? repos : createFallbackRepos();
  const repoFolders = await Promise.all(sourceRepos.map(buildRepoFolder));

  const rawWork = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: repoFolders.filter(Boolean),
  };

  const work = attachParents([rawWork])[0];

  if (work.children.length > 0) {
    cachedWork = work;
  }

  return work;
};
