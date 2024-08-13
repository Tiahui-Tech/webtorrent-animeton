const React = require('react');
const { useParams, useLocation } = require('react-router-dom');
const { useMemo, useState, useEffect } = require('react');

const useExtractColor = require('../../hooks/useExtractColor');
const useModernBackground = require('../../hooks/useModernBackground');

const AnimeEpisodes = require('../../components/AnimeEpisodes');
const LatestEpisodes = require('../../components/LatestEpisodesAside');
const AnimeInfo = require('../../components/AnimeInfo');
const useAnimeDetails = require('../../hooks/useAnimeDetails');
const AnimeRecommendations = require('../../components/AnimeRecommendations');

const AnimeDetails = ({ state }) => {
  const [isLoading, setIsLoading] = useState(true);

  const { idAnilist } = useParams();
  const location = useLocation();
  const animeTitle = location.state?.title || 'Información del Anime';

  useEffect(() => {
    state.window.title = animeTitle;
  }, [state.window, animeTitle]);

  const anime = useAnimeDetails(idAnilist);

  const { animeColors, textColor } = useExtractColor(
    anime?.coverImage?.extraLarge || ''
  );
  const { animeColors: bannerColors } = useExtractColor(
    anime?.bannerImage || ''
  );

  const backgroundConfig = useMemo(
    () => ({
      primaryColor: animeColors ? animeColors[0] : null,
      secondaryColor: bannerColors ? bannerColors[0] : null
    }),
    [animeColors, bannerColors]
  );

  const background = useModernBackground(backgroundConfig);

  useEffect(() => {
    if (anime && animeColors && bannerColors && background) {
      setIsLoading(false);
    }
  }, [anime, animeColors, bannerColors, background]);

  if (isLoading) {
    return null;
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
          <AnimeRecommendations
            idAnilist={idAnilist}
            color={animeColors[0]}
            sectionTitle="Animes Similares"
          />
          <AnimeEpisodes
            idAnilist={idAnilist}
            animeColors={animeColors}
            sectionTitle="Episodios"
          />
        </div>
      </div>

      <LatestEpisodes
        bannerColors={bannerColors}
        sectionTitle="Episodios Recientes"
      />
    </div>
  );
};

module.exports = AnimeDetails;
