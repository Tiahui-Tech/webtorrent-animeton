const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeDetails = (idAnilist) => {
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/list/${idAnilist}`);
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnime();
  }, [idAnilist]);

  return anime;
};

module.exports = useAnimeDetails;
