const _anitomyscript = require('anitomyscript'); 
const fastLevenshtein = require('fast-levenshtein');
const { API_BASE_URL } = require('../constants/config');
const { normalize } = require('./utils');

const processAnimes = async (rssData) => {
  const animeTitles = rssData.map(anime => anime.title);
  const parsedAnimes = await anitomyscript(animeTitles);

  const response = await fetch(`${API_BASE_URL}/anime/search`, {
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
      const episodeData = await fetch(`${API_BASE_URL}/anime/${anime.idAnil}/${bestMatch.episode_number}`).then(res => res.json());
      const rssTorrent = rssData.find(anim => anim.title === bestMatch.file_name);
      return { ...anime, episode: episodeData, torrent: rssTorrent };
    }
    return null;
  }));

  return resolvedData.filter(Boolean);
}

// utility method for correcting anitomyscript woes for what's needed
async function anitomyscript (...args) {
  // @ts-ignore
  const res = await _anitomyscript(...args)

  const parseObjs = Array.isArray(res) ? res : [res]

  for (const obj of parseObjs) {
    obj.anime_title ??= ''
    const seasonMatch = obj.anime_title.match(/S(\d{2})E(\d{2})/)
    if (seasonMatch) {
      obj.anime_season = seasonMatch[1]
      obj.episode_number = seasonMatch[2]
      obj.anime_title = obj.anime_title.replace(/S(\d{2})E(\d{2})/, '')
    }
    const yearMatch = obj.anime_title.match(/ (19[5-9]\d|20\d{2})/)
    if (yearMatch && Number(yearMatch[1]) <= (new Date().getUTCFullYear() + 1)) {
      obj.anime_year = yearMatch[1]
      obj.anime_title = obj.anime_title.replace(/ (19[5-9]\d|20\d{2})/, '')
    }
    if (Number(obj.anime_season) > 1) obj.anime_title += ' S' + obj.anime_season
  }

  return parseObjs
}

module.exports = { anitomyscript, processAnimes }
