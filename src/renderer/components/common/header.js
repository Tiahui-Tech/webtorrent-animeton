const React = require('react');
const { useState, useEffect } = require('react');
const {
  useNavigate,
  useLocation,
  useNavigationType
} = require('react-router-dom');

const { ipcRenderer } = require('electron');
const remote = require('@electron/remote')

const { Icon } = require('@iconify/react');
const ShineBorder = require('../ui/MagicUI/Effects/ShineBorder');
const SparklesText = require('../ui/MagicUI/Effects/SparklesText');

const Header = ({ state }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Updates the navigation state every time the location or navigation type changes
    setCanGoBack(navigationType !== 'POP' || location.key !== 'default');
    setCanGoForward(false); // Reset on each navigation
    setIsHome(location.pathname === '/'); // Update isHome state based on current path
  }, [location, navigationType]);

  useEffect(() => {
    const updateMaximizedState = () => {
      const focusedWindow = remote.BrowserWindow.getFocusedWindow();
      setIsMaximized(focusedWindow ? focusedWindow.isMaximized() : false);
    };

    updateMaximizedState();
    window.addEventListener('resize', updateMaximizedState);

    return () => {
      window.removeEventListener('resize', updateMaximizedState);
    };
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (canGoBack) {
      navigate(-1);
      setCanGoForward(true);
    }
  };

  const handleForward = (e) => {
    e.preventDefault();
    if (canGoForward) {
      navigate(1);
    }
  };

  const handleHome = () => {
    if (!isHome) {
      navigate('/');
    }
  };

  const startDrag = (e) => {
    if (e.button !== 0) return;
    ipcRenderer.send('dragWindow');
  };

  const handleClose = () => {
    remote.BrowserWindow.getFocusedWindow().close();
  };

  const handleMaximize = () => {
    const focusedWindow = remote.BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (isMaximized) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    }
  };

  const handleMinimize = () => {
    remote.BrowserWindow.getFocusedWindow().minimize();
  };

  const onPlayerPage = location.pathname.includes('player');

  return (
    <div
      onMouseDown={startDrag}
      className={`header ${onPlayerPage ? 'bg-transparent' : ''}`}
      style={{ WebkitAppRegion: 'drag' }}
    >
      {!onPlayerPage ? (
        <ShineBorder
          color={['#FE8FB5', '#7be5ff']}
          className="fixed w-full bg-zinc-950 overflow-hidden flex top-0 left-0 right-0 py-2 px-8"
        >
          <div
            className="flex flex-row w-full h-full justify-between items-center"
            style={{ zIndex: 9000 }}
          >
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={`focus:outline-none ${canGoBack ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}
              >
                <Icon
                  icon="gravity-ui:chevron-left"
                  width="28"
                  height="28"
                  className={canGoBack ? 'text-white' : 'text-gray-500'}
                />
              </button>
              <button
                onClick={handleForward}
                disabled={!canGoForward}
                className={`focus:outline-none ${canGoForward ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}
              >
                <Icon
                  icon="gravity-ui:chevron-right"
                  width="28"
                  height="28"
                  className={canGoForward ? 'text-white' : 'text-gray-500'}
                />
              </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex flex-row items-center gap-2">
              <button onClick={handleMinimize} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
                <Icon icon="gravity-ui:minus" width="26" height="26" />
              </button>
              <button onClick={handleMaximize} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
                <Icon icon={isMaximized ? "gravity-ui:copy" : "gravity-ui:square"} width="26" height="26" />
              </button>
              <button onClick={handleClose} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
                <Icon icon="gravity-ui:xmark" width="26" height="26" />
              </button>
            </div>
          </div>
        </ShineBorder>
      ) : (
        <div className="fixed w-full overflow-hidden flex top-0 left-0 right-0 py-2 px-8">
          <div className="flex flex-row w-full h-full justify-between items-center" style={{ zIndex: 9000 }}>
            <div className="flex flex-row items-center gap-2">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={`focus:outline-none ${canGoBack ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}
              >
                <div className={onPlayerPage ? 'filter drop-shadow-md' : ''}>
                  <Icon
                    icon="gravity-ui:chevron-left"
                    width="28"
                    height="28"
                    className={canGoBack ? 'text-white' : 'text-gray-500'}
                  />
                </div>
              </button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex flex-row items-center gap-2">
              {['minimize', 'maximize', 'close'].map((action) => (
                <button
                  key={action}
                  onClick={action === 'minimize' ? handleMinimize : action === 'maximize' ? handleMaximize : handleClose}
                  style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}
                >
                  <div className={onPlayerPage ? 'filter drop-shadow-md' : ''}>
                    <Icon
                      icon={
                        action === 'minimize'
                          ? "gravity-ui:minus"
                          : action === 'maximize'
                            ? isMaximized ? "gravity-ui:copy" : "gravity-ui:square"
                            : "gravity-ui:xmark"
                      }
                      width="26"
                      height="26"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

module.exports = Header;
