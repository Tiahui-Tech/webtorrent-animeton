const React = require('react');
const { ipcRenderer } = require('electron');
const remote = require('@electron/remote')
const { useState, useEffect } = require('react');
const {
  useNavigate,
  useLocation,
  useNavigationType
} = require('react-router-dom');
const ShineBorder = require('../components/MagicUI/effects/ShineBorder');
const SparklesText = require('../components/MagicUI/effects/SparklesText');
const { Icon } = require('@iconify/react');

const Header = ({ state }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // Updates the navigation state every time the location or navigation type changes
    setCanGoBack(navigationType !== 'POP' || location.key !== 'default');
    setCanGoForward(false); // Reset on each navigation
  }, [location, navigationType]);

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

  const startDrag = (e) => {
    if (e.button !== 0) return;
    ipcRenderer.send('dragWindow');
  };

  const handleClose = () => {
    remote.BrowserWindow.getFocusedWindow().close();
  };

  const handleMaximize = () => {
    if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
      remote.BrowserWindow.getFocusedWindow().unmaximize()
    } else {
      remote.BrowserWindow.getFocusedWindow().maximize()
    }
  };

  const handleMinimize = () => {
    remote.BrowserWindow.getFocusedWindow().minimize();
  };

  return (
    <div
      onMouseDown={startDrag}
      className="header"
      style={{ WebkitAppRegion: 'drag' }}
    >
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
          <SparklesText
            sparklesCount={8}
            className="text-white font-bold text-xl"
            text="NyaUWU"
          />
          <div className="flex flex-row items-center gap-2">
            <button onClick={handleMinimize} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
              <Icon icon="gravity-ui:minus" width="26" height="26" />
            </button>
            <button onClick={handleMaximize} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
              <Icon icon="gravity-ui:square" width="26" height="26" />
            </button>
            <button onClick={handleClose} style={{ WebkitAppRegion: 'no-drag', zIndex: 9999 }}>
              <Icon icon="gravity-ui:xmark" width="26" height="26" />
            </button>
          </div>
        </div>
      </ShineBorder>
    </div>
  );
};

module.exports = Header;
