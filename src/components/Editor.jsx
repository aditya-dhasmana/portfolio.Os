import Editor from "@monaco-editor/react";
import clsx from "clsx";
import { useEffect } from "react";
import { useMonaco } from "@monaco-editor/react";

const CodeEditor = ({ activeFile, openTabs = [], setActiveFile, closeTab }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("vscode-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955" },
          { token: "keyword", foreground: "569CD6" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "type", foreground: "4EC9B0" },
          { token: "function", foreground: "DCDCAA" },
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editorLineNumber.foreground": "#858585",
          "editorCursor.foreground": "#ffffff",
          "editor.lineHighlightBackground": "#2a2d2e",
        },
      });
    }
  }, [monaco]);

  const getLanguage = (name = "") => {
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".html")) return "html";
    return "plaintext";
  };

  return (
    <div className="editor">
      <div className="editor-tabs">
        {openTabs.map((tab) => (
          <div
            key={tab.path}
            className={clsx("tab", {
              active: activeFile?.path === tab.path,
            })}
            onClick={() => setActiveFile(tab)}
          >
            <span className="truncate max-w-[110px]">{tab.name}</span>

            <span
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.path);
              }}
            >
              ✕
            </span>
          </div>
        ))}
      </div>

      <div className="editor-body">
        {activeFile ? (
          <Editor
            height="100%"
            theme="vscode-dark"
            language={getLanguage(activeFile.name)}
            value={activeFile.content || "// Loading..."}
            options={{
              fontSize: window.innerWidth < 768 ? 11 : 14,
              fontFamily: "Fira Code, monospace",
              fontLigatures: true,
              lineHeight: window.innerWidth < 768 ? 18 : 22,
              minimap: { enabled: window.innerWidth > 768 },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
              cursorBlinking: "smooth",
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="editor-empty">Select a file to preview source code</div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;