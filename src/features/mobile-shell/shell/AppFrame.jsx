import { ChevronLeft } from "lucide-react";
import { motion as Motion, useDragControls } from "framer-motion";

import StatusBar from "./StatusBar";

const AppFrame = ({ title, icon, onBack, children }) => {
  const dragControls = useDragControls();

  return (
    <Motion.section
      className="mobile-app-frame"
      drag="x"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ left: 0, right: 96 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.x > 82 || info.velocity.x > 560) onBack();
      }}
    >
      <div
        className="mobile-swipe-edge"
        onPointerDown={(event) => dragControls.start(event)}
        aria-hidden="true"
      />
      <StatusBar compact />
      <header className="mobile-app-bar">
        <button className="mobile-back-control" type="button" onClick={onBack} aria-label="Back to Home">
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>
        <div className="mobile-app-title">
          {icon && <img src={icon} alt="" />}
          <strong>{title}</strong>
        </div>
        <div className="mobile-header-spacer" />
      </header>
      <div className="mobile-app-scroll">{children}</div>
    </Motion.section>
  );
};

export default AppFrame;
