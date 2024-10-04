const React = require('react');
const { useState, memo } = React;

const useRSSData = require('../../../hooks/useRSSData');

const TorrentPlayer = require('../../../lib/torrent-player');
const { sendError } = require('../../../lib/errors');

const Episode = require('./episode');
const EpisodeSkeleton = require('./skeleton');

const LatestEpisodesSidebar = memo(({ state, bannerColors, sectionTitle }) => {
  const [loadingEpisodeId, setLoadingEpisodeId] = useState(null);

  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 8
  });

  const handlePlay = (anime) => {
    const infoHash = anime?.torrent?.infoHash;
    if (!infoHash) {
      return sendError(state, { message: 'Episodio no disponible.' });
    }

    if (loadingEpisodeId) {
      return sendError(state, { title: 'Wow, espera!', message: 'Ya estamos cargando un episodio.', type: 'alert' });
    }

    setLoadingEpisodeId(infoHash);
    TorrentPlayer.playTorrent(anime, state, setLoadingEpisodeId);
  };

  return (
    <div className="flex flex-col p-4 gap-2 items-start z-30">
      <h2 className="text-xl font-semibold">{sectionTitle}</h2>
      <div className="flex flex-col gap-4 p-6 bg-zinc-950 rounded-xl border-2 border-zinc-900">
        {rssAnimes
          ? rssAnimes.map((anime, i) => (
            <Episode
              key={`rss-episode-${i}`}
              anime={anime}
              isLoading={loadingEpisodeId === anime?.torrent?.infoHash}
              onPlay={() => handlePlay(anime)}
            />
          ))
          : // While loading, shows 8 EpisodeSkeletons per row
          Array.from({ length: 8 }).map((_, i) => (
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
