module.exports = {
  isPlayable,
  isVideo,
  isAudio,
  isTorrent,
  isMagnetLink,
  isPlayableTorrentSummary,
  playTorrent
}

const path = require('path')
const { dispatch } = require('./dispatcher');
const mediaExtensions = require('./media-extensions')

// Checks whether a fileSummary or file path is audio/video that we can play,
// based on the file extension
function isPlayable (file) {
  return isVideo(file) || isAudio(file)
}

// Checks whether a fileSummary or file path is playable video
function isVideo (file) {
  return mediaExtensions.video.includes(getFileExtension(file))
}

// Checks whether a fileSummary or file path is playable audio
function isAudio (file) {
  return mediaExtensions.audio.includes(getFileExtension(file))
}

// Checks if the argument is either:
// - a string that's a valid filename ending in .torrent
// - a file object where obj.name is ends in .torrent
// - a string that's a magnet link (magnet://...)
function isTorrent (file) {
  return isTorrentFile(file) || isMagnetLink(file)
}

function isTorrentFile (file) {
  return getFileExtension(file) === '.torrent'
}

function isMagnetLink (link) {
  return typeof link === 'string' && /^(stream-)?magnet:/.test(link)
}

function getFileExtension (file) {
  const name = typeof file === 'string' ? file : file?.name || 'Anime Name'
  return path.extname(name).toLowerCase()
}

function isPlayableTorrentSummary (torrentSummary) {
  return torrentSummary.files && torrentSummary.files.some(isPlayable)
}

function playTorrent (anime, state, setIsLoading) {
  setIsLoading(true);
  
  const hash = anime.torrent?.infohash || anime.torrent?.infoHash;
  const torrent = state.saved.torrents.find(
    (torrent) => torrent.infoHash === hash
  );

  if (!torrent) {
    dispatch('addTorrent', anime.torrent.link);

    // Wait 5 seconds to avoid errors and allow backend to prepare the torrent
    setTimeout(() => {
      dispatch('playFile', hash);
      setIsLoading(false);
    }, 5000);

    return;
  }

  const file = torrent.files.at(0);
  const isTorrentPlayable = isPlayable(file);

  if (isTorrentPlayable) {
    dispatch('toggleSelectTorrent', torrent.infoHash);

    // Wait 5 seconds to avoid errors and allow backend to prepare the torrent
    // Improves effectiveness as it's not the first to play in the app
    setTimeout(() => {
      dispatch('playFile', hash);
      setIsLoading(false);
    }, 5000);
  }
};
