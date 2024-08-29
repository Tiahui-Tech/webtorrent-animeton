const React = require('react');
const useRSSData = require('../../../hooks/useRSSData');
const useModernBackground = require('../../../hooks/useModernBackground');

const Marquee = require('../../ui/MagicUI/Marquee');
const Particles = require('../../ui/MagicUI/Particles');
const BoxReveal = require('../../ui/MagicUI/Text/BoxReveal');

const EpisodeCard = require('./episode');
const EpisodeCardSkeleton = require('./skeleton');

const LatestEpisodes = React.memo(({ state, sectionTitle }) => {
  const rssAnimes = useRSSData({
    page: 1,
    perPage: 10,
    displayCount: 10,
    emptyState: true
  });
  const background = useModernBackground({
    primaryColor: '#00d9ff',
    secondaryColor: '#ff00ea',
    disablePattern: true,
    opacity: 0.6
  });

  const isRssLoading = rssAnimes.every(anime => anime === undefined)

  return (
    <div className="relative flex flex-col py-8 justify-center items-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${background})`,
          maskImage: 'linear-gradient(to top, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 70%, transparent)'
        }}
      />
      <Particles
        className="absolute inset-0"
        quantity={200}
        staticity={150}
        color="#fff"
        refresh
      />
      <BoxReveal boxColor={'#fff'} duration={0.8}>
        <h2 className="relative text-2xl font-bold mb-4 px-8">
          {sectionTitle}
        </h2>
      </BoxReveal>
      <Marquee pauseOnHover className="[--duration:40s]">
        {isRssLoading ?
          <EpisodeCardSkeleton />
          :
          rssAnimes.map((anime, i) => (
            <EpisodeCard anime={anime} state={state} key={i} />
          ))
        }
      </Marquee>
    </div>
  );
});

module.exports = LatestEpisodes;
