const _anitomyscript = require('anitomyscript');
const fastLevenshtein = require('fast-levenshtein');
const { API_BASE_URL } = require('../constants/config');
const { normalize } = require('./utils');

// Receives basic RSS data and from it gets the data of the anilist anime, torrent, episode, etc
const processRssAnimes = async (rssData) => {
  const animeTitles = rssData.map((anime) => anime.title);

  // Convert anime titles to Anitomy Animes (title, episode_number, file_name etc)
  const anitomyAnimes = await anitomyscript(animeTitles);
  const anitomyTitles = anitomyAnimes.map((a) => a.anime_title);

  const response = await fetch(`${API_BASE_URL}/anime/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ animes: anitomyTitles })
  });
  const anilistAnimes = await response.json();

  const animeDataPromises = anilistAnimes.map((anilistAnime) =>
    findAnilistEpisodeAndTorrent(anilistAnime, anitomyAnimes, rssData)
  );
  const resolvedAnimes = await Promise.all(animeDataPromises);

  // Keeps in the Array only animes with data, removes all null or undefined animes
  // And removes duplicated animes or with incomplete data
  const filteredAnimes = resolvedAnimes
    .filter(Boolean)
    .filter(
      (anime, index, self) =>
        index === self.findIndex((t) => t.id === anime.id) &&
        anime.episode &&
        !anime.episode.error &&
        anime.torrent
    );

  return filteredAnimes;
};

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

module.exports = { anitomyscript, processRssAnimes };
