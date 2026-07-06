/**
 * PURPOSE:
 * Provide browser-safe access to Macfolio's GitHub backend endpoints.
 * RESPONSIBILITY:
 * Request repositories, build limited repository trees, and load explicitly selected file content.
 * USED BY:
 * Portfolio data builders, desktop code preview, and mobile code views.
 * DEPENDS ON:
 * VITE_API_BASE_URL and the browser fetch API.
 * SHOULD NOT HANDLE:
 * GitHub tokens, direct GitHub requests, UI state, rendering, or portfolio fallback selection.
 * SCALING NOTES:
 * Keep backend response normalization here so UI features remain independent of transport details.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);
const MAX_TREE_DEPTH = 3;
let reposRequest = null;
const treeRequests = new Map();

const requestApi = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("Live GitHub data temporarily unavailable.");
  }

  return response.json();
};

const normalizeRepo = (repo) => {
  const ownerName = repo.full_name?.split("/")[0] || "";

  return {
    ...repo,
    id: repo.full_name,
    owner: { login: ownerName },
  };
};

export const fetchRepos = async () => {
  if (!reposRequest) {
    reposRequest = requestApi("/api/github/repos")
      .then((data) => (Array.isArray(data) ? data.map(normalizeRepo) : []))
      .catch(() => [])
      .finally(() => {
        reposRequest = null;
      });
  }

  return reposRequest;
};

export const fetchRepoTree = async (_owner, repo, path = "", depth = 0) => {
  if (depth > MAX_TREE_DEPTH) return [];

  const requestKey = `${repo}:${path}:${depth}`;
  if (treeRequests.has(requestKey)) {
    return treeRequests.get(requestKey);
  }

  const request = buildRepoTree(repo, path, depth).finally(() => {
    treeRequests.delete(requestKey);
  });

  treeRequests.set(requestKey, request);
  return request;
};

const buildRepoTree = async (repo, path, depth) => {
  const query = path ? `?path=${encodeURIComponent(path)}` : "";
  let data;

  try {
    data = await requestApi(
      `/api/github/repos/${encodeURIComponent(repo)}/contents${query}`,
    );
  } catch {
    return [];
  }

  if (!Array.isArray(data)) return [];

  const result = await Promise.all(
    data.map(async (item) => {
      if (!item?.name || !item?.type || !item?.path) return null;

      if (item.type === "dir") {
        return {
          id: item.sha,
          name: item.name,
          kind: "folder",
          type: "folder",
          icon: "/images/folder.png",
          path: item.path,
          repoName: repo,
          children: await fetchRepoTree("", repo, item.path, depth + 1),
        };
      }

      const extension = item.name.includes(".")
        ? item.name.split(".").pop().toLowerCase()
        : "";

      return {
        id: item.sha,
        name: item.name,
        kind: "file",
        type: "file",
        icon: "/images/file.png",
        fileType: extension,
        path: item.path,
        repoName: repo,
      };
    }),
  );

  return result.filter(Boolean);
};

export const fetchRepoFileContent = async (repo, path) => {
  const data = await requestApi(
    `/api/github/repos/${encodeURIComponent(repo)}/contents?path=${encodeURIComponent(path)}`,
  );

  return typeof data?.content === "string" ? data.content : "";
};
