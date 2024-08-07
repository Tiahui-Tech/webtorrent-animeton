const { useEffect, useState } = require('react');
const { extractColors } = require('extract-colors');
const { getContrastColor, sortColorsByBrightness } = require('../../modules/utils');

const useExtractColor = (image) => {
  const [animeColors, setAnimeColors] = useState(null);
  const [textColor, setTextColor] = useState(null);

  useEffect(() => {
    const getAnimeColor = async () => {
      const animeColors = await extractColors(image, {
        pixels: 100000,
        distance: 0.15,
        hueDistance: 0.1,
        saturationDistance: 1,
        lightnessDistance: 1,
        crossOrigin: 'anonymous'
      });
      const parsedColors = sortColorsByBrightness(animeColors)
      const textColor = getContrastColor(parsedColors.at(0));
      setTextColor(textColor);
      setAnimeColors(parsedColors);
    };
    getAnimeColor();
  }, []);

  return {
    animeColors,
    textColor
  };
};

module.exports = useExtractColor;
