const React = require('react');
const { useMemo } = require('react');
const { Divider } = require('@nextui-org/react');

const useExtractColor = require('../../hooks/useExtractColor');
const useModernBackground = require('../../hooks/useModernBackground');
const { genGlassStyle } = require('../../../modules/utils');

const AnimeCard = require('../../components/AnimeSection/anime');
const AnimeEpisodes = require('../../components/AnimeEpisodes');
const LatestEpisodes = require('../../components/LatestEpisodesAside');
const AnimeInfo = require('../../components/AnimeInfo');

const AnimeDetails = ({ state }) => {
  const anime = useMemo(
    () => state.location.current().data.selectedAnime,
    [state]
  );

  const { animeColors, textColor } = useExtractColor(
    anime.coverImage.extraLarge
  );
  const { animeColors: bannerColors } = useExtractColor(anime.bannerImage);

  const backgroundConfig = useMemo(
    () => ({
      primaryColor: animeColors ? animeColors[0] : null,
      secondaryColor: bannerColors ? bannerColors[0] : null
    }),
    [animeColors, bannerColors]
  );

  const background = useModernBackground(backgroundConfig);

  const isLoading = !animeColors || !bannerColors || !background;

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row bg-black justify-between items-start">
      <div className="relative w-full">
        <AnimeInfo
          anime={anime}
          animeColors={animeColors}
          textColor={textColor}
          background={background}
        />

        <div className="flex flex-row gap-16 p-8 pt-0 justify-between items-start h-full">
          <div className="flex flex-col gap-2 z-30 items-start">
            <div className="flex flex-row w-full justify-between items-start mt-2">
              <h2 className="text-2xl font-semibold">Animes Similares</h2>
            </div>

            <Divider orientation="horizontal" />

            <div
              className="flex flex-col gap-6 p-6"
              style={genGlassStyle(animeColors[0])}
            >
              <AnimeCard anime={anime} glassStyle={genGlassStyle('#575757')} />
            </div>
          </div>

          <AnimeEpisodes idAnil={anime.idAnil} animeColors={animeColors} />
        </div>
      </div>

      <LatestEpisodes bannerColors={bannerColors} />
    </div>
  );
};

module.exports = AnimeDetails;
