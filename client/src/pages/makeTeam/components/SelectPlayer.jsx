import React from 'react'

function SelectPlayer({handleSelect, playerPositions, playerTeam}) {
  return (
    <select
            name="select-position"
            id="select-position"
            defaultValue={"all"}
            onChange={(e) => {
              handleSelect(e);
            }}
          >
            <option disabled>Global</option>
            <option value="all">All Players</option>
            <option disabled>Positions</option>
            {Object.keys(playerPositions).map((position) => {
              return (
                <option value={position} key={crypto.randomUUID()}>
                  {position}
                </option>
              );
            })}
            <option disabled>Teams</option>
            {Object.keys(playerTeam).map((team) => {
              return (
                <option value={team} key={crypto.randomUUID()}>
                  {team}
                </option>
              );
            })}
          </select>
  )
}

export default SelectPlayer