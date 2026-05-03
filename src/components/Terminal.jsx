const Terminal = ({ repo }) => {
  return (
    <div className="terminal">
      <div className="panel-title">TERMINAL</div>

      {repo && (
        <div className="terminal-block">
          <p>&gt; open {repo.name}</p>

          <a href={repo.html_url} target="_blank" rel="noreferrer">
            GitHub
          </a>


          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noreferrer">
               Live
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default Terminal;