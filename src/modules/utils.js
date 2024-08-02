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

module.exports = { timeAgo, normalize, getAnimeFlags, getFormatIcon };
