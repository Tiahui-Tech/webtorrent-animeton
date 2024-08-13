const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeDetails = (anilId) => {
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/${anilId}`);
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnime();
  }, [anilId]);

  return anime;
};

module.exports = useAnimeDetails;
