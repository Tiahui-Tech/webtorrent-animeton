const React = require('react');
const { memo } = React;
const { useNavigate } = require('react-router-dom');
const {
  getAnimeFlags,
  timeAgo,
  getNeonColor
} = require('../../../../modules/utils');

const {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} = require('@nextui-org/react');
const { Icon } = require('@iconify/react');
const { motion } = require('framer-motion');

const useExtractColor = require('../../../hooks/useExtractColor');

const EpisodeCard = memo(({ anime, isLoading, onPlay }) => {
  const navigate = useNavigate();

  const episodeImage =
    anime?.episode?.image ||
    anime?.bannerImage ||
    anime?.coverImage?.extraLarge;

  const episode = anime?.episode;

  const handlePlay = (e) => {
    e.preventDefault();
    onPlay(episode);
  }

  const handleIconClick = (e) => {
    e.stopPropagation();
    handlePlay(e);
  }

  const handleAnimeClick = () => {
    navigate(`/anime/${anime.idAnilist}`, {
      state: { title: anime.title.romaji }
    });
  };

  const { animeColors } = useExtractColor(episodeImage);

  if (!animeColors) return null;

  const cardColor = getNeonColor(animeColors[0]);

  return (
    <div className="max-w-[400px] px-4">
      <Card className="flex flex-col relative overflow-visible rounded-md border border-zinc-800">
        <CardHeader className="flex flex-col truncate items-start justify-start">
          <p className="text-base font-medium truncate w-full cursor-pointer" onClick={handleAnimeClick}>
            {anime?.title?.romaji}
          </p>
          <span className="text-sm text-gray-400">
            {`Episodio ${anime?.episode?.episodeNumber || anime?.episode?.episode || '??'}`}
          </span>
        </CardHeader>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <CardBody
            className="w-full h-full p-0 relative cursor-pointer rounded-sm"
            onClick={handlePlay}
          >
            <img
              component="img"
              src={episodeImage}
              alt={anime?.title?.romaji}
              className={`aspect-[16/9] w-full h-full object-cover ${isLoading && 'grayscale'}`}
            />
            <div className="flex flex-row gap-2 bg-slate-950/25 px-1 py-0.5 rounded-md absolute top-2 right-2 z-10">
              {getAnimeFlags(anime?.torrent?.title)}
            </div>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center opacity-100 z-30">
                <Icon
                  icon="fluent:spinner-ios-16-filled"
                  width="64"
                  height="64"
                  className="animate-spin"
                  style={{ color: cardColor }}
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out hover:opacity-70 z-30"
                onClick={handleIconClick}
              >
                <Icon
                  icon="gravity-ui:play-fill"
                  className="pointer-events-none"
                  width="64"
                  height="64"
                  style={{ color: cardColor }}
                />
              </div>
            )}
          </CardBody>
        </motion.div>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
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
