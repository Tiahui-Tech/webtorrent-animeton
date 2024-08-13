const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeRecommendations = (idAnilist) => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/anime/recommendations/${idAnilist}`
        );
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [idAnilist]);

  return recommendations;
};

module.exports = useAnimeRecommendations;
