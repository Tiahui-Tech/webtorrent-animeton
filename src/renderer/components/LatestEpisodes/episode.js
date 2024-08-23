const React = require('react');
const { getAnimeFlags, timeAgo, getNeonColor } = require('../../../modules/utils');
const { dispatch } = require('../../lib/dispatcher');
const TorrentPlayer = require('../../lib/torrent-player')

const {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image
} = require('@nextui-org/react');
const { Icon } = require('@iconify/react');
const ShineBorder = require('../MagicUI/effects/ShineBorder');
const useExtractColor = require('../../hooks/useExtractColor');
const EpisodeCardSkeleton = require('./skeleton');

const EpisodeCard = React.memo(({ anime, state }) => {

  if (!anime) return <EpisodeCardSkeleton />

  const handlePlay = (anime) => {
    const hash = anime.torrent.infohash;
    const torrent = state.saved.torrents.find(
      (torrent) => torrent.infoHash === hash
    );

    if (!torrent) {
      dispatch('addTorrent', anime.torrent.link);
      setTimeout(() => {
        dispatch('playFile', hash);
      }, 1500);

      return;
    }

    const file = torrent.files.at(0);
    const isPlayable = TorrentPlayer.isPlayable(file);

    if (isPlayable) {
      dispatch('toggleSelectTorrent', torrent.infoHash);
      return dispatch('playFile', torrent.infoHash);
    }
  };

  const episodeImage = anime?.episode?.image ||
    anime?.bannerImage ||
    anime?.coverImage?.extraLarge

  const { animeColors } = useExtractColor(episodeImage)

  if (!animeColors) return null

  const cardColor = getNeonColor(animeColors[0])

  return (
    <div className="max-w-[400px] px-4 z-10">
      <ShineBorder borderRadius={16} borderWidth={2} color={cardColor}>
        <Card className="flex flex-col z-10 relative overflow-visible">
          <CardHeader className="flex flex-col truncate items-start justify-start z-10">
            <p className="text-base font-medium truncate w-full">
              {anime?.title?.romaji}
            </p>
            <span className="text-sm text-gray-400">
              {`Episodio ${anime?.episode?.episodeNumber || anime?.episode?.episode || '??'}`}
            </span>
          </CardHeader>
          <CardBody
            className="w-[364px] h-full p-0 relative transition duration-300 ease-in-out hover:scale-105 z-50 cursor-pointer"
            onClick={() => handlePlay(anime)}
          >
            <Image
              component="img"
              src={
                episodeImage
              }
              alt={anime?.title?.romaji}
              className="w-full h-full object-cover"
              classNames={{
                img: 'aspect-[16/9] rounded-t-lg'
              }}
            />
            <div className="flex flex-row gap-2 bg-slate-950/25 px-1 py-0.5 rounded-md absolute top-2 right-2 z-50">
              {getAnimeFlags(anime?.torrent?.title)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out hover:opacity-70 z-50">
              <Icon
                icon="gravity-ui:play-fill"
                width="64"
                height="64"
                style={{ color: cardColor }}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex justify-between items-center w-full mt-2">
              <div className="flex items-center">
                <Icon icon="gravity-ui:calendar" />
                <span className="text-sm text-gray-400 ml-1">
                  {timeAgo(anime?.torrent?.pubDate)}
                </span>
              </div>
              <div className="flex items-center">
                <Icon icon="gravity-ui:clock" />
                <span className="text-sm text-gray-400 ml-1">
                  {`${anime?.duration || anime?.episode?.runtime || anime?.episode?.length} mins`}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </ShineBorder>
    </div>
  );
});

module.exports = EpisodeCard;
