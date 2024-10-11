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
const Spinner = require('../../components/common/spinner');

const AnimeDetails = ({ state }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 1500);

  const { idAnilist } = useParams();
  const location = useLocation();
  const animeTitle = location.state?.title || 'Información del Anime';

  useEffect(() => {
    state.window.title = animeTitle;
  }, [state.window, animeTitle]);

  const anime = useAnimeDetails(idAnilist);

  const animeImage = anime?.coverImage?.extraLarge || anime?.bannerImage;
  const bannerImage = anime?.bannerImage || anime?.coverImage?.extraLarge;

  const { animeColors, textColor } = useExtractColor(animeImage);
  const { animeColors: bannerColors } = useExtractColor(bannerImage);

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
    if (anime && animeColors && bannerColors) {
      setIsLoading(false);
    }
  }, [anime, animeColors, bannerColors]);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 1500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <Spinner />;
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
        <div className="flex flex-row gap-8 p-8 pt-0 justify-between items-start h-full">
          <AnimeRecommendationsList
            idAnilist={idAnilist}
            sectionTitle="Animes Similares"
          />
          <AnimeEpisodesList
            state={state}
            idAnilist={idAnilist}
            animeColors={animeColors}
            sectionTitle="Episodios"
          />
        </div>
      </div>

      {showSidebar && (
        <LatestEpisodesSidebar
          state={state}
          bannerColors={bannerColors}
          sectionTitle="Episodios Recientes"
        />
      )}
    </div>
  );
};

module.exports = AnimeDetails;
