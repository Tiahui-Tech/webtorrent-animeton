const React = require('react');

const useModernBackground = require('../../hooks/useModernBackground');

const LatestEpisodes = require('../../components/LatestEpisodes');
const AnimeSection = require('../../components/AnimeSection');

const Home = ({ state }) => {
  const background = useModernBackground({
    primaryColor: '#00d9ff',
    secondaryColor: '#ff00ea',
    disablePattern: true,
    opacity: 0.3
  });

  return (
    <div>
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${background})` }}
      />
      <LatestEpisodes state={state} sectionTitle={'Ultimos Episodios'} />
      <AnimeSection state={state} sectionTitle={'Popular en este momento'} />
    </div>
  );
};
module.exports = Home;
