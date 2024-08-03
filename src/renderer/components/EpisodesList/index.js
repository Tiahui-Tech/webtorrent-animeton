const React = require('react');
const EpisodeCard = require('./episode-card');

const EpisodesList = React.memo(({ episodesData }) => {
  return (
    <div className="flex flex-col gap-4 py-4 justify-center items-center">
      {episodesData?.episodes &&
        episodesData.episodes.map((episode) => (
          <EpisodeCard
            key={`episode-${episode.episodeNumber}`}
            episode={episode}
          />
        ))}
    </div>
  );
});

module.exports = EpisodesList;
