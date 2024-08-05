const React = require('react');
const useAnimeData = require('../../hooks/useAnimeData');

const AnimeCard = require('./anime-card');
const AnimeCardSkeleton = require('./anime-card-skeleton');

const AnimeSection = ({ state, sectionTitle }) => {
  const animes = useAnimeData();

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold">{sectionTitle}</h2>
      <div className="grid grid-cols-6 auto-rows-max gap-8 justify-center items-center">
        {!animes &&
          Array.from({ length: 6 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
        {animes &&
          animes.map((anime, i) => (
            <AnimeCard
              key={`anime-${anime.id}-${i}`}
              anime={anime}
              state={state}
            />
          ))}
      </div>
    </div>
  );
};

module.exports = AnimeSection;
