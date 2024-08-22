const React = require('react');
const { Divider } = require('@nextui-org/react');

const { genGlassStyle } = require('../../../modules/utils');
const AnimeCard = require('../AnimeSection/anime');
const AnimeCardSkeleton = require('../AnimeSection/skeleton');

const useAnimeRecommendations = require('../../hooks/useAnimeRecommendations');

const AnimeRecommendations = React.memo(({ idAnilist, color, sectionTitle }) => {
  const recommendations = useAnimeRecommendations(idAnilist);

  return (
    <div className="flex flex-col gap-2 z-30 items-start">
      <div className="flex flex-row w-full justify-between items-start mt-2">
        <h2 className="text-2xl font-semibold">{sectionTitle}</h2>
      </div>

      <Divider orientation="horizontal" />

      <div className="flex flex-col gap-6 p-6" style={genGlassStyle(color)}>
        {recommendations ? (recommendations.map((anime, i) => (
          <AnimeCard
            anime={anime}
            state={state}
            glassStyle={genGlassStyle('#575757')}
            key={`anim-recomm-${idAnilist}-${i}`}
          />
        ))) : (
          <AnimeCardSkeleton />
        )}
      </div>
    </div>
  );
});

module.exports = AnimeRecommendations;