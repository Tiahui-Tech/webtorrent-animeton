const React = require('react');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const EpisodesList = React.memo(({ episodesData, animeColors }) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4">
        {episodesData.length > 0
          ? episodesData.map((episode, i) => (
            <EpisodeCard
              episode={episode} 
              key={`episode-${episode.episodeNumber}-${i}`}
            />
          ))
          // While loading, shows 8 EpisodeCardSkeleton per row
          : Array.from({ length: 8 }).map((_, i) => (
            <EpisodeCardSkeleton color={animeColors[0]} key={i} />
          ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;
