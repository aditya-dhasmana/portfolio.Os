import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ExternalLink, FileText, Folder, Image, Search } from "lucide-react";

import { buildWorkLocation } from "../../utils/buildWorkLocation";
import { locations } from "#constants";

const CODE_FILE_TYPES = ["js", "jsx", "ts", "tsx", "css", "html", "json", "md", "txt"];

const getIcon = (item) => {
  if (item.kind === "folder") return <Folder size={24} />;
  if (item.fileType === "img") return <Image size={24} />;
  return <FileText size={24} />;
};

const ProjectsApp = () => {
  const [root, setRoot] = useState(null);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    buildWorkLocation()
      .then((work) => {
        if (!alive) return;
        setRoot(work);
        setCurrent(work);
        setStatus("ready");
      })
      .catch(() => {
        if (!alive) return;
        setRoot(locations.work);
        setCurrent(locations.work);
        setStatus("empty");
      });

    return () => {
      alive = false;
    };
  }, []);

  const trail = useMemo(() => {
    const items = [];
    let node = current;
    while (node) {
      items.unshift(node);
      node = node.parent;
    }
    return items.length ? items : root ? [root] : [];
  }, [current, root]);

  const openItem = (item) => {
    if (item.kind === "folder") {
      setHistory((prev) => [...prev, current]);
      setCurrent(item);
      return;
    }

    if (["url", "fig"].includes(item.fileType) && item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.download_url || CODE_FILE_TYPES.includes(item.fileType)) {
      window.open(item.download_url || item.href || "#", "_blank", "noopener,noreferrer");
    }
  };

  const goBack = () => {
    setHistory((prev) => {
      const next = [...prev];
      const previous = next.pop();
      if (previous) setCurrent(previous);
      return next;
    });
  };

  return (
    <div className="mobile-page">
      <div className="mobile-search-field">
        <Search size={16} />
        <span>Search projects</span>
      </div>

      <section className="mobile-finder-header">
        <div>
          <p>{status === "loading" ? "Loading GitHub" : "Current folder"}</p>
          <h1>{current?.name || "Projects"}</h1>
        </div>
        {history.length > 0 && (
          <button type="button" onClick={goBack}>
            Back
          </button>
        )}
      </section>

      <div className="mobile-breadcrumbs">
        {trail.map((item, index) => (
          <span key={`${item.id}-${index}`}>
            {item.name}
            {index < trail.length - 1 && <ChevronRight size={13} />}
          </span>
        ))}
      </div>

      <div className="mobile-file-list">
        {status === "loading" && <div className="mobile-empty-state">Loading projects...</div>}
        {status !== "loading" && (!current?.children || current.children.length === 0) && (
          <div className="mobile-empty-state">No project files available yet.</div>
        )}
        {current?.children?.map((item) => (
          <button key={item.id} className="mobile-file-row" type="button" onClick={() => openItem(item)}>
            <span className="mobile-file-icon">{getIcon(item)}</span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.kind === "folder" ? "Folder" : item.fileType || "File"}</small>
            </span>
            {item.kind !== "folder" && <ExternalLink size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsApp;
