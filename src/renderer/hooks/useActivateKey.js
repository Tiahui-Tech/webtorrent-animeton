const { useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');

const useActivateKey = (key) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activateKey = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/keys/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, newStatus: 'active' })
      });

      const result = await response.json();

      if (result.error) {
        return setError(result.message);
      }

      setData(result);
    } catch (err) {
      console.error('Error activating key:', err);
      setError(err.message || 'Ocurrio un error al activar la clave');
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  return { data, isLoading, error, activateKey };
};

module.exports = useActivateKey;
