// const { parentPort } = require('worker_threads');
// const { parseSubtitles } = require('./subtitles-parser');

// parentPort.on('message', async (filePath) => {
//   try {
//     const subtitles = await parseSubtitles(filePath);
//     parentPort.postMessage({ success: true, subtitles });
//   } catch (error) {
//     parentPort.postMessage({ success: false, error: error.message });
//   }
// });

const { parseSubtitles } = require('./subtitles-parser')

process.on('message', async (filePath) => {
  try {
    const subtitles = await parseSubtitles(filePath)
    process.send({ success: true, subtitles })
  } catch (error) {
    process.send({ success: false, error: error.message })
  }
  process.exit()
})