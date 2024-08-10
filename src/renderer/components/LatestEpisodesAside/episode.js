const React = require('react');
const { Icon } = require('@iconify/react');
const { Image } = require('@nextui-org/react');

const Episode = React.memo(({ anime }) => {
  return (
    <div className="inline-block" style={{ width: 'min-content' }}>
      <div className="flex flex-col w-[227px] max-w-[227px]">
        <div className="relative cursor-pointer transition-all duration-300 hover:grayscale">
          <Image
            alt="episode-image"
            src={
              anime.episode.image ||
              anime.bannerImage ||
              anime.coverImage.extraLarge
            }
            className="aspect-video object-cover w-auto h-32"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out shadow-current hover:opacity-50 z-40">
            <Icon icon="gravity-ui:play-fill" width="64" height="64" />
          </div>
        </div>
        <div className="flex flex-row justify-between mt-1 overflow-hidden">
          <p className="text-base text-left font-medium truncate flex-grow min-w-0">
            {`${anime.title.romaji}`}
          </p>
          <p className="text-base text-right text-gray-400 whitespace-nowrap ml-2 flex-shrink-0">
            {`${anime.duration || anime.episode.runtime || anime.episode.length} mins`}
          </p>
        </div>
      </div>
    </div>
  );
});

module.exports = Episode;
