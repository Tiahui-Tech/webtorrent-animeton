const React = require('react');
const { useNavigate, useLocation, useNavigationType } = require('react-router-dom');

const { dispatcher } = require('../lib/dispatcher');

function Header({ state }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);

  React.useEffect(() => {
    // Actualiza el estado de navegación cada vez que cambia la ubicación o el tipo de navegación
    setCanGoBack(navigationType !== 'POP' || location.key !== 'default');
    setCanGoForward(false); // Se reinicia en cada navegación
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

  const getTitle = () => {
    if (process.platform !== 'darwin') return null;
    return (<div className='title ellipsis'>{state.window.title}</div>);
  };

  const getAddButton = () => {
    if (location.pathname !== '/') return null;
    return (
      <i
        className='icon add'
        title='Add torrent'
        onClick={dispatcher('openFiles')}
        role='button'
      >
        add
      </i>
    );
  };

  return (
    <div
      className='header'
      onMouseMove={dispatcher('mediaMouseMoved')}
      onMouseEnter={dispatcher('mediaControlsMouseEnter')}
      onMouseLeave={dispatcher('mediaControlsMouseLeave')}
      role='navigation'
    >
      {getTitle()}
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
      <div className='nav right float-right'>
        {getAddButton()}
      </div>
    </div>
  );
}

module.exports = Header;