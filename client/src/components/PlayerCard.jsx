import { useState } from "react"

export default function PlayerCard({player}) {
    return (
        <div id="player-card">
            <img src={player.photo} style={{width:"90%", height: "65%"}}/>
            <div>
                <p>{`${player.web_name}`}</p>
                <p>{`Price: ${player.price}`}</p>
                <p>{`Points: ${player.points}`}</p>
            </div>
        </div>
    )
}