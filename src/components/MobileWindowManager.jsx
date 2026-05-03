import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import useWindowStore from '#store/window';

const MobileWindowManager = ({ children }) => {
  const { windows, closeWindow, minimizeWindow, toggleMaximize, focusWindow } = useWindowStore();
  
  const openWindows = Object.entries(windows)
    .filter(([_, win]) => win.isOpen && !win.isMinimized)
    .sort(([_, a], [__, b]) => (b.zIndex || 0) - (a.zIndex || 0));

  if (openWindows.length === 0) return null;

  return (
    <AnimatePresence>
      {openWindows.map(([id, window]) => (
        <motion.div
          key={id}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="sm:hidden fixed inset-0 z-30 bg-black/95 backdrop-blur-xl"
          style={{ zIndex: window.zIndex }}
          onClick={() => focusWindow(id)}
        >
          {/* Mobile Window Header */}
          <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg border-b border-white/10">
            <h3 className="text-white font-semibold capitalize">
              {id.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize(id);
                }}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Maximize"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(id);
                }}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(id);
                }}
                className="p-2 text-white/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Window Content */}
          <div className="flex-1 overflow-hidden">
            {React.cloneElement(children, { windowId: id, isMobile: true })}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default MobileWindowManager;
