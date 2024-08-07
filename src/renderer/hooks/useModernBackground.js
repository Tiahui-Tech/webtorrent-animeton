const { useEffect, useState } = require('react');
const { genModernBackground } = require('../../modules/canvas');

const useModernBackground = (colors) => {
    const [background, setBackground] = useState();

  useEffect(() => {
    const genBackground = async () => {
      const backgroundBase64 = await genModernBackground({
        primaryColor: colors.at(0),
        secondaryColor: colors.at(1),
        tertiaryColor: colors.at(2),
      });
      setBackground(backgroundBase64);
    }
    genBackground()
  }, []);

  return background;
};

module.exports = useModernBackground;
