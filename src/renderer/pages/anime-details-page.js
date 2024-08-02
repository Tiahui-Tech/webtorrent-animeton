const React = require('react')

const { Card, CardBody, Image } = require('@nextui-org/react')

// WIP: TEMP DATA
const anime = {
    "id": 138,
    "idAnil": 120377,
    "idMal": 42310,
    "title": {
        "romaji": "Cyberpunk: Edgerunners",
        "english": "Cyberpunk: Edgerunners",
        "native": "サイバーパンク エッジランナーズ"
    },
    "description": "¡Prepárate para sumergirte en el fascinante y peligroso mundo de Night City! \"Cyberpunk: Edgerunners\" es una serie original de anime ambientada en el universo de Cyberpunk 2077 que te dejará sin aliento.\n\nEn esta intensa historia de 10 episodios, seguimos a un chico de la calle que lucha por sobrevivir en una ciudad futurista obsesionada con la tecnología y las modificaciones corporales. Con todo en juego y nada que perder, nuestro protagonista toma una decisión que cambiará su vida para siempre: convertirse en un \"edgerunner\", un mercenario fuera de la ley conocido en las calles como cyberpunk.\n\nPrepárate para una montaña rusa de emociones, acción desenfrenada y dilemas morales en un mundo donde la línea entre lo humano y lo artificial se desdibuja cada vez más. ¿Podrá nuestro héroe mantener su humanidad en una ciudad que parece querer arrancársela? \n\n\"Cyberpunk: Edgerunners\" promete ser un festín visual y narrativo que te mantendrá pegado a la pantalla, con personajes complejos, una trama adictiva y un estilo único que fusiona lo mejor del anime con la estética cyberpunk. ¡No te pierdas esta joya que hará cortocircuito en tu cerebro!",
    "season": "SUMMER",
    "seasonYear": 2022,
    "format": "ONA",
    "status": "FINISHED",
    "episodes": 10,
    "duration": 24,
    "genres": ["Action", "Drama", "Psychological", "Sci-Fi"],
    "coverImage": {
        "extraLarge": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120377-GdoVPT4ZVxJn.jpg",
        "medium": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx120377-GdoVPT4ZVxJn.jpg",
        "color": "#6bf143"
    },
    "bannerImage": "https://s4.anilist.co/file/anilistcdn/media/anime/banner/120377-c15oLS8CA31s.jpg",
    "synonyms": ["Cyberpunk: Mercenários", "電馭叛客：邊緣行者", "CYBERPUNK: อาชญากรแดนเถื่อน"],
    "nextAiringEpisode": null,
    "startDate": {
        "year": 2022,
        "month": 9,
        "day": 13
    },
    "trailer": {
        "id": "ax5YUmkWf_Y",
        "site": "youtube"
    }
}

const AnimeDetails = ({ state }) => {
    return (
        <div className="justify-center items-center">
            <Card>
                <CardBody className='flex flex-row'>
                    <div className='flex flex-col justify-center items-center'>
                        <Image alt='anime-cover-image' src={anime.coverImage.extraLarge} className='max-h-96' />
                        <p className='text-base font-medium truncate'>
                            {anime.title.romaji}
                        </p>
                        <span className="text-sm text-gray-400 ml-1">
                            {anime.title.native}
                        </span>
                    </div>
                    <div className='flex flex-col p-8 max-w-[50vw] whitespace-pre-wrap'>
                        <p>{anime.description}</p>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

module.exports = AnimeDetails;