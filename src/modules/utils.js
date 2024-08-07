const React = require('react');
const { TIME_UNITS } = require('../constants/config');
const { LiveTv, Movie, MusicNote, Book } = require('@mui/icons-material');
const { Icon } = require('@iconify/react');

const timeAgo = (dateISO) => {
  const now = new Date();
  const date = new Date(dateISO);
  const seconds = Math.floor((now - date) / 1000);

  for (const { key, limit, divisor } of TIME_UNITS) {
    if (seconds < limit) {
      const quantity = Math.floor(seconds / divisor);
      return `Hace ${quantity} ${key}${quantity !== 1 ? 's' : ''}`;
    }
  }
  const { key, divisor } = TIME_UNITS[TIME_UNITS.length - 1];
  const quantity = Math.floor(seconds / divisor);
  return `Hace ${quantity} ${key}${quantity !== 1 ? 's' : ''}`;
};

const normalize = (title) => title.toLowerCase().replace(/[^a-z0-9]/g, '');

const getAnimeFlags = (animeTitle) => {
  const allowedFlags = ['mx', 'es', 'us'];
  const flagRegex = /\[([a-z]{2})\]/g;
  const matches = animeTitle.match(flagRegex);

  if (!matches) return [];

  return allowedFlags
    .filter((flag) => matches.some((match) => match.includes(flag)))
    .map((flag) => (
      <Icon
        key={`flag-icon-${flag}`}
        icon={`flagpack:${flag}`}
        width={24}
        height={24}
      />
    ));
};

const getFormatIcon = (format) => {
  const icons = {
    TV: 'gravity-ui:tv',
    MOVIE: 'gravity-ui:video',
    OVA: 'gravity-ui:tv',
    ONA: 'gravity-ui:tv',
    MUSIC: 'gravity-ui:music-note',
    MANGA: 'gravity-ui:book-open',
    NOVEL: 'gravity-ui:book-open',
    ONE_SHOT: 'gravity-ui:book-open'
  };
  return icons[format] ? <Icon icon={icons[format]} /> : null;
};

function getContrastColor(hexColor) {
  hexColor = hexColor.replace('#', '');

  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function sortColorsByBrightness(colors) {
  return colors
    .sort((a, b) => {
      if (a.saturation > 0.5 && a.lightness > 0.5 && (b.saturation <= 0.5 || b.lightness <= 0.5)) {
        return -1;
      }
      if (b.saturation > 0.5 && b.lightness > 0.5 && (a.saturation <= 0.5 || a.lightness <= 0.5)) {
        return 1;
      }
      return b.intensity - a.intensity;
    })
    .map(color => color.hex);
}

module.exports = {
  timeAgo,
  normalize,
  getAnimeFlags,
  getFormatIcon,
  getContrastColor,
  sortColorsByBrightness
};
