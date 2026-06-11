/**
 * PURPOSE:
 * Render the code-preview terminal side panel.
 * RESPONSIBILITY:
 * Display selected repository status and external repository/live links.
 * USED BY:
 * CodePreviewWindow.
 * DEPENDS ON:
 * Selected repository data.
 * SHOULD NOT HANDLE:
 * Real command execution, repo fetching, editor tabs, or shell window controls.
 * SCALING NOTES:
 * If this becomes interactive, separate display state from command simulation state.
 */

const Terminal = ({ repo }) => {
  return (
    <div className="terminal">
      <div className="panel-title">TERMINAL</div>

      {repo ? (
        <div className="terminal-block">
          <p>&gt; open {repo.name}</p>
          <p>&gt; repository initialized...</p>
          <p>&gt; build status: success</p>

          <div className="terminal-actions">
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              GitHub
            </a>

            {repo.homepage && repo.homepage.trim() !== "" && (
              <a href={repo.homepage} target="_blank" rel="noreferrer">
                Live
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="terminal-block">
          <p>&gt; waiting for repository selection...</p>
        </div>
      )}
    </div>
  );
};

export default Terminal;
