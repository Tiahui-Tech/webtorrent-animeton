const React = require('react')
const { getAnimeFlags, timeAgo } = require("../../../modules/utils")
const { dispatch } = require("../../lib/dispatcher")
const useRSSData = require("../../hooks/useRSSData")

const { Card, CardHeader, CardBody, CardFooter, Image, Button } = require('@nextui-org/react')
const { Icon } = require('@iconify/react');

const RssFeed = ({ state }) => {
    const rssAnimes = useRSSData({
        page: 1,
        perPage: 10,
        displayCount: 8
    })

    if (!rssAnimes) {
        return <>Loading...</>
    }

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
        <div className='p-8'>
            <h2 className='text-2xl font-bold mb-4'>Latest episodes</h2>
            <div className="grid grid-cols-4 auto-cols-max gap-8 justify-center items-center">
                {rssAnimes.map((anime, i) => (
                    <div key={`rss-${anime.id}-${i}`} className='max-w-[400px] z-10'>
                        <Card className="flex flex-col z-10 relative overflow-visible">
                            <CardHeader className='flex flex-col truncate items-start justify-start z-10'>
                                <p className='text-base font-medium truncate w-full'>{anime.title.romaji}</p>
                                <span className='text-sm text-gray-400'>
                                    {`Episodio ${anime.episode.episodeNumber || anime.episode.episode || "??"}`}
                                </span>

                            </CardHeader>
                            <CardBody className='p-0 relative transition duration-300 ease-in-out hover:scale-105 z-50 cursor-pointer' onClick={() => handlePlay(anime)}>
                                <Image
                                    component="img"
                                    src={anime.episode.image || anime.bannerImage || anime.coverImage.extraLarge}
                                    alt={anime.title.romaji}
                                    className="w-full object-cover"
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
                ))}
            </div>
        </div>)
}

module.exports = RssFeed;