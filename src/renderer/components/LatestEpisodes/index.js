const React = require('react');
const useRSSData = require('../../hooks/useRSSData');
const Marquee = require('../MagicUI/Marquee');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const LatestEpisodes = React.memo(({ state, sectionTitle }) => {
  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 10,
    emptyState: true
  });

  return (
    <div className='py-8'>
      <h2 className="relative text-2xl font-bold mb-4 px-8 z-10">{sectionTitle}</h2>
      <Marquee pauseOnHover className="[--duration:40s]">
        {
          rssAnimes.map((anime) => (
            <EpisodeCard
              anime={anime}
              state={state}
            />
          ))
        }
      </Marquee>
    </div>
  );
});

module.exports = LatestEpisodes;
