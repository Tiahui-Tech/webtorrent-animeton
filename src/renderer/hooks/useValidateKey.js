const { useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');
const { dispatch } = require('../lib/dispatcher');

const useValidateKey = (discordId) => {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateKey = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/keys/${discordId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      console.log(result);

      if (result.error) {
        setError(result.message);
      } else {
        const isAccountValid = result.status === 'active' && !result.blocked
        dispatch('updateKeyState', { ...result, blocked: result.blocked })
        setIsValid(isAccountValid);
      }
    } catch (err) {
      console.error('Error validating key:', err);
      setError(err.message || 'Ocurrió un error al validar la clave');
    } finally {
      setIsLoading(false);
    }
  }, [discordId]);

  return { isValid, isLoading, error, validateKey };
};

module.exports = useValidateKey;
