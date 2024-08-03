const React = require('react');
const { Card, CardBody, Image } = require('@nextui-org/react');
const useAnimeEpisodesData = require('../hooks/useAnimeEpisodesData');

const EpisodesList = require('../components/EpisodesList');

const AnimeDetails = ({ state }) => {
  const anime = state.location.current().data.selectedAnime;
  const episodesData = useAnimeEpisodesData(anime.idAnil);

  return (
    <div>
      <Card className="">
        <CardBody className="flex flex-row p-4 justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <Image
              alt="anime-cover-image"
              src={anime.coverImage.extraLarge}
              className="max-h-96"
            />
            <p className="text-base font-medium truncate">
              {anime.title.romaji}
            </p>
            <span className="text-sm text-gray-400 ml-1">
              {anime.title.native}
            </span>
          </div>
          <div className="flex flex-col p-8 max-w-[50vw] whitespace-pre-wrap">
            <p>{anime.description}</p>
          </div>
        </CardBody>
      </Card>
      <EpisodesList episodesData={episodesData} />
    </div>
  );
};

module.exports = AnimeDetails;
