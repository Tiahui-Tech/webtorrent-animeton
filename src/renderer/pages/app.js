const React = require('react');
const { useState, useEffect } = React;
const { MemoryRouter, Routes, Route, useLocation } = require('react-router-dom');

const Header = require('../components/header');

// Perf optimization: Needed immediately, so do not lazy load it
const Home = require('./Home');
const AnimeDetails = require('./AnimeDetails');

const Player = React.lazy(() => require('./player-page'));
const CreateTorrent = React.lazy(() => require('./create-torrent-page'));
const Preferences = require('./preferences-page');

const Modals = {
  'open-torrent-address-modal': React.lazy(() =>
    require('../components/open-torrent-address-modal')
  ),
  'remove-torrent-modal': React.lazy(() =>
    require('../components/remove-torrent-modal')
  ),
  'update-available-modal': React.lazy(() =>
    require('../components/update-available-modal')
  ),
  'unsupported-media-modal': React.lazy(() =>
    require('../components/unsupported-media-modal')
  ),
  'delete-all-torrents-modal': React.lazy(() =>
    require('../components/delete-all-torrents-modal')
  )
};

function App({ initialState, onUpdate }) {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AppContent initialState={initialState} onUpdate={onUpdate} />
    </MemoryRouter>
  );
}

function AppContent({ initialState, onUpdate }) {
  const [state, setState] = useState(initialState);
  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setState(prevState => {
        const newState = { ...prevState /* actualiza el estado aquí */ };
        onUpdate(newState);
        return newState;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onUpdate]);

  const hideControls = state.shouldHidePlayerControls();

  const cls = ['view-' + location.pathname.slice(1), 'is-' + process.platform];
  if (state.window.isFullScreen) cls.push('is-fullscreen');
  if (state.window.isFocused) cls.push('is-focused');
  if (hideControls) cls.push('hide-video-controls');

  return (
    <main className={`dark text-foreground bg-background min-h-screen overflow-y-auto ${cls.join(' ')}`}>
      <div className={'app'}>
        <Header state={state} />
        <ErrorPopover state={state} />
        <div key="content" className="content">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home state={state} />} />
              <Route path="/anime-details/:idAnilist" element={<AnimeDetails state={state} />} />
              <Route path="/player" element={<Player state={state} />} />
              <Route path="/create-torrent" element={<CreateTorrent state={state} />} />
              <Route path="/preferences" element={<Preferences state={state} />} />
            </Routes>
          </React.Suspense>
        </div>
        <Modal state={state} />
      </div>
    </main>
  );
}

function ErrorPopover({ state }) {
  const now = new Date().getTime();
  const recentErrors = state.errors.filter((x) => now - x.time < 5000);
  const hasErrors = recentErrors.length > 0;

  if (!hasErrors) return null;

  return (
    <div key="errors" className="error-popover visible">
      <div key="title" className="title">Error</div>
      {recentErrors.map((error, i) => (
        <div key={i} className="error">{error.message}</div>
      ))}
    </div>
  );
}

function Modal({ state }) {
  if (!state.modal) return null;

  const ModalContents = Modals[state.modal.id];

  return (
    <div key="modal" className="modal">
      <div key="modal-background" className="modal-background" />
      <div key="modal-content" className="modal-content">
        <React.Suspense fallback={<div>Loading modal...</div>}>
          <ModalContents state={state} />
        </React.Suspense>
      </div>
    </div>
  );
}

module.exports = App;