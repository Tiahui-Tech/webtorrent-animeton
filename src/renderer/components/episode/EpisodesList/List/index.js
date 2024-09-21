const React = require('react');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const EpisodesList = React.memo(({ state, episodesData, isLoading, animeColors }) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4">
        {isLoading
          // While loading, shows 8 EpisodeCardSkeleton per row
          ? Array.from({ length: 8 }).map((_, i) => (
            <EpisodeCardSkeleton color={animeColors[0]} key={i} />
          ))
          : episodesData.map((episode, i) => (
            <EpisodeCard
              state={state}
              episode={episode}
              key={`episode-${episode.episodeNumber}-${i}`}

            />
          ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;
