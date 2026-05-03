import {
  VscJson,
  VscFile,
  VscSymbolMethod,
  VscFilePdf,
} from "react-icons/vsc";

import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaImage,
} from "react-icons/fa";

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();

  if (name.endsWith(".jsx") || name.endsWith(".tsx"))
    return <FaReact color="#61dafb" />;

  if (ext === "js") return <FaJs color="#f7df1e" />;
  if (ext === "ts") return <VscSymbolMethod color="#3178c6" />;
  if (ext === "json") return <VscJson color="#9cdcfe" />;
  if (ext === "html") return <FaHtml5 color="#e34c26" />;
  if (ext === "css") return <FaCss3Alt color="#264de4" />;
  if (ext === "pdf") return <VscFilePdf color="#ff0000" />;

  if (["png", "jpg", "jpeg", "gif", "svg"].includes(ext))
    return <FaImage color="#c586c0" />;

  if (name.toLowerCase().includes("node"))
    return <FaNodeJs color="#68a063" />;

  return <VscFile color="#c5c5c5" />;
};

export default getFileIcon;