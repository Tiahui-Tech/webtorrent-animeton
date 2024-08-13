const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimeRecommendations = (anilId) => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/anime/recommendations/${anilId}`
        );
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [anilId]);

  return recommendations;
};

module.exports = useAnimeRecommendations;
