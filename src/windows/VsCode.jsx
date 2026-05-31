/**
 * PURPOSE:
 * Render the desktop VS Code-style source preview window.
 * RESPONSIBILITY:
 * Load repositories, open source files, manage editor tabs, and compose explorer/editor/terminal panels.
 * USED BY:
 * Desktop app window registry.
 * DEPENDS ON:
 * GitHub API helpers, desktop window wrapper, window store, and code preview components.
 * SHOULD NOT HANDLE:
 * Finder navigation, portfolio file-system construction, mobile shell behavior, or global app startup.
 * SCALING NOTES:
 * Repo loading and file-tab state are candidates for a future code-preview feature hook.
 */

import { useEffect, useState } from "react";
import clsx from "clsx";

import { fetchRepos, fetchRepoTree } from "../api/github";
import { Editor, Explorer, WindowControls, Terminal } from "#components/Index";
import windowWrapper from "../hoc/windowWrapper";
import useWindowStore from "#store/window";

const VsCode = () => {
  const { windows } = useWindowStore();
  const injectedFile = windows?.vsCode?.data?.file || null;

  const [repos, setRepos] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);

  const [repoTrees, setRepoTrees] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const [loadingRepoId, setLoadingRepoId] = useState(null);

  const [layout, setLayout] = useState({
    left: true,
    right: true,
    terminalBottom: false,
  });

  // ================= LOAD REPOS =================
  useEffect(() => {
    fetchRepos().then(setRepos);
  }, []);

  // ================= AUTO OPEN FILE FROM FINDER =================
  useEffect(() => {
    if (!injectedFile) return;

    handleInjectedFile(injectedFile);
  }, [injectedFile]);

  const handleInjectedFile = async (file) => {
    if (!file) return;

    let preparedFile = { ...file };

    // fetch content if github raw file
    if (!preparedFile.content && preparedFile.download_url) {
      try {
        const res = await fetch(preparedFile.download_url);
        preparedFile.content = await res.text();
      } catch {
        preparedFile.content = "// Unable to load file";
      }
    }

    setActiveFile(preparedFile);

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.path === preparedFile.path);
      if (exists) return prev;
      return [...prev, preparedFile];
    });
  };

  // ================= OPEN REPO =================
  const openRepo = async (repo) => {
    setActiveRepo(repo);

    if (repoTrees?.[repo.id]) return;

    setLoadingRepoId(repo.id);

    try {
      const data = await fetchRepoTree(repo.owner.login, repo.name);

      setRepoTrees((prev) => ({
        ...prev,
        [repo.id]: data,
      }));
    } finally {
      setLoadingRepoId(null);
    }
  };

  // ================= OPEN FILE FROM EXPLORER =================
  const openFile = async (file) => {
    if (!file) return;

    let preparedFile = { ...file };

    if (!preparedFile.content && preparedFile.download_url) {
      const res = await fetch(preparedFile.download_url);
      preparedFile.content = await res.text();
    }

    setActiveFile(preparedFile);

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.path === preparedFile.path);
      if (exists) return prev;
      return [...prev, preparedFile];
    });
  };

  // ================= CLOSE TAB =================
  const closeTab = (path) => {
    setOpenTabs((prev) => prev.filter((t) => t.path !== path));

    if (activeFile?.path === path) {
      const remaining = openTabs.filter((t) => t.path !== path);
      setActiveFile(remaining[remaining.length - 1] || null);
    }
  };

  return (
    <div className="vscode-window">

      {/* HEADER */}
      <div id="window-header">
        <WindowControls target="vsCode" />
        <h2>VS Code</h2>

        <div className="layout-buttons">
          <button onClick={() => setLayout((p) => ({ ...p, left: !p.left }))}>
            Explorer
          </button>

          <button onClick={() => setLayout((p) => ({ ...p, right: !p.right }))}>
            Terminal
          </button>

          <button
            onClick={() =>
              setLayout((p) => ({
                ...p,
                terminalBottom: !p.terminalBottom,
              }))
            }
          >
            Bottom Terminal
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div
        className={clsx("vscode", {
          "terminal-bottom": layout.terminalBottom,
        })}
      >
        {/* LEFT */}
        {layout.left && (
          <Explorer
            repos={repos}
            repoTrees={repoTrees}
            onRepoClick={openRepo}
            onFileClick={openFile}
            activeFile={activeFile}
            loadingRepoId={loadingRepoId}
          />
        )}

        {/* CENTER */}
        <Editor
          activeFile={activeFile}
          openTabs={openTabs}
          setActiveFile={setActiveFile}
          closeTab={closeTab}
        />

        {/* RIGHT */}
        {layout.right && !layout.terminalBottom && (
          <Terminal repo={activeRepo} />
        )}

        {/* BOTTOM */}
        {layout.terminalBottom && layout.right && (
          <div className="terminal bottom">
            <Terminal repo={activeRepo} />
          </div>
        )}
      </div>
    </div>
  );
};

const VsCodeWindow = windowWrapper(VsCode, "vsCode");

export default VsCodeWindow;
