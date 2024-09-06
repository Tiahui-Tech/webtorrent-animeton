const fs = require('fs');
const path = require('path');

async function parseSubtitles(filePath) {
  const { default: Metadata } = await import('matroska-metadata');
  console.log('Initializing parser for file: ' + path.basename(filePath));
  
  const file = {
    name: path.basename(filePath),
    stream: () => fs.createReadStream(filePath),
    [Symbol.asyncIterator]: async function* () {
      const stream = this.stream();
      for await (const chunk of stream) {
        yield chunk;
      }
    }
  };

  const metadata = new Metadata(file);
  const subtitles = {};

  try {
    const tracks = await metadata.getTracks();
    console.log('Tracks received:', JSON.stringify(tracks));

    tracks.forEach(track => {
      subtitles[track.number] = {
        track: track,
        cues: []
      };
    });

    metadata.on('subtitle', (subtitle, trackNumber) => {
      console.log(`Found subtitle for track: ${trackNumber}`);
      if (subtitles[trackNumber]) {
        subtitles[trackNumber].cues.push(subtitle);
      }
    });

    if (file.name.endsWith('.mkv') || file.name.endsWith('.webm')) {
      const fileStream = file[Symbol.asyncIterator]();
      for await (const chunk of metadata.parseStream(fileStream)) {
        // Process each chunk if needed
      }
      
      console.log('Finished parsing subtitles');
      return subtitles;
    } else {
      throw new Error('Unsupported file format: ' + file.name);
    }
  } catch (error) {
    console.error('Error parsing subtitles:', error);
    throw error;
  }
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