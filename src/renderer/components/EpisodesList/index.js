const React = require('react');
const EpisodeCard = require('./episode-card');

const EpisodesList = React.memo(({ episodesData, animeColor }) => {
  return (
    <div className="relative bg-black">
      <div
        className="absolute"
        style={{
          inset: 0,
          opacity: 0.3,
          background: `linear-gradient(to top, ${animeColor}, transparent)`
        }}
      />
      <div className="flex flex-col gap-4 py-4 justify-center items-center">
        {episodesData?.episodes &&
          episodesData.episodes.map((episode) => (
            <EpisodeCard
              key={`episode-${episode.episodeNumber}`}
              episode={episode}
            />
          ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;
