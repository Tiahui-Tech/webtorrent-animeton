const React = require('react')
const { getFormatIcon } = require("../../../modules/utils")
const useAnimeData = require("../../hooks/useAnimeData")
const { STATUS_LABELS, STATUS_COLORS } = require('../../../constants/anime');
const { Card, CardHeader, CardBody, Image, Button, Chip } = require('@nextui-org/react')
const { Icon } = require('@iconify/react');


const AnimeFeed = ({ state }) => {
    const animes = useAnimeData()

    if (!animes) {
        return <>Loading...</>
    }

    return (
        <div className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Trending anime</h2>
            <div className="grid grid-cols-6 auto-rows-max gap-8 justify-center items-center">
                {animes.map((anime, i) => (
                    <Card
                        key={`anime-${anime.id}-${i}`}
                        className="w-64 transition duration-300 ease-in-out hover:scale-105"
                        isPressable
                        onPress={() => state.location.go({
                            url: 'anime-details',
                            setup: (cb) => {
                                state.window.title = 'Anime Details'
                                cb(null)
                            }
                        })}
                    >
                        <CardBody className="p-0 relative">
                            <Image
                                src={anime.coverImage.extraLarge}
                                alt={anime.title.romaji}
                                className="w-full object-cover"
                                classNames={{
                                    img: "aspect-[9/14] rounded-t-lg"
                                }}
                            />
                            <div className='flex flex-row absolute top-2 right-2 z-50'>
                                <Chip
                                    variant='shadow'
                                    startContent={<Icon icon="gravity-ui:circle-fill" />}
                                    color={`${STATUS_COLORS[anime.status]}`}
                                >
                                    {STATUS_LABELS[anime.status]}
                                </Chip>
                            </div>
                        </CardBody>
                        <CardHeader className="flex flex-col items-start p-3">
                            <p className="text-base font-medium truncate w-full">
                                {anime.title.romaji}
                            </p>
                            <div className="flex justify-between items-center w-full mt-2">
                                <div className="flex items-center">
                                    <Icon icon="gravity-ui:calendar" />
                                    <span className="text-sm text-gray-400 ml-1">
                                        {anime.seasonYear || '?'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {getFormatIcon(anime.format)}
                                    <span className="text-sm text-gray-400 ml-1">
                                        {anime.format}
                                    </span>
                                </div>
                            </div>

                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}

module.exports = AnimeFeed;