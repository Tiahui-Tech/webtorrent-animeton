const React = require('react')
const { useEffect, useState } = require('react')
const prettyBytes = require('prettier-bytes')
const fastLevenshtein = require('fast-levenshtein');

const { Stack, Box, Typography, Grid, Chip } = require('@mui/material')
const { Card, CardHeader, CardBody, Image, Button } = require('@nextui-org/react')
const { Icon } = require('@iconify/react');

const { CalendarToday, LiveTv, Movie, MusicNote, Book, PlayArrow } = require('@mui/icons-material');

const TorrentSummary = require('../lib/torrent-summary')
const TorrentPlayer = require('../lib/torrent-player')
const { dispatcher, dispatch } = require('../lib/dispatcher')
const { calculateEta } = require('../lib/time')
const { fetchAndParseRSS } = require('../../modules/rss')
const { anitomyscript } = require('../../modules/anime');

const normalize = title => title.toLowerCase().replace(/[^a-z0-9]/g, '');

const TorrentList = ({ state }) => {
  const [animes, setAnimes] = useState(null);
  const [rssAnimes, setRSSAnimes] = useState(null);

  useEffect(() => {
    const getAnimes = async () => {
      const response = await fetch('http://localhost:3000/anime')
      const animes = await response.json()
      setAnimes(animes)
    }
    const getRSSAnimes = async () => {
      const page = 1
      const perPage = 6
      const data = await fetchAndParseRSS(page, perPage)

      const resolvedData = await processAnimes(data)

      const filteredRssAnimes = resolvedData.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id) && item.episode && item.torrent
      )

      setRSSAnimes(filteredRssAnimes.slice(0, 4));
    }
    getAnimes();
    getRSSAnimes();
  }, [])

  const contents = []

  const processAnimes = async (data) => {
    const animeTitles = data.map(anime => anime.title);
    const parsedAnimes = await anitomyscript(animeTitles);

    const response = await fetch('http://localhost:3000/anime/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animes: parsedAnimes.map(a => a.anime_title) })
    });
    const animes = await response.json()

    const resolvedData = await Promise.all(animes.map(async (anime) => {
      const bestMatch = parsedAnimes.reduce((best, parsed) => {
        const distance = fastLevenshtein.get(
          normalize(anime.title.romaji),
          normalize(parsed.anime_title)
        );
        return distance < best.distance ? { parsed, distance } : best;
      }, { distance: Infinity }).parsed;

      if (bestMatch && bestMatch.episode_number) {
        const episodeData = await fetch(`http://localhost:3000/anime/${anime.idAnil}/${bestMatch.episode_number}`).then(res => res.json());
        const rssTorrent = data.find(anim => anim.title === bestMatch.file_name);
        return { ...anime, episode: episodeData, torrent: rssTorrent };
      }
      return null;
    }));

    return resolvedData.filter(Boolean);
  }

  if (animes && rssAnimes) {
    const getStatusColor = (status) => {
      switch (status) {
        case 'RELEASING': return 'success';
        case 'FINISHED': return 'primary';
        case 'NOT_YET_RELEASED': return 'warning';
        case 'CANCELLED': return 'error';
        case 'HIATUS': return 'secondary';
        default: return 'default';
      }
    };

    const getStatusLabel = (status) => {
      switch (status) {
        case 'RELEASING': return 'EN EMISIÓN';
        case 'FINISHED': return 'FINALIZADO';
        case 'NOT_YET_RELEASED': return 'NO LANZADO';
        case 'CANCELLED': return 'CANCELADO';
        case 'HIATUS': return 'HIATUS';
        default: return 'default';
      }
    };

    const getFormatIcon = (format) => {
      switch (format) {
        case 'TV': return <LiveTv />;
        case 'MOVIE': return <Movie />;
        case 'OVA':
        case 'ONA': return <LiveTv />;
        case 'MUSIC': return <MusicNote />;
        case 'MANGA':
        case 'NOVEL':
        case 'ONE_SHOT': return <Book />;
        default: return null;
      }
    };

    const timeAgo = dateISO => {
      const now = new Date();
      const date = new Date(dateISO);
      const seconds = Math.floor((now - date) / 1000);

      const units = [
        { limit: 60, unit: 'segundo', divisor: 1 },
        { limit: 3600, unit: 'minuto', divisor: 60 },
        { limit: 86400, unit: 'hora', divisor: 3600 },
        { limit: 2592000, unit: 'dia', divisor: 86400 }
      ];

      for (const { limit, unit, divisor } of units) {
        if (seconds < limit) {
          const quantity = Math.floor(seconds / divisor);
          return `Hace ${quantity} ${unit}${quantity !== 1 ? 's' : ''}`;
        }
      }
    };

    const getAnimeFlags = (animeTitle) => {
      const allowedFlags = ['mx', 'es', 'us'];
      const flagRegex = /\[([a-z]{2})\]/g;
      const matches = animeTitle.match(flagRegex);

      if (!matches) return [];

      return allowedFlags
        .filter(flag => matches.some(match => match.includes(flag)))
        .map(flag => <Icon icon={`flagpack:${flag}`} width={24} height={24} />);
    };

    contents.push(
      <div className='p-8'>
        <h2 className='text-2xl font-bold mb-4'>Latest episodes</h2>
        <div className="grid grid-cols-4 gap-4">
          {rssAnimes.map((anime, i) => (
            <div key={`rss-${anime.id}-${i}`} className='max-w-[400px]'>
              <Card className="flex flex-col p-1">
                <CardHeader className='flex flex-col truncate items-start justify-start z-0'>
                  <p className='truncate w-full font-semibold'>{anime.title.romaji}</p>
                  <p className='text-sm'>
                    {`Episodio ${anime.episode.episodeNumber || anime.episode.episode || "??"}`}
                  </p>
                </CardHeader>
                <CardBody className='w-full h-full flex flex-col justify-between relative'>
                  <div className='relative'>
                    <Image
                      component="img"
                      src={anime.episode.image || anime.bannerImage}
                      alt={anime.title.romaji}
                      width={400}
                      className="w-full h-auto object-cover rounded"
                      style={{ aspectRatio: '16/9' }}
                    />
                    <div className='flex flex-row gap-2 bg-slate-950/25 px-1 py-0.5 rounded-md absolute top-2 right-2 z-50'>
                      {getAnimeFlags(anime.torrent.title)}
                    </div>
                  </div>
                  <div className='flex py-1 justify-between'>
                    <div className='flex items-center space-x-1 mb-1'>
                      <Icon icon="gravity-ui:calendar" />
                      <p className="text-sm">
                        {timeAgo(anime.torrent.pubDate)}
                      </p>
                    </div>
                    <div className='flex items-center space-x-1 mb-1'>
                      <p className="text-sm">
                        {`${anime.episode.runtime || anime.episode.length} mins`}
                      </p>
                      <Icon icon="gravity-ui:clock" />
                    </div>
                  </div>
                  <Button color='success' className='text-base font-semibold w-full' onClick={() => {
                    // IMPORTANTE: Usar 'dispatcher()' no funcionara si es una arrow function, se debera utilizar 'dispatch()'
                    const hash = anime.torrent.infohash
                    const torrent = state.saved.torrents.find(torrent => torrent.infoHash === hash);

                    if (torrent) {
                      return dispatch('playFile', torrent.infoHash)
                    }

                    dispatch('addTorrent', anime.torrent.link)
                    setTimeout(() => {
                      dispatch('playFile', hash)
                    }, 1500);
                  }}>
                    <PlayArrow />
                    VER
                  </Button>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
    )

    contents.push(
      <Stack gap={1} p={4}>
        <Typography ml={8} variant='h4'>Trending anime</Typography>
        <Grid container columnSpacing={4} rowSpacing={6} justifyContent="center">
          {animes.map((anime, i) => (
            <Grid item key={`anime-${anime.id}-${i}`}>
              <Stack sx={{ width: '256px', height: '100%' }}>
                <Box
                  component="img"
                  src={anime.coverImage.extraLarge}
                  alt={anime.title.romaji}
                  sx={{ aspectRatio: '9/14', objectFit: 'cover', borderRadius: 2 }}
                />
                <Stack>
                  <Typography component="div" gutterBottom noWrap sx={{
                    fontSize: 16,
                    fontWeight: 500
                  }}>
                    {anime.title.romaji}
                  </Typography>
                  <Stack justifyContent="space-between" direction="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {anime.seasonYear || '?'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getFormatIcon(anime.format)}
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {anime.format}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    label={getStatusLabel(anime.status)}
                    color={getStatusColor(anime.status)}
                    size="small"
                    sx={{
                      fontWeight: 500
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
    )
  }

  return (
    <div
      key='torrent-list'
      onContextMenu={dispatcher('openTorrentListContextMenu')}
    >
      {contents}
    </div>
  )

  function renderTorrent(torrentSummary) {
    const infoHash = torrentSummary.infoHash
    const isSelected = infoHash && state.selectedInfoHash === infoHash

    // Background image: show some nice visuals, like a frame from the movie, if possible
    const style = {}
    if (torrentSummary.posterFileName) {
      const gradient = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%)'
      const posterPath = TorrentSummary.getPosterPath(torrentSummary)
      style.backgroundImage = `${gradient}, url('${posterPath}')`
    }

    // Foreground: name of the torrent, basic info like size, play button,
    // cast buttons if available, and delete
    const classes = ['torrent']
    if (isSelected) classes.push('selected')
    if (!infoHash) classes.push('disabled')
    if (!torrentSummary.torrentKey) throw new Error('Missing torrentKey')
    return (
      <div
        id={torrentSummary.testID && ('torrent-' + torrentSummary.testID)}
        key={torrentSummary.torrentKey}
        style={style}
        className={classes.join(' ')}
        onContextMenu={infoHash && dispatcher('openTorrentContextMenu', infoHash)}
        onClick={infoHash && dispatcher('toggleSelectTorrent', infoHash)}
      >
        {renderTorrentMetadata(torrentSummary)}
        {infoHash ? renderTorrentButtons(torrentSummary) : null}
        {isSelected ? renderTorrentDetails(torrentSummary) : null}
        <hr />
      </div>
    )
  }

  // Show name, download status, % complete
  function renderTorrentMetadata(torrentSummary) {
    const name = torrentSummary.name || 'Loading torrent...'
    const elements = [(
      <div key='name' className='name ellipsis'>{name}</div>
    )]

    // If it's downloading/seeding then show progress info
    const prog = torrentSummary.progress
    let progElems
    if (torrentSummary.error) {
      progElems = [getErrorMessage(torrentSummary)]
    } else if (torrentSummary.status !== 'paused' && prog) {
      progElems = [
        renderDownloadCheckbox(),
        renderTorrentStatus(),
        renderProgressBar(),
        renderPercentProgress(),
        renderTotalProgress(),
        renderPeers(),
        renderSpeeds(),
        renderEta()
      ]
    } else {
      progElems = [
        renderDownloadCheckbox(),
        renderTorrentStatus()
      ]
    }
    elements.push(
      <div key='progress-info' className='ellipsis'>
        {progElems}
      </div>
    )

    return (<div key='metadata' className='metadata'>{elements}</div>)

    function renderDownloadCheckbox() {
      const infoHash = torrentSummary.infoHash
      const isActive = ['downloading', 'seeding'].includes(torrentSummary.status)
      return (
        <Checkbox
          key='download-button'
          className={'control download ' + torrentSummary.status}
          sx={{
            display: 'inline-block',
            width: 32
          }}
          checked={isActive}
          onClick={stopPropagation}
          onChange={() => dispatcher('toggleTorrent', infoHash)}
        />
      )
    }

    function renderProgressBar() {
      const progress = Math.floor(100 * prog.progress)
      return (
        <Box key='progress-bar' sx={{ display: 'inline-block', marginRight: 1, width: 30 }}>
          <LinearProgress variant='determinate' value={progress} sx={{ height: 8 }} />
        </Box>
      )
    }

    function renderPercentProgress() {
      const progress = Math.floor(100 * prog.progress)
      return (<span key='percent-progress'>{progress}%</span>)
    }

    function renderTotalProgress() {
      const downloaded = prettyBytes(prog.downloaded)
      const total = prettyBytes(prog.length || 0)
      if (downloaded === total) {
        return (<span key='total-progress'>{downloaded}</span>)
      } else {
        return (<span key='total-progress'>{downloaded} / {total}</span>)
      }
    }

    function renderPeers() {
      if (prog.numPeers === 0) return
      const count = prog.numPeers === 1 ? 'peer' : 'peers'
      return (<span key='peers'>{prog.numPeers} {count}</span>)
    }

    function renderSpeeds() {
      let str = ''
      if (prog.downloadSpeed > 0) str += ' ↓ ' + prettyBytes(prog.downloadSpeed) + '/s'
      if (prog.uploadSpeed > 0) str += ' ↑ ' + prettyBytes(prog.uploadSpeed) + '/s'
      if (str === '') return
      return (<span key='download'>{str}</span>)
    }

    function renderEta() {
      const downloaded = prog.downloaded
      const total = prog.length || 0
      const missing = total - downloaded
      const downloadSpeed = prog.downloadSpeed
      if (downloadSpeed === 0 || missing === 0) return

      const etaStr = calculateEta(missing, downloadSpeed)

      return (<span key='eta'>{etaStr}</span>)
    }

    function renderTorrentStatus() {
      let status
      if (torrentSummary.status === 'paused') {
        if (!torrentSummary.progress) status = ''
        else if (torrentSummary.progress.progress === 1) status = 'Not seeding'
        else status = 'Paused'
      } else if (torrentSummary.status === 'downloading') {
        if (!torrentSummary.progress) status = ''
        else if (!torrentSummary.progress.ready) status = 'Verifying'
        else status = 'Downloading'
      } else if (torrentSummary.status === 'seeding') {
        status = 'Seeding'
      } else { // torrentSummary.status is 'new' or something unexpected
        status = ''
      }
      return (<span key='torrent-status'>{status}</span>)
    }
  }

  // Download button toggles between torrenting (DL/seed) and paused
  // Play button starts streaming the torrent immediately, unpausing if needed
  function renderTorrentButtons(torrentSummary) {
    const infoHash = torrentSummary.infoHash

    let playButton
    if (!torrentSummary.error && TorrentPlayer.isPlayableTorrentSummary(torrentSummary)) {
      playButton = (
        <IconButton
          key='play-button'
          title='Start streaming'
          className='icon play'
          onClick={dispatcher('playFile', infoHash)}
        >
          <PlayArrowIcon />
        </IconButton>
      )
    }

    return (
      <Stack direction="row" gap={2} alignItems="center" justifyContent="center">
        {playButton}
        <IconButton
          key='delete-button'
          title='Remove torrent'
          className='icon delete'
          onClick={dispatcher('confirmDeleteTorrent', infoHash, false)}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    )
  }

  // Show files, per-file download status and play buttons, and so on
  function renderTorrentDetails(torrentSummary) {
    let filesElement
    if (torrentSummary.error || !torrentSummary.files) {
      let message = ''
      if (torrentSummary.error === 'path-missing') {
        // Special case error: this torrent's download dir or file is missing
        message = 'Missing path: ' + TorrentSummary.getFileOrFolder(torrentSummary)
      } else if (torrentSummary.error) {
        // General error for this torrent: just show the message
        message = torrentSummary.error.message || torrentSummary.error
      } else if (torrentSummary.status === 'paused') {
        // No file info, no infohash, and we're not trying to download from the DHT
        message = 'Failed to load torrent info. Click the download button to try again...'
      } else {
        // No file info, no infohash, trying to load from the DHT
        message = 'Downloading torrent info...'
      }
      filesElement = (
        <div key='files' className='files warning'>
          {message}
        </div>
      )
    } else {
      // We do know the files. List them and show download stats for each one
      const sortByName = state.saved.prefs.sortByName
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
      let fileRows = torrentSummary.files
        .filter((file) => !file.path.includes('/.____padding_file/'))
        .map((file, index) => ({ file, index }))

      if (sortByName) {
        fileRows = fileRows.sort((a, b) => collator.compare(a.file.name, b.file.name))
      }

      fileRows = fileRows.map((obj) => renderFileRow(torrentSummary, obj.file, obj.index))

      filesElement = (
        <div key='files' className='files'>
          <table>
            <tbody>
              {fileRows}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <Box key='details' className='torrent-details'>
        {filesElement}
      </Box>
    )
  }

  // Show a single torrentSummary file in the details view for a single torrent
  function renderFileRow(torrentSummary, file, index) {
    // First, find out how much of the file we've downloaded
    // Are we even torrenting it?
    const isSelected = torrentSummary.selections && torrentSummary.selections[index]
    let isDone = false // Are we finished torrenting it?
    let progress = ''
    if (torrentSummary.progress && torrentSummary.progress.files &&
      torrentSummary.progress.files[index]) {
      const fileProg = torrentSummary.progress.files[index]
      isDone = fileProg.numPiecesPresent === fileProg.numPieces
      progress = Math.floor(100 * fileProg.numPiecesPresent / fileProg.numPieces) + '%'
    }

    // Second, for media files where we saved our position, show how far we got
    let positionElem
    if (file.currentTime) {
      // Radial progress bar. 0% = start from 0:00, 270% = 3/4 of the way thru
      positionElem = renderRadialProgressBar(file.currentTime / file.duration)
    }

    // Finally, render the file as a table row
    const isPlayable = TorrentPlayer.isPlayable(file)
    const infoHash = torrentSummary.infoHash
    let icon
    let handleClick
    if (isPlayable) {
      icon = 'play_arrow' /* playable? add option to play */
      handleClick = dispatcher('playFile', infoHash, index)
    } else {
      icon = 'description' /* file icon, opens in OS default app */
      handleClick = isDone
        ? dispatcher('openPath', infoHash, index)
        : (e) => e.stopPropagation() // noop if file is not ready
    }
    // TODO: add a css 'disabled' class to indicate that a file cannot be opened/streamed
    let rowClass = ''
    if (!isSelected) rowClass = 'disabled' // File deselected, not being torrented
    if (!isDone && !isPlayable) rowClass = 'disabled' // Can't open yet, can't stream
    return (
      <TableRow key={index} onClick={handleClick}>
        <TableCell className={'col-icon ' + rowClass}>
          {positionElem}
          {isPlayable ? <PlayArrowIcon /> : <DescriptionIcon />}
        </TableCell>
        <TableCell className={'col-name ' + rowClass}>
          {file.name}
        </TableCell>
        <TableCell className={'col-progress ' + rowClass}>
          {isSelected ? progress : ''}
        </TableCell>
        <TableCell className={'col-size ' + rowClass}>
          {prettyBytes(file.length)}
        </TableCell>
        <TableCell
          className='col-select'
          onClick={dispatcher('toggleTorrentFile', infoHash, index)}
        >
          <IconButton className='icon deselect-file'>
            {isSelected ? <CloseIcon /> : <AddIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  function renderRadialProgressBar(fraction, cssClass) {
    const rotation = 360 * fraction
    const transformFill = { transform: 'rotate(' + (rotation / 2) + 'deg)' }
    const transformFix = { transform: 'rotate(' + rotation + 'deg)' }

    return (
      <div key='radial-progress' className={'radial-progress ' + cssClass}>
        <div className='circle'>
          <div className='mask full' style={transformFill}>
            <div className='fill' style={transformFill} />
          </div>
          <div className='mask half'>
            <div className='fill' style={transformFill} />
            <div className='fill fix' style={transformFix} />
          </div>
        </div>
        <div className='inset' />
      </div>
    )
  };

}

module.exports = TorrentList

function stopPropagation(e) {
  e.stopPropagation()
}

function getErrorMessage(torrentSummary) {
  const err = torrentSummary.error
  if (err === 'path-missing') {
    return (
      <span key='path-missing'>
        Path missing.<br />
        Fix and restart the app, or delete the torrent.
      </span>
    )
  }
  return 'Error'
}
