const React = require('react');

const { Icon } = require('@iconify/react');
const { Card, CardBody, Image } = require('@nextui-org/react');

const EpisodeCard = React.memo(({ episode }) => {
  return (
    <Card
      className="w-full relative transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer group/card bg-zinc-950 rounded-xl border-2 border-zinc-900"
    >
      <CardBody className="flex flex-row relative gap-4 justify-start">
        <div className="flex flex-row gap-4 items-center">
          <div className="relative">
            <Image
              alt="episode-image"
              src={episode.image}
              className="aspect-video object-cover w-auto h-32 transition-all duration-300 ease-in-out group-hover/card:grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 ease-in-out group-hover/card:opacity-70">
              <Icon icon="gravity-ui:play-fill" width="64" height="64" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-medium truncate w-full max-w-[480px]">
              {`E${episode.episodeNumber} - ${episode.title.en}`}
            </p>
            <span className="text-xl text-gray-400">{episode.title.ja}</span>
          </div>
        </div>

        <div className="flex items-center absolute right-4 top-0 bottom-0 gap-2">
          <div className="flex flex-col">
            <div className="flex flex-col gap-6 justify-between items-end">
              <div className="flex flex-row gap-1">
                <span className="text-base text-gray-400">
                  {episode.rating}
                </span>
                <Icon
                  icon="gravity-ui:star"
                  width="16"
                  height="16"
                  className="text-gray-400"
                  style={{ marginTop: 4 }}
                />
              </div>
              <div className="flex flex-row gap-1">
                <span className="text-base text-gray-400">
                  {episode.length}
                  {' mins'}
                </span>
                <Icon
                  icon="gravity-ui:clock"
                  width="16"
                  height="16"
                  className="text-gray-400"
                  style={{ marginTop: 5 }}
                />
              </div>
              <div className="flex flex-row gap-1">
                <span className="text-base text-gray-400">
                  {new Date(episode.airDateUtc).toLocaleDateString()}
                </span>
                <Icon
                  icon="gravity-ui:calendar"
                  width="16"
                  height="16"
                  className="text-gray-400"
                  style={{ marginTop: 4 }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

module.exports = EpisodeCard;
