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
function isPlayable(file) {
  return isVideo(file) || isAudio(file)
}

// Checks whether a fileSummary or file path is playable video
function isVideo(file) {
  return mediaExtensions.video.includes(getFileExtension(file))
}

// Checks whether a fileSummary or file path is playable audio
function isAudio(file) {
  return mediaExtensions.audio.includes(getFileExtension(file))
}

// Checks if the argument is either:
// - a string that's a valid filename ending in .torrent
// - a file object where obj.name is ends in .torrent
// - a string that's a magnet link (magnet://...)
function isTorrent(file) {
  return isTorrentFile(file) || isMagnetLink(file)
}

function isTorrentFile(file) {
  return getFileExtension(file) === '.torrent'
}

function isMagnetLink(link) {
  return typeof link === 'string' && /^(stream-)?magnet:/.test(link)
}

function getFileExtension(file) {
  const name = typeof file === 'string' ? file : file?.name || 'Anime Name'
  return path.extname(name).toLowerCase()
}

function isPlayableTorrentSummary(torrentSummary) {
  return torrentSummary.files && torrentSummary.files.some(isPlayable)
}

function playTorrent(anime, state, setIsLoading) {
  if (!anime.torrent) {
    return;
  }

  setIsLoading(true);

  const hash = anime.torrent?.infohash || anime.torrent?.infoHash;
  const torrent = state.saved.torrents.find(
    (torrent) => torrent.infoHash === hash
  );
  const torrentUrl = anime.torrent?.torrentUrl || anime.torrent?.magnetUrl || anime.torrent?.link;

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
    dispatch('playFile', hash);

    setIsLoading(false);
  } else {
    // Check if the torrent is playable every second
    const checkPlayableInterval = setInterval(() => {
      const updatedTorrent = state.saved.torrents.find(
        (t) => t.infoHash === hash
      );
      if (updatedTorrent && updatedTorrent.files.some(isPlayable)) {
        clearInterval(checkPlayableInterval);
        dispatch('toggleSelectTorrent', updatedTorrent.infoHash);
        dispatch('playFile', hash);
        setIsLoading(false);
      }
    }, 1000);

    // Set a timeout to stop checking after 60 seconds (1 minute)
    setTimeout(() => {
      clearInterval(checkPlayableInterval);
      setIsLoading(false);
      console.log('Timeout: Torrent not playable after 1 minute');
    }, 60000);
  }
};
