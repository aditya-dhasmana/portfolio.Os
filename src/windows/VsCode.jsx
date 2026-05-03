import { useEffect, useState } from "react";
import clsx from "clsx";

import { fetchRepos, fetchRepoTree } from "../api/github";
import { Editor, Explorer, WindowControls, Terminal } from "#components/Index";
import windowWrapper from "../hoc/windowWrapper";

const VsCode = () => {
  const [repos, setRepos] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);

  const [tree, setTree] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  const [layout, setLayout] = useState({
    left: true,
    right: true,
    terminalBottom: false,
  });

  // 📦 Load repos
  useEffect(() => {
    fetchRepos().then(setRepos);
  }, []);

  // 📁 Open repo
  const openRepo = async (repo) => {
    setActiveRepo(repo);
    const data = await fetchRepoTree(repo.owner.login, repo.name);
    setTree(data);
  };

  // 📄 Open file (inside editor only)
  const openFile = async (file) => {
    setActiveFile(file);

    if (!file.content && file.download_url) {
      const res = await fetch(file.download_url);
      const text = await res.text();
      file.content = text;
    }

    setOpenTabs((prev) => {
      const exists = prev.find((t) => t.path === file.path);
      if (exists) return prev;
      return [...prev, file];
    });
  };

  // ❌ Close tab
  const closeTab = (path) => {
    setOpenTabs((prev) => prev.filter((t) => t.path !== path));

    if (activeFile?.path === path) {
      setActiveFile(null);
    }
  };

  return (
    <div className="vscode-window">

      {/* HEADER */}
      <div id="window-header">
        <WindowControls target="vsCode" />
        <h2>VS Code</h2>

        <div className="layout-buttons">
          <button onClick={() =>
            setLayout(p => ({ ...p, left: !p.left }))
          }>
            Explorer
          </button>

          <button onClick={() =>
            setLayout(p => ({ ...p, right: !p.right }))
          }>
            Terminal
          </button>

          <button onClick={() =>
            setLayout(p => ({ ...p, terminalBottom: !p.terminalBottom }))
          }>
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

        {/* LEFT - EXPLORER */}
        {layout.left && (
          <Explorer
            repos={repos}
            tree={tree}
            onRepoClick={openRepo}
            onFileClick={openFile}
            activeFile={activeFile}
          />
        )}

        {/* CENTER - EDITOR (NO WRAPPER BUG) */}
        <Editor
          activeFile={activeFile}
          openTabs={openTabs}
          setActiveFile={setActiveFile}
          closeTab={closeTab}
        />

        {/* RIGHT TERMINAL */}
        {layout.right && !layout.terminalBottom && (
          <Terminal repo={activeRepo} />
        )}

        {/* BOTTOM TERMINAL */}
        {layout.terminalBottom && layout.right && (
          <div className="terminal bottom">
            <Terminal repo={activeRepo} />
          </div>
        )}

      </div>
    </div>
  );
};

export default windowWrapper(VsCode, "vsCode");