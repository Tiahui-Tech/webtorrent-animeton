const React = require('react')
const useRSSData = require("../../hooks/useRSSData")
const { getAnimeFlags, timeAgo } = require("../../../modules/utils")
const { dispatch } = require("../../lib/dispatcher")

const { Card, CardHeader, CardBody, CardFooter, Image, Skeleton } = require('@nextui-org/react')
const { Icon } = require('@iconify/react');

const RssFeed = ({ state }) => {
    const rssAnimes = useRSSData({
        page: 1,
        perPage: 10,
        displayCount: 8
    })

    return (
        <div className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>Latest episodes</h2>
            <div className="grid grid-cols-4 auto-cols-max gap-8 justify-center items-center">
                {!rssAnimes && Array.from({ length: 8 }).map((_, index) => (
                    <EpisodeCardSkeleton key={`skeleton-${index}`} />
                ))}
                {rssAnimes && rssAnimes.map((anime, i) => (
                    <EpisodeCard key={`rss-${anime.id}-${i}`} anime={anime} state={state} />
                ))}
            </div>
        </div>)
}

const EpisodeCard = React.memo(({ anime, state }) => {
    const handlePlay = (anime) => {
        const hash = anime.torrent.infohash
        const torrent = state.saved.torrents.find(torrent => torrent.infoHash === hash);

        if (torrent) {
            return dispatch('playFile', torrent.infoHash)
        }

        dispatch('addTorrent', anime.torrent.link)
        setTimeout(() => {
            dispatch('playFile', hash)
        }, 1500);
    }
    return (
        <div className='max-w-[400px] z-10'>
            <Card className="flex flex-col z-10 relative overflow-visible">
                <CardHeader className='flex flex-col truncate items-start justify-start z-10'>
                    <p className='text-base font-medium truncate w-full'>{anime.title.romaji}</p>
                    <span className='text-sm text-gray-400'>
                        {`Episodio ${anime.episode.episodeNumber || anime.episode.episode || "??"}`}
                    </span>

                </CardHeader>
                <CardBody className='w-[400px] h-[225px] p-0 relative transition duration-300 ease-in-out hover:scale-105 z-50 cursor-pointer' onClick={() => handlePlay(anime)}>
                    <Image
                        component="img"
                        src={anime.episode.image || anime.bannerImage || anime.coverImage.extraLarge}
                        alt={anime.title.romaji}
                        className="w-full h-full object-cover"
                        classNames={{
                            img: "aspect-[16/9] rounded-t-lg"
                        }}
                    />
                    <div className='flex flex-row gap-2 bg-slate-950/25 px-1 py-0.5 rounded-md absolute top-2 right-2 z-50'>
                        {getAnimeFlags(anime.torrent.title)}
                    </div>
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out hover:opacity-70 z-50'>
                        <Icon icon="gravity-ui:play-fill" width="64" height="64" style={{ color: '#000000' }} />
                    </div>
                </CardBody>
                <CardFooter>
                    <div className='flex justify-between items-center w-full mt-2'>
                        <div className='flex items-center'>
                            <Icon icon="gravity-ui:calendar" />
                            <span className="text-sm text-gray-400 ml-1">
                                {timeAgo(anime.torrent.pubDate)}
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <Icon icon="gravity-ui:clock" />
                            <span className="text-sm text-gray-400 ml-1">
                                {`${anime.episode.runtime || anime.episode.length} mins`}
                            </span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
})

const EpisodeCardSkeleton = () => {
    return (
        <div className='w-[400px] h-[345px] z-10'>
            <Card className="flex flex-col z-10 relative overflow-visible">
                <CardHeader className='flex flex-col truncate items-start justify-start z-10'>
                    <Skeleton className="w-3/4 rounded-lg">
                        <div className="h-6 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-1/2 rounded-lg mt-2">
                        <div className="h-4 rounded-lg bg-default-100"></div>
                    </Skeleton>
                </CardHeader>
                <CardBody className='p-0 relative z-50'>
                    <Skeleton className="w-full rounded-t-lg">
                        <div className="aspect-[16/9] rounded-t-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="absolute top-2 right-2 rounded-md">
                        <div className="h-6 w-16 rounded-md bg-default-200"></div>
                    </Skeleton>
                </CardBody>
                <CardFooter>
                    <div className='flex justify-between items-center w-full mt-2'>
                        <Skeleton className="rounded-lg">
                            <div className="h-4 w-24 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="rounded-lg">
                            <div className="h-4 w-24 rounded-lg bg-default-200"></div>
                        </Skeleton>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

module.exports = RssFeed;