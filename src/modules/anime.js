const _anitomyscript = require('anitomyscript');

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

module.exports = { anitomyscript };
