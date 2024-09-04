const React = require('react');
const useRSSData = require('../../../hooks/useRSSData');
const Episode = require('./episode');
const EpisodeSkeleton = require('./skeleton');

const LatestEpisodesSidebar = React.memo(({ bannerColors, sectionTitle }) => {
  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 8
  });

  return (
    <div className="flex flex-col p-8 gap-2 items-start z-30">
      <h2 className="text-xl font-semibold">{sectionTitle}</h2>
      <div
        className="flex flex-col gap-4 p-6 bg-zinc-950 rounded-xl border-2 border-zinc-900"
      >
        {rssAnimes
          ? rssAnimes.map((anime, i) => (
            <Episode anime={anime} key={`rss-episode-${i}`} />
          ))
          // While loading, shows 8 EpisodeSkeletons per row
          : Array.from({ length: 8 }).map((_, i) => (
            <EpisodeSkeleton
              color={bannerColors[0]}
              key={`rss-episode-skeleton-${i}`}
            />
          ))}
      </div>
    </div>
  );
});

module.exports = LatestEpisodesSidebar;
