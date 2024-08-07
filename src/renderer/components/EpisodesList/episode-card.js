const React = require('react');
const { Card, CardBody, Image } = require('@nextui-org/react');
const { Icon } = require('@iconify/react');

const EpisodeCard = ({ episode, animeColor }) => {
  return (
    <Card
      className="w-[70vw] max-w-[70vw] z-30"
      style={{
        background: `${animeColor}15`,
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5.8px)',
        WebkitBackdropFilter: 'blur(5.8px)',
        border: `2px solid ${animeColor}15`
      }}
    >
      <CardBody className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-end">
          <Image
            alt="episode-image"
            src={episode.image}
            className="aspect-video object-cover w-auto h-32"
          />
          {/* WIP */}
          <div className="flex flex-col gap-6 justify-between">
            <div className="flex flex-row gap-1">
              <Icon
                icon="gravity-ui:calendar"
                width="16"
                height="16"
                className="text-gray-400"
                style={{ marginTop: 4 }}
              />
              <span className="text-base text-gray-400">
                {new Date(episode.airDateUtc).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-row gap-1">
              <Icon
                icon="gravity-ui:clock"
                width="16"
                height="16"
                className="text-gray-400"
                style={{ marginTop: 5 }}
              />
              <span className="text-base text-gray-400">
                {episode.length}
                {' mins'}
              </span>
            </div>
            <div className="flex flex-row gap-1">
              <Icon
                icon="gravity-ui:star"
                width="16"
                height="16"
                className="text-gray-400"
                style={{ marginTop: 4 }}
              />
              <span className="text-base text-gray-400">{episode.rating}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pr-4 items-start justify-end">
          <div className="flex flex-col gap-2">
            <p className="text-3xl text-right font-medium truncate w-full">
              {`${episode.title.en}`}
            </p>
            <span className="text-xl text-right text-gray-400">
              {episode.title.ja}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

module.exports = EpisodeCard;
