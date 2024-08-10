const React = require('react');
const { genGlassStyle } = require('../../../modules/utils');
const useRSSData = require('../../hooks/useRSSData');
const Episode = require('./episode');
const EpisodeSkeleton = require('./skeleton');

const LatestEpisodes = React.memo(({ bannerColors }) => {
  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 8
  });

  return (
    <div className="flex flex-col p-8 gap-2 z-30 items-start">
      <h2 className="text-xl font-semibold">Episodios Recientes</h2>
      <div
        className="flex flex-col gap-4 p-6"
        style={genGlassStyle(bannerColors[0])}
      >
        {rssAnimes
          ? rssAnimes.map((anime, i) => <Episode anime={anime} key={i} />)
          : Array.from({ length: 10 }).map((_, i) => (
              <EpisodeSkeleton color={bannerColors[0]} key={i} />
            ))}
      </div>
    </div>
  );
});

module.exports = LatestEpisodes;
