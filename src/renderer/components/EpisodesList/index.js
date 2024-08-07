const React = require('react');
const EpisodeCard = require('./episode-card');
const useModernBackground = require('../../hooks/useModernBackground');

const EpisodesList = React.memo(({ episodesData, animeColors }) => {
  const background = useModernBackground(animeColors);
  return (
    <div className="relative bg-black">
      <div
        className="fixed inset-0 bg-cover bg-center z-20"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="flex flex-col gap-4 py-4 justify-center items-center">
        {episodesData?.episodes &&
          episodesData.episodes.map((episode) => (
            <EpisodeCard
              key={`episode-${episode.episodeNumber}`}
              episode={episode}
              animeColor={animeColors.at(0)}
            />
          ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;
