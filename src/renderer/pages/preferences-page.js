const React = require('react');
const PropTypes = require('prop-types');

const { styled } = require('@mui/material/styles');
const Checkbox = require('@mui/material/Checkbox').default;
const Button = require('@mui/material/Button').default;
const TextField = require('@mui/material/TextField').default;
const FormControlLabel = require('@mui/material/FormControlLabel').default;
const Box = require('@mui/material/Box').default;
const Typography = require('@mui/material/Typography').default;

const Heading = require('../components/heading');
const PathSelector = require('../components/path-selector');

const { dispatch } = require('../lib/dispatcher');
const config = require('../../config');

const StyledPreferencesPage = styled('div')(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginLeft: 25,
  marginRight: 25
}));

class PreferencesPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleDownloadPathChange = this.handleDownloadPathChange.bind(this);

    this.handleOpenExternalPlayerChange =
      this.handleOpenExternalPlayerChange.bind(this);

    this.handleExternalPlayerPathChange =
      this.handleExternalPlayerPathChange.bind(this);

    this.handleStartupChange = this.handleStartupChange.bind(this);

    this.handleSoundNotificationsChange =
      this.handleSoundNotificationsChange.bind(this);

    this.handleSetGlobalTrackers = this.handleSetGlobalTrackers.bind(this);

    const globalTrackers = this.props.state.getGlobalTrackers().join('\n');

    this.state = {
      globalTrackers
    };
  }

  downloadPathSelector() {
    return (
      <Preference>
        <PathSelector
          dialog={{
            title: 'Select download directory',
            properties: ['openDirectory']
          }}
          onChange={this.handleDownloadPathChange}
          title="Download location"
          value={this.props.state.saved.prefs.downloadPath}
        />
      </Preference>
    );
  }

  handleDownloadPathChange(filePath) {
    dispatch('updatePreferences', 'downloadPath', filePath);
  }

  openExternalPlayerCheckbox() {
    return (
      <Preference>
        <FormControlLabel
          control={
            <Checkbox
              className="control"
              checked={!this.props.state.saved.prefs.openExternalPlayer}
              onChange={this.handleOpenExternalPlayerChange}
            />
          }
          label="Play torrent media files using WebTorrent"
        />
      </Preference>
    );
  }

  handleOpenExternalPlayerChange(e, isChecked) {
    dispatch('updatePreferences', 'openExternalPlayer', !isChecked);
  }

  highestPlaybackPriorityCheckbox() {
    return (
      <Preference>
        <FormControlLabel
          control={
            <Checkbox
              className="control"
              checked={this.props.state.saved.prefs.highestPlaybackPriority}
              onChange={this.handleHighestPlaybackPriorityChange}
            />
          }
          label="Highest Playback Priority"
        />
        <Typography variant="body2">
          Pauses all active torrents to allow playback to use all of the
          available bandwidth.
        </Typography>
      </Preference>
    );
  }

  handleHighestPlaybackPriorityChange(e, isChecked) {
    dispatch('updatePreferences', 'highestPlaybackPriority', isChecked);
  }

  externalPlayerPathSelector() {
    const playerPath = this.props.state.saved.prefs.externalPlayerPath;
    const playerName = this.props.state.getExternalPlayerName();

    const description = this.props.state.saved.prefs.openExternalPlayer
      ? `Torrent media files will always play in ${playerName}.`
      : `Torrent media files will play in ${playerName} if WebTorrent cannot play them.`;

    return (
      <Preference>
        <p>{description}</p>
        <PathSelector
          dialog={{
            title: 'Select media player app',
            properties: ['openFile']
          }}
          onChange={this.handleExternalPlayerPathChange}
          title="External player"
          value={playerPath}
        />
      </Preference>
    );
  }

  handleExternalPlayerPathChange(filePath) {
    dispatch('updatePreferences', 'externalPlayerPath', filePath);
  }

  autoAddTorrentsCheckbox() {
    return (
      <Preference>
        <Checkbox
          className="control"
          checked={this.props.state.saved.prefs.autoAddTorrents}
          label="Watch for new .torrent files and add them immediately"
          onCheck={(e, value) => {
            this.handleAutoAddTorrentsChange(e, value);
          }}
        />
      </Preference>
    );
  }

  handleAutoAddTorrentsChange(e, isChecked) {
    const torrentsFolderPath = this.props.state.saved.prefs.torrentsFolderPath;
    if (isChecked && !torrentsFolderPath) {
      alert('Select a torrents folder first.'); // eslint-disable-line
      e.preventDefault();
      return;
    }

    dispatch('updatePreferences', 'autoAddTorrents', isChecked);

    if (isChecked) {
      dispatch('startFolderWatcher');
      return;
    }

    dispatch('stopFolderWatcher');
  }

  torrentsFolderPathSelector() {
    const torrentsFolderPath = this.props.state.saved.prefs.torrentsFolderPath;

    return (
      <Preference>
        <PathSelector
          dialog={{
            title: 'Select folder to watch for new torrents',
            properties: ['openDirectory']
          }}
          onChange={this.handleTorrentsFolderPathChange}
          title="Folder to watch"
          value={torrentsFolderPath}
        />
      </Preference>
    );
  }

  handleTorrentsFolderPathChange(filePath) {
    dispatch('updatePreferences', 'torrentsFolderPath', filePath);
  }

  setDefaultAppButton() {
    const isFileHandler = this.props.state.saved.prefs.isFileHandler;
    if (isFileHandler) {
      return (
        <Preference>
          <Typography>
            WebTorrent is your default torrent app. Hooray!
          </Typography>
        </Preference>
      );
    }
    return (
      <Preference>
        <Typography>
          WebTorrent is not currently the default torrent app.
        </Typography>
        <Button
          className="control"
          onClick={this.handleSetDefaultApp}
          variant="contained"
        >
          Make WebTorrent the default
        </Button>
      </Preference>
    );
  }

  handleStartupChange(e, isChecked) {
    dispatch('updatePreferences', 'startup', isChecked);
  }

  setStartupCheckbox() {
    if (config.IS_PORTABLE) {
      return;
    }

    return (
      <Preference>
        <Checkbox
          className="control"
          checked={this.props.state.saved.prefs.startup}
          label="Open WebTorrent on startup"
          onCheck={this.handleStartupChange}
        />
      </Preference>
    );
  }

  soundNotificationsCheckbox() {
    return (
      <Preference>
        <Checkbox
          className="control"
          checked={this.props.state.saved.prefs.soundNotifications}
          label="Enable sounds"
          onCheck={this.handleSoundNotificationsChange}
        />
      </Preference>
    );
  }

  handleSoundNotificationsChange(e, isChecked) {
    dispatch('updatePreferences', 'soundNotifications', isChecked);
  }

  handleSetDefaultApp() {
    dispatch('updatePreferences', 'isFileHandler', true);
  }

  setGlobalTrackers() {
    return (
      <Preference>
        <TextField
          className="torrent-trackers control"
          multiline
          minRows={2}
          maxRows={10}
          value={this.state.globalTrackers}
          onChange={this.handleSetGlobalTrackers}
          fullWidth
        />
      </Preference>
    );
  }

  handleSetGlobalTrackers(event) {
    const globalTrackers = event.target.value;
    this.setState({ globalTrackers });

    const announceList = globalTrackers
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    dispatch('updatePreferences', 'globalTrackers', announceList);
    dispatch('updateGlobalTrackers', announceList);
  }

  render() {
    return (
      <StyledPreferencesPage>
        <PreferencesSection title="Folders">
          {this.downloadPathSelector()}
          {this.autoAddTorrentsCheckbox()}
          {this.torrentsFolderPathSelector()}
        </PreferencesSection>
        <PreferencesSection title="Playback">
          {this.openExternalPlayerCheckbox()}
          {this.externalPlayerPathSelector()}
          {this.highestPlaybackPriorityCheckbox()}
        </PreferencesSection>
        <PreferencesSection title="Default torrent app">
          {this.setDefaultAppButton()}
        </PreferencesSection>
        <PreferencesSection title="General">
          {this.setStartupCheckbox()}
          {this.soundNotificationsCheckbox()}
        </PreferencesSection>
        <PreferencesSection title="Trackers">
          {this.setGlobalTrackers()}
        </PreferencesSection>
      </StyledPreferencesPage>
    );
  }
}

class PreferencesSection extends React.Component {
  static get propTypes() {
    return {
      title: PropTypes.string
    };
  }

  render() {
    return (
      <Box sx={{ marginBottom: 3, marginTop: 3 }}>
        <Heading level={2}>{this.props.title}</Heading>
        {this.props.children}
      </Box>
    );
  }
}

class Preference extends React.Component {
  render() {
    return <Box sx={{ marginBottom: 1 }}>{this.props.children}</Box>;
  }
}

module.exports = PreferencesPage;
