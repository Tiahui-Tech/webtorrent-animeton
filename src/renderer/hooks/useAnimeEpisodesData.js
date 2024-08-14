const { useEffect, useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeEpisodesData = (idAnilist) => {
  const [episodes, setEpisodes] = useState([]);

  const fetchAnimeEpisodes = useCallback(async () => {
    if (!idAnilist) return;
    try {
      const response = await fetch(`${API_BASE_URL}/anime/episodes/${idAnilist}`);
      const data = await response.json();
      setEpisodes(data.episodes);
    } catch (error) {
      console.error('Error fetching anime data:', error);
    }
  }, [idAnilist]);

  useEffect(() => {
    fetchAnimeEpisodes();
  }, [fetchAnimeEpisodes]);

  return episodes;
};

module.exports = useAnimeEpisodesData;