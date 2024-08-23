const React = require('react');
const useRSSData = require('../../hooks/useRSSData');
const Marquee = require('../MagicUI/Marquee');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const LatestEpisodes = React.memo(({ state, sectionTitle }) => {
  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 5
  });

  return (
    <div className='py-8'>
      <h2 className="relative text-2xl font-bold mb-4 px-8 z-10">{sectionTitle}</h2>
      <Marquee pauseOnHover className="[--duration:30s]">
        {rssAnimes
          ? rssAnimes.map((anime, i) => (
            <EpisodeCard
              key={`rss-${anime.id}-${i}`}
              anime={anime}
              state={state}
            />
          ))
          // While loading, shows 8 EpisodeCardSkeleton per row
          : Array.from({ length: 8 }).map((_, index) => (
            <EpisodeCardSkeleton key={`skeleton-${index}`} />
          ))}
      </Marquee>
    </div>
  );
});

module.exports = LatestEpisodes;
