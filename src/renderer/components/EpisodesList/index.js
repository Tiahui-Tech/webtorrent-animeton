const React = require('react');
const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./episode-skeleton');

const EpisodesList = React.memo(({ episodesData, animeColors }) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4">
        {episodesData
          ? episodesData.map((episode) => (
              <EpisodeCard
                key={`episode-${episode.episodeNumber}`}
                episode={episode}
                animeColor={animeColors.at(0)}
              />
            ))
          : Array.from({ length: 8 }).map((_, i) => (
              <EpisodeCardSkeleton color={animeColors[0]} key={i} />
            ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;