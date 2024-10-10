const { useEffect, useState, useCallback, useMemo } = require('react');
const { extractColors } = require('extract-colors');
const { getContrastColor, sortColorsByBrightness } = require('../../modules/utils');

const useExtractColor = (image) => {
  const [animeColors, setAnimeColors] = useState('#000');
  const [textColor, setTextColor] = useState('#fff');

  const getAnimeColor = useCallback(async () => {
    if (!image) return;
    const colors = await extractColors(image, {
      pixels: 100000,
      distance: 0.15,
      hueDistance: 0.1,
      saturationDistance: 1,
      lightnessDistance: 1,
      crossOrigin: 'anonymous'
    });
    const parsedColors = sortColorsByBrightness(colors);
    setAnimeColors(parsedColors);
    setTextColor(getContrastColor(parsedColors[0]));
  }, [image]);

  useEffect(() => {
    getAnimeColor();
  }, [getAnimeColor]);

  return useMemo(() => ({
    animeColors,
    textColor
  }), [animeColors, textColor]);
};

module.exports = useExtractColor;