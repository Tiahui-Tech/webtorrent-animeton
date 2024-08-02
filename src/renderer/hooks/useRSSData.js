const { useEffect, useState } = require('react');
const { processRssAnimes } = require('../../modules/anime');
const { fetchAndParseRSS } = require('../../modules/rss');

const useRSSData = ({ page, perPage, displayCount }) => {
  const [rssAnimes, setRSSAnimes] = useState(null);

  useEffect(() => {
    const fetchRSSAnimes = async () => {
      try {
        const rssData = await fetchAndParseRSS(page, perPage);
        const resolvedRssData = await processRssAnimes(rssData);

        // Sets the displayCount to the array
        const slicedRssAnimes = resolvedRssData.slice(0, displayCount);

        setRSSAnimes(slicedRssAnimes);
      } catch (error) {
        console.error('Error fetching RSS data:', error);
      }
    };

    fetchRSSAnimes();
  }, []);

  return rssAnimes;
};

module.exports = useRSSData;
