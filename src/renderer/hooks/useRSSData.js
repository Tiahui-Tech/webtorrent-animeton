const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useRSSData = ({ page, perPage, displayCount, emptyState }) => {
  const [rssAnimes, setRSSAnimes] = useState(emptyState ? Array.from({ length: displayCount }) : null);

  useEffect(() => {
    const fetchRSSAnimes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/rss?page=${page}&perPage=${perPage}`);
        const rssAnimesData = await response.json();

        // Sets the displayCount to the array
        const slicedRssAnimes = rssAnimesData.slice(0, displayCount);

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
