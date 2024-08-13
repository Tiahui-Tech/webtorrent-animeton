const React = require('react');
const useAnimesData = require('../../hooks/useAnimesData');

const AnimeCard = require('./anime');
const AnimeCardSkeleton = require('./anime-skeleton');

const AnimeSection = ({ state, sectionTitle }) => {
  const animes = useAnimesData();

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold">{sectionTitle}</h2>
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
