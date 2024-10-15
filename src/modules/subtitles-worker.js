const { parseSubtitles } = require('./subtitles-parser')

console.log('Subtitles worker started');

process.on('message', async (filePath) => {
  console.log('Worker received file path:', filePath);
  try {
    console.log('Starting to parse subtitles...');
    const subtitles = await parseSubtitles(filePath)
    console.log('Subtitles parsed successfully, sending result back');
    process.send({ success: true, subtitles })
  } catch (error) {
    console.error('Error parsing subtitles:', error);
    process.send({ success: false, error: error.message })
  } finally {
    console.log('Worker finished, exiting');
    process.exit()
  }
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in worker:', error);
  process.send({ success: false, error: error.message })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.send({ success: false, error: 'Unhandled promise rejection' })
  process.exit(1)
})
