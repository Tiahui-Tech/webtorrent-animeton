const React = require('react')
const useAnimeData = require("../../hooks/useAnimeData")
const { getFormatIcon } = require("../../../modules/utils")
const { STATUS_LABELS, STATUS_COLORS } = require('../../../constants/anime');

const { Card, CardHeader, CardBody, Image, Skeleton, Chip } = require('@nextui-org/react')
const { Icon } = require('@iconify/react');

const AnimeFeed = ({ state }) => {
    const animes = useAnimeData()

    return (
        <div className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Trending anime</h2>
            <div className="grid grid-cols-6 auto-rows-max gap-8 justify-center items-center">
                {!animes && Array.from({ length: 6 }).map((_, index) => (
                    <AnimeCardSkeleton key={`skeleton-${index}`} />
                ))}
                {animes && animes.map((anime, i) => (
                    <AnimeCard key={`anime-${anime.id}-${i}`} anime={anime} state={state} />
                ))}
            </div>
        </div>
    )
}

const AnimeCard = React.memo(({ anime, state }) => {
    return (
        <Card
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
    )
})

const AnimeCardSkeleton = () => {
    return (
        <Card className="w-64">
            <CardBody className="p-0 relative">
                <Skeleton className="w-full rounded-t-lg">
                    <div className="aspect-[9/14] rounded-t-lg bg-default-300"></div>
                </Skeleton>
                <Skeleton className="absolute top-2 right-2 rounded-full">
                    <div className="h-6 w-20 rounded-full bg-default-200"></div>
                </Skeleton>
            </CardBody>
            <CardHeader className="flex flex-col items-start p-3">
                <Skeleton className="w-3/4 rounded-lg">
                    <div className="h-5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <div className="flex justify-between items-center w-full mt-2">
                    <Skeleton className="w-1/3 rounded-lg">
                        <div className="h-4 rounded-lg bg-default-100"></div>
                    </Skeleton>
                    <Skeleton className="w-1/3 rounded-lg">
                        <div className="h-4 rounded-lg bg-default-100"></div>
                    </Skeleton>
                </div>
            </CardHeader>
        </Card>
    );
};

module.exports = AnimeFeed;