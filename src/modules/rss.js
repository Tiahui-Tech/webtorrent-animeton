const { ERAI_RAWS_CONFIG } = require('../constants/config.js');

async function fetchAndParseRSS(page = 1, perPage = 20) {
  const { FEED_URL, RSS_URL } = ERAI_RAWS_CONFIG;

  try {
    const response = await fetch(FEED_URL);
    const xmlText = await response.text();

    const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');

    const items = xmlDoc.querySelectorAll('item');
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = Array.from(items).slice(startIndex, endIndex);

    const result = paginatedItems
      .map((item) => {
        const title = item.querySelector('title');
        const link = item.querySelector('link');
        const pubDate = item.querySelector('pubDate');
        const resolution = item.getElementsByTagNameNS(
          RSS_URL,
          'resolution'
        )[0];
        const linktype = item.getElementsByTagNameNS(RSS_URL, 'linktype')[0];
        const size = item.getElementsByTagNameNS(RSS_URL, 'size')[0];
        const infohash = item.getElementsByTagNameNS(RSS_URL, 'infohash')[0];
        const subtitles = item.getElementsByTagNameNS(RSS_URL, 'subtitles')[0];
        const category = item.getElementsByTagNameNS(RSS_URL, 'category')[0];

        return {
          title: title ? title.textContent : null,
          link: link ? encodeURI(link.textContent) : null,
          pubDate: pubDate ? pubDate.textContent : null,
          resolution: resolution ? resolution.textContent : null,
          linktype: linktype ? linktype.textContent : null,
          size: size ? size.textContent : null,
          infohash: infohash ? infohash.textContent : null,
          subtitles: subtitles ? subtitles.textContent : null,
          category: category ? category.textContent : null
        };
      })
      .filter((item) => item.title && !item.title.includes('(V2)')); // Filtra títulos con "(V2)"

    return result;
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
}

module.exports = { fetchAndParseRSS };
