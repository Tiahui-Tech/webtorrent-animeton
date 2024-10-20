const { useState, useCallback } = require('react');
const { API_BASE_URL } = require('../../constants/config');
const { dispatch } = require('../lib/dispatcher');

const useValidateKey = (key) => {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateKey = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/keys/validate/${key}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      console.log(result);

      if (result.error) {
        setError(result.message);
      } else {
        const isKeyValid = result?.valid
        setIsValid(isKeyValid);

        if (!isKeyValid) {
          dispatch('cleanKeyState')
        }
      }
    } catch (err) {
      console.error('Error validating key:', err);
      setError(err.message || 'Ocurrió un error al validar la clave');
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  return { isValid, isLoading, error, validateKey };
};

module.exports = useValidateKey;
