const React = require('react');
const { useState } = React;
const useRSSData = require('../../../hooks/useRSSData');
const useModernBackground = require('../../../hooks/useModernBackground');

const TorrentPlayer = require('../../../lib/torrent-player');
const { sendNotification } = require('../../../lib/errors');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const LatestEpisodes = React.memo(({ state, sectionTitle }) => {
  const [loadingEpisodeId, setLoadingEpisodeId] = useState(null);

  const { rssAnimes, isLoading } = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 8,
    emptyState: false
  });
  const background = useModernBackground({
    primaryColor: '#63e8ff',
    secondaryColor: '#ff9af7',
    disablePattern: true,
    opacity: 0.6
  });

  const handlePlay = (anime) => {
    const infoHash = anime?.torrent?.infoHash;
    if (!infoHash) {
      return sendNotification(state, { message: 'Episodio no disponible.' });
    }

    if (loadingEpisodeId) {
      return sendNotification(state, { title: 'Wow, espera!', message: 'Ya estamos cargando un episodio.', type: 'alert' });
    }

    setLoadingEpisodeId(infoHash);
    TorrentPlayer.playTorrent(anime, state, setLoadingEpisodeId);
  };

  return (
    <div className="relative flex flex-col py-8 px-6 justify-center items-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${background})`,
          maskImage: 'linear-gradient(to top, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent)'
        }}
      />
      <h2 className="relative text-2xl font-bold mb-4 px-8">{sectionTitle}</h2>
      <div className="grid grid-cols-4 auto-cols-max gap-4 justify-center items-center min-h-[700px]">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <EpisodeCardSkeleton key={i} />
          ))
          : rssAnimes.map((anime, i) => (
            <EpisodeCard
              key={i}
              anime={anime}
              isLoading={loadingEpisodeId === anime?.torrent?.infoHash}
              onPlay={() => handlePlay(anime)}
            />
          ))}
      </div>
    </div>
  );
});

module.exports = LatestEpisodes;
