const React = require('react');
const useAnimesData = require('../../hooks/useAnimesData');
const BoxReveal = require('../../components/MagicUI/Text/BoxReveal');

const AnimeCard = require('./anime');
const AnimeCardSkeleton = require('./skeleton');

const AnimeSection = ({ state, sectionTitle }) => {
  const animes = useAnimesData();

  return (
    <div className="flex flex-col py-8 justify-center items-center bg-zinc-900">
      <BoxReveal boxColor={'#fff'} duration={0.8}>
        <h2 className="relative mb-4 text-2xl font-bold z-10">
          {sectionTitle}
        </h2>
      </BoxReveal>
      <div className="grid grid-cols-6 auto-rows-max gap-8 justify-center items-center">
        {animes
          ? animes.map((anime, i) => (
            <AnimeCard
              key={`anime-${anime.id}-${i}`}
              anime={anime}
              state={state}
            />
          ))
          // While loading, shows 8 AnimeCardSkeleton per row
          : Array.from({ length: 6 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    </div>
  );
};

module.exports = AnimeSection;
