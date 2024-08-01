const { useEffect, useState } = require('react')
const { processAnimes } = require('../../modules/anime');
const { fetchAndParseRSS } = require('../../modules/rss');

const useRSSData = ({ page, perPage, displayCount }) => {
    const [rssAnimes, setRSSAnimes] = useState(null);

    useEffect(() => {
        const fetchRSSAnimes = async () => {
            try {
                const rssData = await fetchAndParseRSS(page, perPage);
                const resolvedRssData = await processAnimes(rssData);
                const filteredRssAnimes = resolvedRssData
                    .filter((item, index, self) =>
                        index === self.findIndex((t) => t.id === item.id) && item.episode && item.torrent
                    )
                    .slice(0, displayCount);
                setRSSAnimes(filteredRssAnimes);
            } catch (error) {
                console.error('Error fetching RSS data:', error);
            }
        };

        fetchRSSAnimes();
    }, []);

    return rssAnimes;
};

module.exports = useRSSData;