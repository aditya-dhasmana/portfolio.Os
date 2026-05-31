import { motion as Motion } from "framer-motion";

const AppIcon = ({ app, onOpenApp }) => (
  <Motion.button
    type="button"
    className="ios-app-icon"
    whileTap={{ scale: 0.88 }}
    onClick={() => onOpenApp(app)}
  >
    <span className="ios-app-icon-tile">
      <img src={app.icon} alt="" draggable={false} />
    </span>
    <span className="ios-app-label">{app.name}</span>
  </Motion.button>
);

export default AppIcon;
