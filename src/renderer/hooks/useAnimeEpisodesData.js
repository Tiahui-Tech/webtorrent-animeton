const { useEffect, useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeEpisodesData = (idAnil) => {
  const [episodes, setEpisodes] = useState([]);

  const fetchAnimeEpisodes = useCallback(async () => {
    if (!idAnil) return;
    try {
      const response = await fetch(`${API_BASE_URL}/anime/${idAnil}`);
      const data = await response.json();
      setEpisodes(data.episodes);
    } catch (error) {
      console.error('Error fetching anime data:', error);
    }
  }, [idAnil]);

  useEffect(() => {
    fetchAnimeEpisodes();
  }, [fetchAnimeEpisodes]);

  return episodes;
};

module.exports = useAnimeEpisodesData;