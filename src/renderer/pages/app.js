const React = require('react');
const createGetter = require('fn-getter');

const Header = require('../components/header');

// Perf optimization: Needed immediately, so do not lazy load it below
const Home = require('./home');
const AnimeDetailsPage = require('./anime-details');

const Views = {
  home: createGetter(() => Home),
  'anime-details': createGetter(() => (props) => (
    <AnimeDetailsPage {...props} />
  )),
  player: createGetter(() => require('./player-page')),
  'create-torrent': createGetter(() => require('./create-torrent-page')),
  preferences: createGetter(() => require('./preferences-page'))
};

const Modals = {
  'open-torrent-address-modal': createGetter(() =>
    require('../components/open-torrent-address-modal')
  ),
  'remove-torrent-modal': createGetter(() =>
    require('../components/remove-torrent-modal')
  ),
  'update-available-modal': createGetter(() =>
    require('../components/update-available-modal')
  ),
  'unsupported-media-modal': createGetter(() =>
    require('../components/unsupported-media-modal')
  ),
  'delete-all-torrents-modal': createGetter(() =>
    require('../components/delete-all-torrents-modal')
  )
};

const fontFamily =
  process.platform === 'win32'
    ? '"Segoe UI", sans-serif'
    : 'BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif';

class App extends React.Component {
  render() {
    const state = this.props.state;

    const hideControls = state.shouldHidePlayerControls();

    const cls = ['view-' + state.location.url(), 'is-' + process.platform];
    if (state.window.isFullScreen) cls.push('is-fullscreen');
    if (state.window.isFocused) cls.push('is-focused');
    if (hideControls) cls.push('hide-video-controls');

    return (
      <main className="dark text-foreground bg-background min-h-screen overflow-y-auto">
        <div className={'app'}>
          <Header state={state} />
          {this.getErrorPopover()}
          <div key="content" className="content">
            {this.getView()}
          </div>
          {this.getModal()}
        </div>
      </main>
    );
  }

  getErrorPopover() {
    const state = this.props.state;
    const now = new Date().getTime();
    const recentErrors = state.errors.filter((x) => now - x.time < 5000);
    const hasErrors = recentErrors.length > 0;

    const errorElems = recentErrors.map((error, i) => (
      <div key={i} className="error">
        {error.message}
      </div>
    ));
    return (
      <div
        key="errors"
        className={'error-popover ' + (hasErrors ? 'visible' : 'hidden')}
      >
        <div key="title" className="title">
          Error
        </div>
        {errorElems}
      </div>
    );
  }

  getModal() {
    const state = this.props.state;
    if (!state.modal) return;

    const ModalContents = Modals[state.modal.id]();
    return (
      <div key="modal" className="modal">
        <div key="modal-background" className="modal-background" />
        <div key="modal-content" className="modal-content">
          <ModalContents state={state} />
        </div>
      </div>
    );
  }

  getView() {
    const state = this.props.state;
    const View = Views[state.location.url()]();
    return <View state={state} />;
  }
}

module.exports = App;
