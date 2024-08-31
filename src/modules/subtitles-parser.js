async function parseSubtitles(file) {
  const Metadata = (await import('matroska-metadata')).default;
  console.log('Initializing parser for file: ' + file.name)
  const metadata = new Metadata(file)
  const subtitles = {}

  return new Promise((resolve, reject) => {
    metadata.getTracks().then(tracks => {
      console.log('Tracks received: ' + tracks.length)
      const subtitleTracks = tracks.filter(track => track.type === 'subtitles')
      
      if (subtitleTracks.length === 0) {
        console.log('No subtitle tracks found')
        resolve({})
      } else {
        subtitleTracks.forEach(track => {
          subtitles[track.number] = {
            track: track,
            cues: []
          }
        })
      }
    })

    metadata.on('subtitle', (subtitle, trackNumber) => {
      console.log(`Found subtitle for track: ${trackNumber}`)
      if (subtitles[trackNumber]) {
        subtitles[trackNumber].cues.push(subtitle)
      }
    })

    if (file.name.endsWith('.mkv') || file.name.endsWith('.webm')) {
      file.on('iterator', ({ iterator }, cb) => {
        const parsingStream = metadata.parseStream(iterator)
        parsingStream.on('finish', () => {
          console.log('Finished parsing subtitles')
          resolve(subtitles)
        })
        cb(parsingStream)
      })
    } else {
      console.error('Unsupported file format: ' + file.name)
      reject(new Error('Unsupported file format'))
    }
  })
}

function convertSubtitlesToASS(subtitles) {
  let assContent = "[Script Info]\nScriptType: v4.00+\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n";

  Object.values(subtitles).forEach(track => {
    track.cues.forEach(cue => {
      const start = formatTime(cue.time);
      const end = formatTime(cue.time + cue.duration);
      assContent += `Dialogue: 0,${start},${end},Default,,0,0,0,,${cue.text}\n`;
    });
  });

  return assContent;
}

module.exports = {
  parseSubtitles,
  convertSubtitlesToASS
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}