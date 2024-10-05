const { useEffect, useState, useCallback } = require('react');
const { genModernBackground } = require('../../modules/canvas');

const useModernBackground = ({ primaryColor, secondaryColor, disablePattern, opacity }) => {
  const [background, setBackground] = useState(null);

  const genBackground = useCallback(async () => {
    if (!primaryColor || !secondaryColor) return;
    const backgroundBase64 = await genModernBackground({
      primaryColor,
      secondaryColor,
      disablePattern,
      opacity
    });
    setBackground(backgroundBase64);
  }, [primaryColor, secondaryColor]);

  useEffect(() => {
    genBackground();
  }, [genBackground]);

  return background;
};

module.exports = useModernBackground;