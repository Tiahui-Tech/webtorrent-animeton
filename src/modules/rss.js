const { DOMPARSER } = require('./util.js');

async function fetchAndParseRSS(page = 1, perPage = 20) {
  const url = 'https://www.erai-raws.info/episodes/feed/?res=1080p&type=torrent&subs%5B0%5D=mx&d157edc6b50f28b2776442c03d067d56';
  const eraiNS = 'https://www.erai-raws.info/rss-page/';

  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    
    const xmlDoc = DOMPARSER(xmlText, 'application/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = Array.from(items).slice(startIndex, endIndex);

    const result = paginatedItems.map(item => {
      const title = item.querySelector('title');
      const link = item.querySelector('link');
      const pubDate = item.querySelector('pubDate');
      const resolution = item.getElementsByTagNameNS(eraiNS, 'resolution')[0];
      const linktype = item.getElementsByTagNameNS(eraiNS, 'linktype')[0];
      const size = item.getElementsByTagNameNS(eraiNS, 'size')[0];
      const infohash = item.getElementsByTagNameNS(eraiNS, 'infohash')[0];
      const subtitles = item.getElementsByTagNameNS(eraiNS, 'subtitles')[0];
      const category = item.getElementsByTagNameNS(eraiNS, 'category')[0];
      
      return {
        title: title ? title.textContent : null,
        link: link ? encodeURI(link.textContent) : null,
        pubDate: pubDate ? pubDate.textContent : null,
        resolution: resolution ? resolution.textContent : null,
        linktype: linktype ? linktype.textContent : null,
        size: size ? size.textContent : null,
        infohash: infohash ? infohash.textContent : null,
        subtitles: subtitles ? subtitles.textContent : null,
        category: category ? category.textContent : null,
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    return [];
  }
}

module.exports = { fetchAndParseRSS };