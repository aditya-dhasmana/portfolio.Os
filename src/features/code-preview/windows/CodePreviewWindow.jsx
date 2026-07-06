/**
 * PURPOSE:
 * Render the desktop VS Code-style source preview window.
 * RESPONSIBILITY:
 * Load repositories, open source files, manage editor tabs, and compose explorer/editor/terminal panels.
 * USED BY:
 * Desktop app window registry through the existing VsCode export.
 * DEPENDS ON:
 * GitHub API helpers, desktop shell window wrapper, desktop window store, and code-preview components.
 * SHOULD NOT HANDLE:
 * Finder navigation, portfolio file-system construction, mobile shell behavior, or global app startup.
 * SCALING NOTES:
 * Repo loading and file-tab state are candidates for a future code-preview hook.
 */

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

import {
  fetchRepoFileContent,
  fetchRepos,
  fetchRepoTree,
} from "../../../api/github";
import { fallbackProjects } from "../../portfolio/data/fallbackProjects";
import WindowControls from "../../desktop-shell/components/WindowControls";
import windowWrapper from "../../desktop-shell/hoc/windowWrapper";
import useWindowStore from "../../desktop-shell/store/windowStore";
import Editor from "../components/Editor";
import Explorer from "../components/Explorer";
import Terminal from "../components/Terminal";

const CodePreview = () => {
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

  const addFileTab = useCallback((file) => {
    setActiveFile(file);

    setOpenTabs((prev) => {
      const exists = prev.find((tab) => tab.path === file.path);
      if (exists) return prev;
      return [...prev, file];
    });
  }, []);

  const prepareFile = useCallback(async (file) => {
    const preparedFile = { ...file };

    if (!preparedFile.content && preparedFile.repoName && preparedFile.path) {
      try {
        preparedFile.content = await fetchRepoFileContent(
          preparedFile.repoName,
          preparedFile.path,
        );
      } catch {
        preparedFile.content = "// Unable to load file";
      }
    }

    return preparedFile;
  }, []);

  const handleInjectedFile = useCallback(async (file) => {
    if (!file) return;

    const preparedFile = await prepareFile(file);
    addFileTab(preparedFile);
  }, [addFileTab, prepareFile]);

  useEffect(() => {
    fetchRepos()
      .then((items) => setRepos(items.length > 0 ? items : fallbackProjects))
      .catch(() => setRepos(fallbackProjects));
  }, []);

  useEffect(() => {
    if (!injectedFile) return;

    handleInjectedFile(injectedFile);
  }, [handleInjectedFile, injectedFile]);

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
    } catch {
      setRepoTrees((prev) => ({
        ...prev,
        [repo.id]: [],
      }));
    } finally {
      setLoadingRepoId(null);
    }
  };

  const openFile = async (file) => {
    if (!file) return;

    const preparedFile = await prepareFile(file);
    addFileTab(preparedFile);
  };

  const closeTab = (path) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.path !== path));

    if (activeFile?.path === path) {
      const remaining = openTabs.filter((tab) => tab.path !== path);
      setActiveFile(remaining[remaining.length - 1] || null);
    }
  };

  return (
    <div className="vscode-window">
      <div id="window-header">
        <WindowControls target="vsCode" />
        <h2>VS Code</h2>

        <div className="layout-buttons">
          <button
            type="button"
            onClick={() => setLayout((prev) => ({ ...prev, left: !prev.left }))}
          >
            Explorer
          </button>

          <button
            type="button"
            onClick={() =>
              setLayout((prev) => ({ ...prev, right: !prev.right }))
            }
          >
            Terminal
          </button>

          <button
            type="button"
            onClick={() =>
              setLayout((prev) => ({
                ...prev,
                terminalBottom: !prev.terminalBottom,
              }))
            }
          >
            Bottom Terminal
          </button>
        </div>
      </div>

      <div
        className={clsx("vscode", {
          "terminal-bottom": layout.terminalBottom,
        })}
      >
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

        <Editor
          activeFile={activeFile}
          openTabs={openTabs}
          setActiveFile={setActiveFile}
          closeTab={closeTab}
        />

        {layout.right && !layout.terminalBottom && <Terminal repo={activeRepo} />}

        {layout.terminalBottom && layout.right && (
          <div className="terminal bottom">
            <Terminal repo={activeRepo} />
          </div>
        )}
      </div>
    </div>
  );
};

const CodePreviewWindow = windowWrapper(CodePreview, "vsCode");

export default CodePreviewWindow;
