const React = require('react');
const { Card, CardBody, Image } = require('@nextui-org/react');
const { Icon } = require('@iconify/react');

const EpisodeCard = ({ episode }) => {
  return (
    <Card className="w-[50vw] max-w-[50vw]">
      <CardBody className="flex flex-row gap-4 justify-between items-center">
        <div className="flex flex-row gap-4 items-center">
          <Image
            alt="episode-image"
            src={episode.image}
            className="aspect-square object-cover w-32 h-32"
          ></Image>
          <div className="flex flex-col gap-2 justify-start">
            <p className="text-large font-medium truncate w-full">
              {episode.title.en}
            </p>
            <span className="text-large text-gray-400">{episode.title.ja}</span>
          </div>
        </div>
        <div className="flex flex-row gap-1 pr-4 items-center justify-center">
          <Icon
            icon="gravity-ui:hashtag"
            width="50"
            height="50"
            style={{ color: '#545454' }}
          />
          <span className="text-5xl font-medium">{episode.episodeNumber}</span>
        </div>
      </CardBody>
    </Card>
  );
};

module.exports = EpisodeCard;
