const BASE_URL = "https://api.github.com";

const headers = {
  Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
};

// ✅ SAFE REPOS
export const fetchRepos = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/users/${import.meta.env.VITE_GITHUB_USERNAME}/repos`,
      { headers }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchRepos error:", err);
    return [];
  }
};

// ✅ SAFE TREE (FIXED)
export const fetchRepoTree = async (owner, repo, path = "") => {
  try {
    const res = await fetch(
      `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    const result = await Promise.all(
      data.map(async (item) => {
        if (!item?.name || !item?.type) return null;

        if (item.type === "dir") {
          return {
            name: item.name,
            type: "folder",
            path: item.path,
            children: await fetchRepoTree(owner, repo, item.path),
          };
        }

        return {
          name: item.name,
          type: "file",
          path: item.path,
          download_url: item.download_url || "",
        };
      })
    );

    return result.filter(Boolean);
  } catch (err) {
    console.error("fetchRepoTree error:", err);
    return [];
  }
};