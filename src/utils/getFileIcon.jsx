import {
  VscJson,
  VscFile,
  VscSymbolMethod,
  VscFilePdf,
  VscFolder,
  VscMarkdown,
} from "react-icons/vsc";

import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaImage,
  FaEnvira,
  FaNpm,
} from "react-icons/fa";

const getFileIcon = (name = "", type = "file") => {
  const lower = name.toLowerCase();
  const ext = lower.split(".").pop();

  if (type === "folder" || type === "tree") {
    return <VscFolder color="#dcb67a" />;
  }

  if (lower.endsWith(".jsx") || lower.endsWith(".tsx"))
    return <FaReact color="#61dafb" />;

  if (ext === "js") return <FaJs color="#f7df1e" />;
  if (ext === "ts") return <VscSymbolMethod color="#3178c6" />;
  if (ext === "json") return <VscJson color="#9cdcfe" />;
  if (ext === "html") return <FaHtml5 color="#e34c26" />;
  if (ext === "css") return <FaCss3Alt color="#264de4" />;
  if (ext === "pdf") return <VscFilePdf color="#ff0000" />;
  if (ext === "md") return <VscMarkdown color="#42a5f5" />;

  if (lower.includes(".env")) return <FaEnvira color="#57cc99" />;
  if (lower.includes("package")) return <FaNpm color="#cb3837" />;
  if (lower.includes("node")) return <FaNodeJs color="#68a063" />;

  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
    return <FaImage color="#c586c0" />;

  return <VscFile color="#c5c5c5" />;
};

export default getFileIcon;