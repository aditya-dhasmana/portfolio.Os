import { useEffect, useState } from "react";
import { ExternalLink, FolderGit2, Loader2 } from "lucide-react";

import { fetchRepos, fetchRepoTree } from "../../../api/github";

const CodeApp = ({ mode = "code" }) => {
  const [repos, setRepos] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);
  const [tree, setTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchRepos()
      .then((items) => {
        if (!alive) return;
        setRepos(items);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setRepos([]);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const openRepo = async (repo) => {
    setActiveRepo(repo);
    setActiveFile(null);
    setTree([]);
    const nodes = await fetchRepoTree(repo.owner.login, repo.name);
    setTree(nodes);
  };

  const openFile = async (file) => {
    if (file.kind === "folder") return;
    if (!file.download_url) return;

    setActiveFile({ ...file, content: "Loading..." });
    try {
      const response = await fetch(file.download_url);
      setActiveFile({ ...file, content: await response.text() });
    } catch {
      setActiveFile({ ...file, content: "Unable to load this file." });
    }
  };

  const flatFiles = tree
    .flatMap((item) => (item.kind === "folder" ? item.children || [] : item))
    .filter((item) => item.kind !== "folder")
    .slice(0, 12);

  return (
    <div className="mobile-page mobile-code-page">
      <section className="mobile-section">
        <h1>{mode === "github" ? "Repositories" : "Source Preview"}</h1>
        <p className="mobile-muted">Browse repos and preview files in a phone-friendly code view.</p>
      </section>

      {loading && (
        <div className="mobile-empty-state">
          <Loader2 className="spin" size={28} />
          Loading repositories
        </div>
      )}

      {!loading && repos.length === 0 && <div className="mobile-empty-state">No repositories available.</div>}

      <div className="mobile-repo-list">
        {repos.map((repo) => (
          <button
            key={repo.id}
            type="button"
            className={activeRepo?.id === repo.id ? "mobile-repo-row active" : "mobile-repo-row"}
            onClick={() => openRepo(repo)}
          >
            <FolderGit2 size={19} />
            <span>
              <strong>{repo.name}</strong>
              <small>{repo.description || "GitHub repository"}</small>
            </span>
            <a href={repo.html_url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
              <ExternalLink size={15} />
            </a>
          </button>
        ))}
      </div>

      {activeRepo && (
        <section className="mobile-code-panel">
          <div className="mobile-code-files">
            {flatFiles.length === 0 && <p>Loading files...</p>}
            {flatFiles.map((file) => (
              <button key={file.path} type="button" onClick={() => openFile(file)}>
                {file.name}
              </button>
            ))}
          </div>
          <pre>{activeFile?.content || "Select a file to preview source code."}</pre>
        </section>
      )}
    </div>
  );
};

export default CodeApp;
