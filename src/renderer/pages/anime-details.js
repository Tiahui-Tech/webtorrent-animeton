const React = require('react');
const { Card, CardBody, Image } = require('@nextui-org/react');
const useAnimeEpisodesData = require('../hooks/useAnimeEpisodesData');

const EpisodesList = require('../components/EpisodesList');
const useExtractColor = require('../hooks/useExtractColor');

const AnimeDetails = ({ state }) => {
  const anime = state.location.current().data.selectedAnime;
  const episodesData = useAnimeEpisodesData(anime.idAnil);
  const { animeColors, textColor } = useExtractColor(
    anime.coverImage.extraLarge
  );

  if (!animeColors && !textColor) {
    return null
  }

  return (
    <div>
      <div className="relative w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${anime.bannerImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] to-black/40 z-10" />
        <Card className="relative shadow-lg inset-0 overflow-auto bg-opacity-0 z-20">
          <CardBody className="flex flex-row p-4 justify-center items-center">
            <div className="relative flex flex-col justify-center items-center rounded-xl overflow-hidden">
              <Image
                alt="anime-cover-image"
                src={anime.coverImage.extraLarge}
                className="relative max-h-96"
              />
            </div>
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
          </CardBody>
        </Card>
      </div>

      <EpisodesList episodesData={episodesData} animeColors={animeColors} />
    </div>
  );
};

module.exports = AnimeDetails;
