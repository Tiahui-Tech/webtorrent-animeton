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
      
      // Without this, the code doesn't work
      for await (const chunk of metadata.parseStream(fileStream)) {
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

const convertAssTextToVtt = (text) => {
  text = text.replace(/\{[^}]+\}/g, '');

  text = text.replace(/\\N/g, '\n');

  text = text.replace(/\\h/g, ' ');

  text = text.replace(/\\b([01])/g, (match, p1) => p1 === '1' ? '<b>' : '</b>');

  text = text.replace(/\\i([01])/g, (match, p1) => p1 === '1' ? '<i>' : '</i>');

  text = text.replace(/\\u([01])/g, (match, p1) => p1 === '1' ? '<u>' : '</u>');

  text = text.replace(/\\s([01])/g, (match, p1) => p1 === '1' ? '<span style="text-decoration: line-through;">' : '</span>');

  text = text.replace(/\\fn([^\\]+)/g, '<span style="font-family: $1;">');

  text = text.replace(/\\fs([0-9]+)/g, '<span style="font-size: $1px;">');

  text = text.replace(/\\c&H([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})&/g,
    (match, r, g, b) => `<span style="color: rgb(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)});">`);

  const openSpans = (text.match(/<span/g) || []).length;
  const closeSpans = (text.match(/<\/span>/g) || []).length;
  text += '</span>'.repeat(openSpans - closeSpans);

  text = text.split('\n').map(line => line.trim()).join('\n');

  text = text.replace(/\n{3,}/g, '\n\n');

  return text;
}

function formatVttTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = milliseconds % 1000;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

module.exports = {
  parseSubtitles,
  convertAssTextToVtt,
  formatVttTime
}
