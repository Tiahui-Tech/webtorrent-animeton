const { useEffect, useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeEpisodeTorrent = (idAnilist, episode) => {
  const [episodeTorrent, setEpisodeTorrent] = useState([]);

  const fetchAnimeEpisodeTorrent = useCallback(async () => {
    if (!idAnilist) return;
    try {
      const response = await fetch(`${API_BASE_URL}/torrent/${idAnilist}/${episode}`);
      const data = await response.json();
      setEpisodeTorrent(data);
    } catch (error) {
      console.error('Error fetching anime data:', error);
    }
  }, [idAnilist, episode]);

  useEffect(() => {
    fetchAnimeEpisodeTorrent();
  }, [fetchAnimeEpisodeTorrent]);

  return episodeTorrent;
};

module.exports = useAnimeEpisodeTorrent;