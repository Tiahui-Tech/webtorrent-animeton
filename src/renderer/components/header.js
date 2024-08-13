const React = require('react');
const { useState, useEffect } = require('react');
const { useNavigate, useLocation, useNavigationType } = require('react-router-dom');

const { dispatcher } = require('../lib/dispatcher');

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

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
      setCanGoForward(true);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  return (
    <div
      className='header'
      onMouseMove={dispatcher('mediaMouseMoved')}
      onMouseEnter={dispatcher('mediaControlsMouseEnter')}
      onMouseLeave={dispatcher('mediaControlsMouseLeave')}
      role='navigation'
    >
      {process.platform === 'darwin' && (
        <div className="title ellipsis" title={state.window.title}>
          {state.window.title}
        </div>
      )}
      <div className='nav left float-left'>
        <i
          className={`icon back ${canGoBack ? '' : 'disabled'}`}
          title='Back'
          onClick={handleBack}
          role='button'
          aria-disabled={!canGoBack}
          aria-label='Back'
        >
          chevron_left
        </i>
        <i
          className={`icon forward ${canGoForward ? '' : 'disabled'}`}
          title='Forward'
          onClick={handleForward}
          role='button'
          aria-disabled={!canGoForward}
          aria-label='Forward'
        >
          chevron_right
        </i>
      </div>
    </div>
  );
}

module.exports = Header;