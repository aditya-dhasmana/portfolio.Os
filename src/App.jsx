import React from 'react'
import { useMediaQuery } from 'react-responsive'

import {Navbar,Welcome,Dock,Home,MobileNavigation,MobileWindowManager,ErrorBoundary} from '#components/Index'
import { Finder, Resume, Safari, Terminal, TextWindow , ImageWindow, ContactWindow, Gallery, VsCode,  } from '#windows';


import {gsap} from 'gsap';
import Draggable from 'gsap/src/Draggable';
import useWindowStore from '#store/window';


gsap.registerPlugin(Draggable);

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const { windows } = useWindowStore();

  // Conditionally render windows based on their state
  const renderWindow = (WindowComponent, windowId) => {
    const window = windows[windowId];
    if (!window?.isOpen || window?.isMinimized) return null;
    
    return <WindowComponent key={windowId} windowId={windowId} />;
  };

  return (
    <ErrorBoundary>
      <main className="relative">
        <Navbar />
        <Welcome/>
        
        {/* Desktop Dock */}
        {!isMobile && <Dock/>}
        
        {/* Mobile Navigation */}
        {isMobile && <MobileNavigation />}

        {/* Desktop Window Layer */}
        {!isMobile && (
          <ErrorBoundary>
            <div className="window-layer">
              {renderWindow(Terminal, 'terminal')}
              {renderWindow(Safari, 'safari')}
              {renderWindow(Resume, 'resume')}
              {renderWindow(Finder, 'finder')}
              {renderWindow(TextWindow, 'txtfile')}
              {renderWindow(ImageWindow, 'imgfile')}
              {renderWindow(ContactWindow, 'contact')}
              {renderWindow(Gallery, 'photos')}
              {renderWindow(VsCode, 'vsCode')}
            </div>
          </ErrorBoundary>
        )}

        {/* Mobile Window Manager */}
        {isMobile && (
          <ErrorBoundary>
            <MobileWindowManager>
              <>
                {renderWindow(Terminal, 'terminal')}
                {renderWindow(Safari, 'safari')}
                {renderWindow(Resume, 'resume')}
                {renderWindow(Finder, 'finder')}
                {renderWindow(TextWindow, 'txtfile')}
                {renderWindow(ImageWindow, 'imgfile')}
                {renderWindow(ContactWindow, 'contact')}
                {renderWindow(Gallery, 'photos')}
                {renderWindow(VsCode, 'vsCode')}
              </>
            </MobileWindowManager>
          </ErrorBoundary>
        )}

        <Home />
      </main>
    </ErrorBoundary>
  )
}

export default App;
