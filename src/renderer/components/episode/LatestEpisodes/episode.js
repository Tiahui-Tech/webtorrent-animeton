const React = require('react');
const {
  getAnimeFlags,
  timeAgo,
  getNeonColor
} = require('../../../../modules/utils');
const { dispatch } = require('../../../lib/dispatcher');
const TorrentPlayer = require('../../../lib/torrent-player');

const {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image
} = require('@nextui-org/react');
const { Icon } = require('@iconify/react');
const ShineBorder = require('../../ui/MagicUI/Effects/ShineBorder');

const useExtractColor = require('../../../hooks/useExtractColor');

const EpisodeCard = React.memo(({ anime, state }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePlay = (anime) => {
    setIsLoading(true);
    
    const hash = anime.torrent?.infohash || anime.torrent?.infoHash;
    const torrent = state.saved.torrents.find(
      (torrent) => torrent.infoHash === hash
    );

    if (!torrent) {
      dispatch('addTorrent', anime.torrent.link);

      // Wait 5 seconds to avoid errors and allow backend to prepare the torrent
      setTimeout(() => {
        dispatch('playFile', hash);
        setIsLoading(false);
      }, 5000);

      return;
    }

    const file = torrent.files.at(0);
    const isPlayable = TorrentPlayer.isPlayable(file);

    if (isPlayable) {
      dispatch('toggleSelectTorrent', torrent.infoHash);

      // Wait 5 seconds to avoid errors and allow backend to prepare the torrent
      // Improves effectiveness as it's not the first to play in the app
      setTimeout(() => {
        dispatch('playFile', hash);
        setIsLoading(false);
      }, 5000);
    }
  };

  const episodeImage =
    anime?.episode?.image ||
    anime?.bannerImage ||
    anime?.coverImage?.extraLarge;

  const { animeColors } = useExtractColor(episodeImage);

  if (!animeColors) return null;

  const cardColor = getNeonColor(animeColors[0]);

  return (
    <div className="max-w-[400px] px-4">
      <ShineBorder borderRadius={16} borderWidth={2} color={cardColor}>
        <Card className="flex flex-col relative overflow-visible">
          <CardHeader className="flex flex-col truncate items-start justify-start">
            <p className="text-base font-medium truncate w-full">
              {anime?.title?.romaji}
            </p>
            <span className="text-sm text-gray-400">
              {`Episodio ${anime?.episode?.episodeNumber || anime?.episode?.episode || '??'}`}
            </span>
          </CardHeader>
          <CardBody
            className="w-full h-full p-0 relative transition duration-300 ease-in-out hover:scale-105 cursor-pointer"
            onClick={() => handlePlay(anime)}
          >
            <Image
              component="img"
              src={episodeImage}
              alt={anime?.title?.romaji}
              className={`w-full h-full object-cover ${isLoading && 'grayscale'}`}
              classNames={{
                img: 'aspect-[16/9] rounded-t-lg'
              }}
            />
            <div className="flex flex-row gap-2 bg-slate-950/25 px-1 py-0.5 rounded-md absolute top-2 right-2 z-10">
              {getAnimeFlags(anime?.torrent?.title)}
            </div>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center opacity-100 z-50">
                <Icon
                  icon="fluent:spinner-ios-16-filled"
                  width="64"
                  height="64"
                  className="animate-spin"
                  style={{ color: cardColor }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out hover:opacity-70 z-50">
                <Icon
                  icon="gravity-ui:play-fill"
                  width="64"
                  height="64"
                  style={{ color: cardColor }}
                />
              </div>
            )}
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
