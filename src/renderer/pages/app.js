const React = require('react');
const { useState, useEffect, useRef } = React;
const { MemoryRouter, Routes, Route, useLocation, useNavigate } = require('react-router-dom');

const Header = require('../components/common/header');

// Perf optimization: Needed immediately, so do not lazy load it
const Home = require('./Home');
const AnimeDetails = require('./AnimeDetails');

const Player = require('./player-page')
const CreateTorrent = React.lazy(() => require('./create-torrent-page'));
const Preferences = require('./preferences-page');

const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
const eventBus = require('../lib/event-bus');

let currentPath = '/';
function getCurrentPath() {
  return currentPath;
}

const Modals = {
  'open-torrent-address-modal': React.lazy(() =>
    require('../components/common/modal/open-torrent-address-modal')
  ),
  'remove-torrent-modal': React.lazy(() =>
    require('../components/common/modal/remove-torrent-modal')
  ),
  'update-available-modal': React.lazy(() =>
    require('../components/common/modal/update-available-modal')
  ),
  'unsupported-media-modal': React.lazy(() =>
    require('../components/common/modal/unsupported-media-modal')
  ),
  'delete-all-torrents-modal': React.lazy(() =>
    require('../components/common/modal/delete-all-torrents-modal')
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
  const navigate = useNavigate();

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    currentPath = location.pathname;

    const stateUpdateHandler = (newPartialState) => {
      setState(prevState => {
        const updatedState = deepMerge({...prevState}, newPartialState);
        return updatedState;
      });
    };
    eventBus.on('stateUpdate', stateUpdateHandler);

    const navigationHandler = ({ path, state }) => {
      navigate(path, { state });
    };
    eventEmitter.on('navigate', navigationHandler);

    return () => {
      eventEmitter.off('navigate', navigationHandler);
      eventBus.off('stateUpdate', stateUpdateHandler);
    };
  }, [navigate, location]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(stateRef.current);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [state, onUpdate]);

  const hideControls = state.shouldHidePlayerControls();

  const cls = ['view-' + location.pathname.slice(1), 'is-' + process.platform];
  if (state.window.isFullScreen) cls.push('is-fullscreen');
  if (state.window.isFocused) cls.push('is-focused');
  if (hideControls) cls.push('hide-video-controls');

  return (
    <main className={`app`}>
      <div className={`dark text-foreground bg-background min-h-screen overflow-y-auto ${cls.join(' ')}`}>
        <Header state={state} />
        <ErrorPopover state={state} />
        <div key="content" className="content">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home state={state} />} />
              <Route path="/anime/:idAnilist" element={<AnimeDetails state={state} />} />
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

function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object') {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

module.exports = { App, eventEmitter, getCurrentPath };