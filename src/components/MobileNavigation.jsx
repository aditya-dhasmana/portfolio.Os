import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, FolderOpen, User, FileText, Terminal, Code, X, Menu } from 'lucide-react';
import { dockApps } from '#constants/index';
import useWindowStore from '#store/window';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openWindow, closeWindow, restoreWindow, windows } = useWindowStore();

  const toggleApp = (id) => {
    const win = windows[id];
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(id);
    } else if (!win.isOpen) {
      openWindow(id);
    } else {
      closeWindow(id);
    }
    setIsOpen(false);
  };

  const mobileApps = [
    { id: 'finder', name: 'Portfolio', icon: FolderOpen, color: 'bg-blue-500' },
    { id: 'safari', name: 'Articles', icon: Home, color: 'bg-blue-400' },
    { id: 'photos', name: 'Gallery', icon: User, color: 'bg-purple-500' },
    { id: 'contact', name: 'Contact', icon: User, color: 'bg-green-500' },
    { id: 'terminal', name: 'Skills', icon: Terminal, color: 'bg-gray-800' },
    { id: 'vsCode', name: 'VS Code', icon: Code, color: 'bg-blue-600' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 right-4 z-50 p-3 bg-black/80 backdrop-blur-lg rounded-full text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Navigation Panel */}
            <motion.div
              id="mobile-navigation-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sm:hidden fixed top-0 right-0 z-50 h-full w-80 bg-black/90 backdrop-blur-xl shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-title"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <h2 id="mobile-nav-title" className="text-2xl font-bold text-white">Apps</h2>
                  <p className="text-gray-400 text-sm mt-1">Choose an app to open</p>
                </div>

                {/* App Grid */}
                <div className="flex-1 overflow-y-auto p-6" role="main">
                  <div className="grid grid-cols-3 gap-4" role="grid" aria-label="Application grid">
                    {mobileApps.map((app) => {
                      const Icon = app.icon;
                      const isActive = windows[app.id]?.isOpen;
                      
                      return (
                        <motion.button
                          key={app.id}
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => toggleApp(app.id)}
                          className={`flex flex-col items-center p-4 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-white/50 ${
                            isActive 
                              ? 'bg-white/20 ring-2 ring-white/50' 
                              : 'bg-white/10 hover:bg-white/15'
                          }`}
                          role="gridcell"
                          aria-label={`${app.name} ${isActive ? 'open' : 'closed'}`}
                          aria-pressed={isActive}
                        >
                          <div className={`p-3 rounded-xl ${app.color} mb-2`} aria-hidden="true">
                            <Icon size={24} className="text-white" />
                          </div>
                          <span className="text-white text-xs font-medium text-center">
                            {app.name}
                          </span>
                          {isActive && (
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-1" aria-hidden="true" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center justify-center">
                    <div className="w-20 h-1 bg-white/30 rounded-full" />
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-2">
                    Swipe down to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
