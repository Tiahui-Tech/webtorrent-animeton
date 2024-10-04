const React = require('react');
const { useState, memo } = React;
const {
  getAnimeFlags,
  timeAgo,
  getNeonColor
} = require('../../../../modules/utils');
const TorrentPlayer = require('../../../lib/torrent-player');

const {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} = require('@nextui-org/react');
const { Icon } = require('@iconify/react');

const useExtractColor = require('../../../hooks/useExtractColor');

const EpisodeCard = memo(({ anime, state }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    TorrentPlayer.playTorrent(anime, state, setIsLoading);
  }

  const episodeImage =
    anime?.episode?.image ||
    anime?.bannerImage ||
    anime?.coverImage?.extraLarge;

  const { animeColors } = useExtractColor(episodeImage);

  if (!animeColors) return null;

  const cardColor = getNeonColor(animeColors[0]);

  return (
    <div className="max-w-[400px] px-4">
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
            onClick={handlePlay}
          >
            <img
              component="img"
              src={episodeImage}
              alt={anime?.title?.romaji}
              className={`aspect-[16/9] rounded-t-lg w-full h-full object-cover ${isLoading && 'grayscale'}`}
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
    </div>
  );
});

module.exports = EpisodeCard;
