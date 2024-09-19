const React = require('react');
const { useState, useMemo, useEffect } = React;

const useAnimesData = require('../../../hooks/useAnimesData');
const useSearchAnimes = require('../../../hooks/useSearchAnimes');

const BoxReveal = require('../../ui/MagicUI/Text/BoxReveal');
const SearchInput = require('../../common/search-input');
const AnimeCard = require('./anime');
const AnimeCardSkeleton = require('./skeleton');
const { Icon } = require('@iconify/react');

const AnimeSection = ({ state, sectionTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const animes = useAnimesData();
  const searchAnimes = useSearchAnimes(searchTerm, 12);

  useEffect(() => {
    const fetchAnimes = async () => {
      setIsLoading(true);
      if (!searchTerm) {
        setFilteredAnimes(animes || []);
      } else {
        const searchResults = await searchAnimes();
        setFilteredAnimes(searchResults.filter((anime) =>
          anime.title.romaji.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      }
      setIsLoading(false);
    };

    fetchAnimes();
  }, [searchTerm, animes, searchAnimes]);

  return (
    <div className="flex flex-col p-8 justify-center items-center bg-zinc-960">
      <div className="relative flex flex-row justify-center items-center w-full mb-4">
        <BoxReveal boxColor={'#fff'} duration={0.8}>
          <h2 className="relative text-2xl font-bold z-10">
            {sectionTitle}
          </h2>
        </BoxReveal>
        <div className="absolute right-0 flex items-center">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-max gap-4 sm:gap-6 md:gap-8 justify-center items-center min-h-[400px]">
          {Array.from({ length: 12 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : filteredAnimes.length === 0 ? (
        <div className="flex flex-col justify-center items-center w-full min-h-[400px]">
          <Icon icon="gravity-ui:circle-xmark" width="128" height="128" style={{ color: '#71717a' }} />
          <p className="text-2xl font-bold text-zinc-500">No se encontraron animes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-max gap-4 sm:gap-6 md:gap-8 justify-center items-center min-h-[400px]">
          {filteredAnimes.map((anime, i) => (
            <AnimeCard
              key={`anime-${anime.id}-${i}`}
              anime={anime}
              state={state}
            />
          ))}
        </div>
      )}
    </div>
  );
};

module.exports = AnimeSection;
