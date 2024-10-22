const { useState, useEffect } = require('react');

const useDiscordUser = (discordId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscordUser = async () => {
      setError(null);

      try {
        const response = await fetch(`https://api.asure.dev/v1/user/${discordId}`);
        const result = await response.json();

        if (result.error) {
          return setError(result.message);
        }

        setData(result.data);
      } catch (err) {
        console.error('Error fetching Discord user:', err);
        setError(err.message || 'Ocurrió un error al obtener el usuario de Discord');
      } finally {
        setIsLoading(false);
      }
    };

    if (discordId) {
      fetchDiscordUser();
    }
  }, [discordId]);

  return { data, isLoading, error };
};

module.exports = useDiscordUser;
