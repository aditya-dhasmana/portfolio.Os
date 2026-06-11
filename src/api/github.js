/**
 * PURPOSE:
 * Provide public GitHub API requests for portfolio repository data.
 * RESPONSIBILITY:
 * Fetch public repositories and limited public repository trees.
 * USED BY:
 * Portfolio data builders, desktop code preview, and mobile code views.
 * DEPENDS ON:
 * Vite public environment variables and the browser fetch API.
 * SHOULD NOT HANDLE:
 * Private GitHub authentication, secret tokens, UI state, rendering, or file preview state.
 * SCALING NOTES:
 * If private data or higher rate limits are needed later, move authentication behind a server/API route.
 */

const BASE_URL = "https://api.github.com";

const requestGitHub = async (url) => {
  return fetch(url);
};

// ===========================================
// FETCH USER REPOS
// ===========================================
export const fetchRepos = async () => {
  try {
    const username = import.meta.env.VITE_GITHUB_USERNAME;
    if (!username) return [];

    const res = await requestGitHub(`${BASE_URL}/users/${username}/repos`);

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchRepos error:", err);
    return [];
  }
};

// ===========================================
// FETCH REPO TREE RECURSIVELY
// ===========================================
export const fetchRepoTree = async (
  owner,
  repo,
  path = "",
  depth = 0
) => {
  if (depth > 3) return [];

  try {
    const res = await requestGitHub(
      `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const result = await Promise.all(
      data.map(async (item) => {
        if (!item?.name || !item?.type) return null;

        // ===========================
        // FOLDER
        // ===========================
        if (item.type === "dir") {
          return {
            id: item.sha,
            name: item.name,
            kind: "folder",
            type: "folder",
            icon: "/images/folder.png",
            path: item.path,
            repoName: repo,
            repoOwner: owner,
            children: await fetchRepoTree(owner, repo, item.path, depth + 1),
          };
        }

        // ===========================
        // FILE
        // ===========================
        const ext = item.name.includes(".")
          ? item.name.split(".").pop().toLowerCase()
          : "";

        return {
          id: item.sha,
          name: item.name,
          kind: "file",
          type: "file",
          icon: "/images/file.png",
          fileType: ext,
          path: item.path,
          download_url: item.download_url || "",
          repoName: repo,
          repoOwner: owner,
        };
      })
    );

    return result.filter(Boolean);
  } catch (err) {
    console.error("fetchRepoTree error:", err);
    return [];
  }
};
