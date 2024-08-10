const React = require('react');

const LatestEpisodes = require('../../components/LatestEpisodes');
const AnimeSection = require('../../components/AnimeSection');

const Home = ({ state }) => {
  return (
    <div>
      <LatestEpisodes state={state} sectionTitle={'Ultimos Episodios'} />
      <AnimeSection state={state} sectionTitle={'Popular en este momento'} />
    </div>
  );
};
module.exports = Home;
