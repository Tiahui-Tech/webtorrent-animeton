const { useMemo } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useSearchAnimes = (query, limit = 1) => {
  return useMemo(() => {
    const searchAnimes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/anime/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ animeName: query, limit })
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching anime data:', error);
        return [];
      }
    };

    return searchAnimes;
  }, [query]);
};

module.exports = useSearchAnimes;
