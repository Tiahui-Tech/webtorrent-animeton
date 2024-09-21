const _anitomyscript = require('anitomyscript');
const fastLevenshtein = require('fast-levenshtein');
const { API_BASE_URL } = require('../constants/config');
const { normalize } = require('./utils');

// Compare Anilist and Anitomy anime to find the same title and combine Anime data from both sources
const findAnilistEpisodeAndTorrent = async (
  anilistAnime,
  anitomyAnimes,
  rssData
) => {
  const { anime: anitomyAnimeMatch } = anitomyAnimes.reduce(
    (bestMatch, currentAnime) => {
      const anilistTitle = anilistAnime.title.romaji;
      const anitomyTitle = currentAnime.anime_title;

      const currentDistance = fastLevenshtein.get(
        normalize(anilistTitle),
        normalize(anitomyTitle)
      );

      const isCurrentAnimeBetterMatch = currentDistance < bestMatch.distance;

      return isCurrentAnimeBetterMatch // If current anime is a better match
        ? { anime: currentAnime, distance: currentDistance } // Then update best match
        : bestMatch; // Otherwise keep current best match

      // Start with Infinity to ensure the first comparison always succeeds
    },
    { anime: null, distance: Infinity }
  );

  if (anitomyAnimeMatch && anitomyAnimeMatch.episode_number) {
    const episodeResponse = await fetch(
      `${API_BASE_URL}/anime/episodes/${anilistAnime.idAnilist}/${anitomyAnimeMatch.episode_number}`
    );
    const episodeData = await episodeResponse.json();

    const rssTorrent = rssData.find(
      (rssAnime) => rssAnime.title === anitomyAnimeMatch.file_name
    );

    return { ...anilistAnime, episode: episodeData, torrent: rssTorrent };
  }

  // If a match is not found
  return null;
};

// utility method for correcting anitomyscript woes for what's needed
async function anitomyscript(...args) {
  // @ts-ignore
  const res = await _anitomyscript(...args);

  const parseObjs = Array.isArray(res) ? res : [res];

  for (const obj of parseObjs) {
    obj.anime_title ??= '';
    const seasonMatch = obj.anime_title.match(/S(\d{2})E(\d{2})/);
    if (seasonMatch) {
      obj.anime_season = seasonMatch[1];
      obj.episode_number = seasonMatch[2];
      obj.anime_title = obj.anime_title.replace(/S(\d{2})E(\d{2})/, '');
    }
    const yearMatch = obj.anime_title.match(/ (19[5-9]\d|20\d{2})/);
    if (yearMatch && Number(yearMatch[1]) <= new Date().getUTCFullYear() + 1) {
      obj.anime_year = yearMatch[1];
      obj.anime_title = obj.anime_title.replace(/ (19[5-9]\d|20\d{2})/, '');
    }
    if (Number(obj.anime_season) > 1)
      obj.anime_title += ' S' + obj.anime_season;
  }

  return parseObjs;
}

module.exports = { anitomyscript, findAnilistEpisodeAndTorrent };
