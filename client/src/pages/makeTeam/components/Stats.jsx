import React from "react";

function Stats({teamCount}) {
  return (
    <div id="team-stats">
      <h2>
        {" "}
        Player Count:{" "}
        {teamCount.Goalkeepers.Count +
          teamCount.Defenders.Count +
          teamCount.Midfielders.Count +
          teamCount.Forwards.Count}
        /15
      </h2>
      <h2>
        {" "}
        Team Cost: {Math.round(teamCount.TotalCost)}
        /100
      </h2>
    </div>
  );
}

export default Stats;
