import PlayerCard from "../components/PlayerCard"

export default function DreamTeam({dreamTeam}) {
    // console.log(dreamTeam)

    return (
        <div id="dream-team">
            <div id="dreamteam-inner">
                {
                    dreamTeam.map( (player, i) => {
                        return <PlayerCard player={player} key={i}/>
                    })
                }
            </div>
        </div>
    )
}