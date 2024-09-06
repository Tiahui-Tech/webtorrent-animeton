const remote = require('@electron/remote')
const fs = require('fs')
const path = require('path')
const parallel = require('run-parallel')
const { fork } = require('child_process')
const assToVtt = require('ass-to-vtt')
const { Readable } = require('stream')

const eventBus = require('../lib/event-bus')
const { dispatch } = require('../lib/dispatcher')

module.exports = class SubtitlesController {
  constructor (state) {
    this.state = state
  }

  openSubtitles () {
    const filenames = remote.dialog.showOpenDialogSync({
      title: 'Select a subtitles file.',
      filters: [{ name: 'Subtitles', extensions: ['vtt', 'srt'] }],
      properties: ['openFile']
    })
    if (!Array.isArray(filenames)) return
    this.addSubtitles(filenames, true)
  }

  selectSubtitle (ix) {
    this.state.playing.subtitles.selectedIndex = ix
  }

  toggleSubtitlesMenu () {
    const subtitles = this.state.playing.subtitles
    subtitles.showMenu = !subtitles.showMenu
  }

  addSubtitles (files, autoSelect) {
    // Subtitles are only supported when playing video files
    if (this.state.playing.type !== 'video') return
    if (files.length === 0) return
    const subtitles = this.state.playing.subtitles

    // Read the files concurrently, then add all resulting subtitle tracks
    const tasks = files.map((file) => (cb) => loadSubtitle(file, cb))
    parallel(tasks, (err, tracks) => {
      if (err) return dispatch('error', err)

      // No dupes allowed
      tracks.forEach((track, i) => {
        let trackIndex = subtitles.tracks.findIndex((t) =>
          track.filePath === t.filePath)

        // Add the track
        if (trackIndex === -1) {
          trackIndex = subtitles.tracks.push(track) - 1
        }

        // If we're auto-selecting a track, try to find one in the user's language
        if (autoSelect && (i === 0 || isSystemLanguage(track.language))) {
          subtitles.selectedIndex = trackIndex
        }
      })

      // Finally, make sure no two tracks have the same label
      relabelSubtitles(subtitles)
    })
  }

  async checkForSubtitles() {
    if (this.state.playing.type !== 'video') return
    const torrentSummary = this.state.getPlayingTorrentSummary()
    if (!torrentSummary || !torrentSummary.progress) return
  
    console.log('Checking for subtitles in: ', torrentSummary)
  
    const filePath = path.join(torrentSummary.path, torrentSummary.name)

    try {
      const subtitles = await this.parseSubtitles(filePath)
      console.log('Subtitles parsed successfully: ', subtitles)
      await this.convertAndAddSubtitles(subtitles)
    } catch (err) {
      console.error('Error checking for subtitles: ', err)
    }
  }

  parseSubtitles(filePath) {
    return new Promise((resolve, reject) => {
      const child = fork('./src/modules/subtitles-worker.js')
      
      child.on('message', (result) => {
        if (result.success) {
          resolve(result.subtitles)
        } else {
          reject(new Error(result.error))
        }
      })
  
      child.on('error', reject)
  
      child.send(filePath)
    })
  }

  isSubtitle (file) {
    const name = typeof file === 'string' ? file : file.name
    const ext = path.extname(name).toLowerCase()
    return ext === '.srt' || ext === '.vtt'
  }

  async convertAndAddSubtitles(subtitles) {
    const convertedTracks = []

    for (const [trackNumber, subtitle] of Object.entries(subtitles)) {
      if (subtitle.track.type === 'ass') {
        try {
          const vttContent = await this.convertAssToVtt(subtitle)
          convertedTracks.push({
            buffer: 'data:text/vtt;base64,' + Buffer.from(vttContent).toString('base64'),
            language: subtitle.track.language || 'Unknown',
            label: subtitle.track.name || `Track ${trackNumber}`,
            filePath: `memory:${trackNumber}`
          })
        } catch (error) {
          console.error('Error converting subtitle:', error)
        }
      }
    }

    const updatedTracks = [...this.state.playing.subtitles.tracks, ...convertedTracks]
    let selectedIndex = this.state.playing.subtitles.selectedIndex
    if (selectedIndex === -1 && convertedTracks.length > 0) {
      selectedIndex = this.state.playing.subtitles.tracks.length
    }

    // relabelSubtitles({ tracks: updatedTracks })

    eventBus.emit('stateUpdate', {
      playing: {
        subtitles: {
          tracks: updatedTracks,
          selectedIndex: selectedIndex
        }
      }
    })
  }

  convertAssToVtt(subtitle) {
    return new Promise((resolve, reject) => {
      const assContent = subtitle.track.header + '\n' + subtitle.cues.map(cue => 
        `Dialogue: 0,${this.formatTime(cue.time)},${this.formatTime(cue.time + cue.duration)},Default,,0,0,0,,${cue.text}`
      ).join('\n')

      const readable = new Readable()
      readable.push(assContent)
      readable.push(null)
      
      let vttData = ''
      readable
        .pipe(assToVtt())
        .on('data', chunk => { vttData += chunk })
        .on('end', () => resolve(vttData))
        .on('error', reject)
    })
  }

  formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }
}

function loadSubtitle (file, cb) {
  // Lazy load to keep startup fast
  const concat = require('simple-concat')
  const LanguageDetect = require('languagedetect')
  const srtToVtt = require('srt-to-vtt')

  // Read the .SRT or .VTT file, parse it, add subtitle track
  const filePath = typeof file === 'string' ? file : file.path

  if (!filePath) {
    return cb(new Error('Invalid subtitle file path'))
  }

  const vttStream = fs.createReadStream(filePath).pipe(srtToVtt())

  concat(vttStream, (err, buf) => {
    if (err) return cb(new Error('Can\'t parse subtitles file.'))

    // Detect what language the subtitles are in
    const vttContents = buf.toString().replace(/(.*-->.*)/g, '')
    let langDetected = (new LanguageDetect()).detect(vttContents, 2)
    langDetected = langDetected.length ? langDetected[0][0] : 'subtitle'
    langDetected = langDetected.slice(0, 1).toUpperCase() + langDetected.slice(1)

    const track = {
      buffer: 'data:text/vtt;base64,' + buf.toString('base64'),
      language: langDetected,
      label: langDetected,
      filePath
    }

    cb(null, track)
  })
}

// Checks whether a language name like 'English' or 'German' matches the system
// language, aka the current locale
function isSystemLanguage (language) {
  const iso639 = require('iso-639-1')
  const osLangISO = window.navigator.language.split('-')[0] // eg 'en'
  const langIso = iso639.getCode(language) // eg 'de' if language is 'German'
  return langIso === osLangISO
}

// Make sure we don't have two subtitle tracks with the same label
// Labels each track by language, eg 'German', 'English', 'English 2', ...
function relabelSubtitles(subtitles) {
  const counts = {}
  subtitles.tracks.forEach(track => {
    const lang = track.language
    counts[lang] = (counts[lang] || 0) + 1
    track.label = counts[lang] > 1 ? `${lang} ${counts[lang]}` : lang
  })
}
