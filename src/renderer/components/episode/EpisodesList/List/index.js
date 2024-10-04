const React = require('react');
const { useState } = React;
const TorrentPlayer = require('../../../../lib/torrent-player');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const EpisodesList = React.memo(({ episodesData, isLoading, animeColors }) => {
  const [loadingEpisodeId, setLoadingEpisodeId] = useState(null);

  const handlePlay = (episode) => {
    if (loadingEpisodeId) return;
    
    setLoadingEpisodeId(episode.tvdbId);
    TorrentPlayer.playTorrent(episode, state, setLoadingEpisodeId);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <EpisodeCardSkeleton color={animeColors[0]} key={i} />
          ))
          : episodesData.map((episode, i) => (
            <EpisodeCard
              episode={episode}
              key={`episode-${episode.episodeNumber}-${i}`}
              isLoading={loadingEpisodeId === episode.tvdbId}
              onPlay={() => handlePlay(episode)}
            />
          ))}
      </div>
    </div>
  );
});

module.exports = EpisodesList;
