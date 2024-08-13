const { useEffect, useState } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useAnimesData = () => {
  const [animes, setAnimes] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/list`);
        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimes();
  }, []);

  return animes;
};

module.exports = useAnimesData;
