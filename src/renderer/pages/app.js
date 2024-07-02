const React = require('react')
const createGetter = require('fn-getter')
const { createTheme, ThemeProvider } = require('@mui/material/styles')
const CssBaseline = require('@mui/material/CssBaseline').default
const Box = require('@mui/material/Box').default
const { grey, red } = require('@mui/material/colors')

const Header = require('../components/header')

// Perf optimization: Needed immediately, so do not lazy load it below
const TorrentListPage = require('./torrent-list-page')

const Views = {
  home: createGetter(() => TorrentListPage),
  player: createGetter(() => require('./player-page')),
  'create-torrent': createGetter(() => require('./create-torrent-page')),
  preferences: createGetter(() => require('./preferences-page'))
}

const Modals = {
  'open-torrent-address-modal': createGetter(
    () => require('../components/open-torrent-address-modal')
  ),
  'remove-torrent-modal': createGetter(() => require('../components/remove-torrent-modal')),
  'update-available-modal': createGetter(() => require('../components/update-available-modal')),
  'unsupported-media-modal': createGetter(() => require('../components/unsupported-media-modal')),
  'delete-all-torrents-modal':
      createGetter(() => require('../components/delete-all-torrents-modal'))
}

const fontFamily = process.platform === 'win32'
  ? '"Segoe UI", sans-serif'
  : 'BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: grey[50],
    },
    secondary: {
      main: red.A200,
    },
  },
  typography: {
    fontFamily: fontFamily,
  },
})

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: fontFamily,
  },
})

class App extends React.Component {
  render () {
    const state = this.props.state

    const hideControls = state.shouldHidePlayerControls()

    const cls = [
      'view-' + state.location.url(),
      'is-' + process.platform
    ]
    if (state.window.isFullScreen) cls.push('is-fullscreen')
    if (state.window.isFocused) cls.push('is-focused')
    if (hideControls) cls.push('hide-video-controls')

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box className={'app ' + cls.join(' ')}>
          <Header state={state} />
          {this.getErrorPopover()}
          <Box key='content' className='content'>{this.getView()}</Box>
          {this.getModal()}
        </Box>
      </ThemeProvider>
    )
  }

  getErrorPopover () {
    const state = this.props.state
    const now = new Date().getTime()
    const recentErrors = state.errors.filter((x) => now - x.time < 5000)
    const hasErrors = recentErrors.length > 0

    const errorElems = recentErrors.map((error, i) => <Box key={i} className='error'>{error.message}</Box>)
    return (
      <Box
        key='errors'
        className={'error-popover ' + (hasErrors ? 'visible' : 'hidden')}
      >
        <Box key='title' className='title'>Error</Box>
        {errorElems}
      </Box>
    )
  }

  getModal () {
    const state = this.props.state
    if (!state.modal) return

    const ModalContents = Modals[state.modal.id]()
    return (
      <ThemeProvider theme={lightTheme}>
        <Box key='modal' className='modal'>
          <Box key='modal-background' className='modal-background' />
          <Box key='modal-content' className='modal-content'>
            <ModalContents state={state} />
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  getView () {
    const state = this.props.state
    const View = Views[state.location.url()]()
    return (<View state={state} />)
  }
}

module.exports = App