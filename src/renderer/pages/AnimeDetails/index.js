const React = require('react');
const { useParams, useLocation } = require('react-router-dom');
const { useMemo, useState, useEffect } = require('react');

const useExtractColor = require('../../hooks/useExtractColor');
const useModernBackground = require('../../hooks/useModernBackground');
const useAnimeDetails = require('../../hooks/useAnimeDetails');

const AnimeOverview = require('../../components/anime/AnimeOverview');
const AnimeRecommendationsList = require('../../components/anime/AnimeRecommendationsList');
const AnimeEpisodesList = require('../../components/episode/EpisodesList');
const LatestEpisodesSidebar = require('../../components/episode/LatestEpisodesSidebar');

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
      secondaryColor: bannerColors ? bannerColors[0] : null,
      opacity: 0.6
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
        <AnimeOverview
          anime={anime}
          animeColors={animeColors}
          textColor={textColor}
          background={background}
        />
        <div className="flex flex-row gap-16 p-8 pt-0 justify-between items-start h-full">
          <AnimeRecommendationsList
            idAnilist={idAnilist}
            sectionTitle="Animes Similares"
          />
          <AnimeEpisodesList
            idAnilist={idAnilist}
            animeColors={animeColors}
            sectionTitle="Episodios"
          />
        </div>
      </div>

      <LatestEpisodesSidebar
        bannerColors={bannerColors}
        sectionTitle="Episodios Recientes"
      />
    </div>
  );
};

module.exports = AnimeDetails;
