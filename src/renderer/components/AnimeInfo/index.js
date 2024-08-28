const { Image } = require('@nextui-org/react');
const React = require('react');

const AnimeInfo = ({ anime, animeColors, textColor, background }) => {
  return (
    <div className="relative w-full p-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${anime.bannerImage})` }}
      />
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-black/30" />
      <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#000000] to-transparent" />

      <div className="relative shadow-none inset-0 bg-opacity-0">
        <div className="flex flex-row justify-start items-center p-0">
          <Image
            alt="anime-cover-image"
            src={anime.coverImage.extraLarge}
            className="relative max-h-96"
          />
          <div className="flex flex-col p-8 gap-6 justify-between max-w-[50vw] h-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-medium truncate">
                {anime.title.romaji}
              </h1>
              <h2 className="text-3xl text-gray-300 ml-1">
                {anime.title.native}
              </h2>
            </div>
            <div className="flex flex-row gap-4">
              {anime.genres.map((genr, i) => (
                <span
                  key={`genre-${i}`}
                  className="mt-2 text-zinc-900 font-medium p-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: animeColors.at(0),
                    color: textColor,
                    boxShadow: `0px 2px 15px ${animeColors.at(0)}`
                  }}
                >
                  {genr}
                </span>
              ))}
            </div>
            <p
              className="whitespace-pre-wrap truncate"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 9,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {anime.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = AnimeInfo;
