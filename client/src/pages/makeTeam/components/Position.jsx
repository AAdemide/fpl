import React from "react";
import Player from "./Player.jsx";

function Position({pos, myTeam, handlePlayerClick, editMT, allPlayers}) {
  return (
    <div id={pos} >
      {myTeam[`${pos}`].map((player, index) => {
        let type, photo, name, cost;
        if (!player) {
          type = pos == "Goalkeepers" ? "gk-empty" : "empty";
        } else {
          type = undefined;
          photo = allPlayers[`${player}`].photo;
          name = allPlayers[`${player}`].web_name;
          cost = allPlayers[`${player}`].price;
        }
        return (
          // <div className="pl" >
          <Player
            photo={photo}
            type={type}
            position={pos.slice(0, -1)}
            name={name}
            cost={cost}
            key={crypto.randomUUID()}
            addPlayer={() => {
              handlePlayerClick([pos, index]);
            }}
            removePlayer={() => {
              editMT.Remove([pos, index]);
            }}
          />
        );
      })}
    </div>
  );
}

export default Position;
