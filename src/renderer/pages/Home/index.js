const React = require('react');
const { useState, useEffect } = require('react');
const eventBus = require('../../lib/event-bus');

const useAnimesData = require('../../hooks/useAnimesData');

const AnimeCarousel = require('../../components/anime/AnimeCarousel');
const LatestEpisodes = require('../../components/episode/LatestEpisodes');
const AnimeSection = require('../../components/anime/AnimeSection');
const Spinner = require('../../components/common/spinner');

const Home = ({ state }) => {
  const animes = useAnimesData({ displayCount: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleSearchTermChanged = (term) => {
      setSearchTerm(term);
    };

    eventBus.on('searchTermChanged', handleSearchTermChanged);

    return () => {
      eventBus.off('searchTermChanged', handleSearchTermChanged);
    };
  }, []);

  if (!animes) return <Spinner />;

  return (
    <div>
      {!searchTerm && (
        <>
          <AnimeCarousel animes={animes} />
          <LatestEpisodes state={state} sectionTitle={'Ultimos Episodios'} />
        </>
      )}
      <AnimeSection
        state={state}
        sectionTitle={searchTerm ? '' : 'Animes Populares'}
        searchTerm={searchTerm}
        fullScreen={!!searchTerm}
      />
    </div>
  );
};

module.exports = Home;
