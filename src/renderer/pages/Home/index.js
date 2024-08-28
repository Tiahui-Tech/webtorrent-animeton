const React = require('react');

const useAnimesData = require('../../hooks/useAnimesData');

const LatestEpisodes = require('../../components/LatestEpisodes');
const AnimeSection = require('../../components/AnimeSection');
const AnimeCarousel = require('../../components/AnimesCarrousel');

const Home = ({ state }) => {
  const animes = useAnimesData();
  
  if (!animes) return <div>Cargando...</div>;

  return (
    <div>
      <AnimeCarousel animes={animes.slice(0, 10)} />
      <LatestEpisodes state={state} sectionTitle={'Ultimos Episodios'} />
      <AnimeSection state={state} sectionTitle={'Popular en este momento'} />
    </div>
  );
};
module.exports = Home;
