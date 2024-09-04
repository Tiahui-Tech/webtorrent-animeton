const React = require('react');

const useAnimesData = require('../../hooks/useAnimesData');

const AnimeCarousel = require('../../components/anime/AnimeCarousel');
const LatestEpisodes = require('../../components/episode/LatestEpisodes');
const AnimeSection = require('../../components/anime/AnimeSection');

const Home = ({ state }) => {
  const animes = useAnimesData({ displayCount: 10 });
  
  if (!animes) return <div>Cargando...</div>;

  return (
    <div>
      <AnimeCarousel animes={animes} />
      <LatestEpisodes state={state} sectionTitle={'Ultimos Episodios'} />
      <AnimeSection state={state} sectionTitle={'Popular en este momento'} />
    </div>
  );
};
module.exports = Home;
