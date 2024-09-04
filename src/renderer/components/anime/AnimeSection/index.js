const React = require('react');
const useAnimesData = require('../../../hooks/useAnimesData');
const BoxReveal = require('../../ui/MagicUI/Text/BoxReveal');

const AnimeCard = require('./anime');
const AnimeCardSkeleton = require('./skeleton');

const AnimeSection = ({ state, sectionTitle }) => {
  const animes = useAnimesData();

  return (
    <div className="flex flex-col p-8 justify-center items-center bg-zinc-960">
      <BoxReveal boxColor={'#fff'} duration={0.8}>
        <h2 className="relative mb-4 text-2xl font-bold z-10">
          {sectionTitle}
        </h2>
      </BoxReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-max gap-4 sm:gap-6 md:gap-8 justify-center items-center">
        {animes
          ? animes.map((anime, i) => (
            <AnimeCard
              key={`anime-${anime.id}-${i}`}
              anime={anime}
              state={state}
            />
          ))
          // While loading, shows a responsive number of AnimeCardSkeleton
          : Array.from({ length: 12 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    </div>
  );
};

module.exports = AnimeSection;
