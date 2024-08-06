const { useEffect, useState } = require('react');
const { getAverageColor } = require('fast-average-color-node');

const useExtractColor = (image) => {
  const [animeColor, setAnimeColor] = useState('#d1d5db');

  useEffect(() => {
    const getAnimeColor = async () => {
      const animeColor = await getAverageColor(image, {
        distance: 0.3,
        lightnessDistance: 1,
        crossOrigin: 'anonymous'
      });
      setAnimeColor(animeColor.hex);
    };
    getAnimeColor();
  }, []);

  return animeColor;
};

module.exports = useExtractColor;
