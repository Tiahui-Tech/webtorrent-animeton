const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeEpisodesData = (idAnil) => {
  const [episodes, setEpisodes] = useState(null);

  useEffect(() => {
    const fetchAnimeEpisodes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/${idAnil}`);
        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimeEpisodes();
  }, []);

  return episodes;
};

module.exports = useAnimeEpisodesData;
