import Modal from "../components/Modal.jsx";
import Player from "../components/Player";
import PositionList from "../components/PositionList.jsx";
import { useState } from "react";

//MakeTeam takes first 30 highest points and forms a arr of obj {[1/2/3/4 (representing gp, df, md, fw)] : player} which PositionList uses to display the players in a certain order
export default function MakeTeam({
  allPlayers,
  allPlayersSorted,
  playerPositions,
  playerTeam,
}) {
  const maxList = 30;

  //let's us know what player was clicked on in the list: [list of list like [player position, player id]]
  const [listFocus, setListFocus] = useState(undefined);
  //[list of lists like [obj property, index in array]](for removal when player is clicked on pitchview)
  const [playerFocus, setPlayerFocus] = useState(undefined);
  const [input, setInput] = useState("");
  const [points, setPoints] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [reRun, setReRun] = useState(crypto.randomUUID());

  const [myTeam, setMyTeam] = useState({
    Goalkeepers: [...new Array(2)],
    Defenders: [...new Array(5)],
    Midfielders: [...new Array(5)],
    Forwards: [...new Array(3)],
  });
  const [teamCount, setTeamCount] = useState({
    Goalkeepers: { Count: 0, MaxCount: 2 },
    Defenders: { Count: 0, MaxCount: 5 },
    Midfielders: { Count: 0, MaxCount: 5 },
    Forwards: { Count: 0, MaxCount: 3 },
    TotalCost: 0
  });

  //nifty array that stores positions in the order they are displayed. creation of list uses this indexing to sort the makeTeamList array.
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

  //For below to work it needs to be done on each page and on each #maxList objs
  let allPlayersList = [];

  //sorting all pllayers based on points and position
  let ppList = [];
  for (let i = 0; i + maxList < allPlayersSorted.length; i += maxList) {
    ppList = allPlayersSorted.slice(i, i + maxList);
    ppList = ppList.map((p) => {
      return [positions.findIndex((el) => el == p.position), p];
    });
    ppList.sort((a, b) => a[0] - b[0]);
    allPlayersList = allPlayersList.concat(ppList);
  }
  const [listInfo, setListInfo] = useState({
    Title: "All Players",
    List: allPlayersList,
  });

  const editMT = {
    Add: ([pos, id]) => {
      // console.log(cost)
      const tempTeam = { ...myTeam };
      const tempTeamCount = { ...teamCount };
      const currCount = tempTeamCount[`${pos}`].Count;
      const maxCount = tempTeamCount[`${pos}`].MaxCount;
      const found = tempTeam[`${pos}`].includes(id);
      if (currCount < maxCount && !found) {
        
        for(let i = 0; i < tempTeamCount[`${pos}`].MaxCount; i++) {
          if(tempTeam[`${pos}`][i]==undefined){
            tempTeam[`${pos}`][i] = id;
            break;
          }
        }
        tempTeamCount[`${pos}`].Count += 1;
        console.log(allPlayers[id].price)
        tempTeamCount.TotalCost += parseFloat(allPlayers[id].price);
        setMyTeam(tempTeam);
        setTeamCount(tempTeamCount);
      }
    },
    Remove: ([pos, index]) => {
      const tempTeam = { ...myTeam };
      const tempTeamCount = { ...teamCount };
      let playerCost = allPlayers[tempTeam[`${pos}`][index]].price
      tempTeam[`${pos}`][index] = undefined;
      tempTeamCount[`${pos}`].Count-=1;
      tempTeamCount.TotalCost -= playerCost;

      setMyTeam(tempTeam);
      setTeamCount(tempTeamCount);
    },
  };
  //handling of modal opening/closing/overlay.
  const [isOpen, setIsOpen] = useState(false);
  const successModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "visible";
    editMT.Add(listFocus);
  };

  const handlePlayerClick = (pl) => {
    setPlayerFocus(pl);
    if (!myTeam[`${pl[0]}`][pl[1]]) {
      setShowAll(false);
      setReRun(crypto.randomUUID());
      setListInfo({
        Title: pl[0],
        List: playerPositions[`${pl[0]}`],
      });
    }
  };
  const handleSelect = (e) => {
    setReRun(crypto.randomUUID());
    const val = e.target.value;
    if (val != "all") {
      setShowAll(false);
    } else {
      setShowAll(true);
      setListInfo({
        Title: "All Players",
        List: allPlayersList,
      });
    }
    if (Object.keys(playerPositions).includes(val)) {
      setListInfo({
        Title: val,
        List: playerPositions[`${val}`],
      });
    } else if (Object.keys(playerTeam).includes(val)) {
      setListInfo({
        Title: val,
        List: playerTeam[`${val}`],
      });
    }
  };
  const handleInput = (e) => {
    const list =
      listInfo.Title == "All Players"
        ? allPlayersList
        : Object.keys(playerPositions).includes(listInfo.Title)
        ? playerPositions[`${listInfo.Title}`]
        : playerTeam[`${listInfo.Title}`];

    const res = list.filter((item) => {
      if (listInfo.Title == "All Players") {
        setShowAll(true);
        return item[1].web_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      } else {
        setShowAll(false);
        return item.web_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      }
    });
    setReRun(crypto.randomUUID());
    setListInfo({
      Title: listInfo.Title,
      List: res,
    });
  };


  return (
    <div className="make-team">
      
      <div id="make-team-group">
        <div id="pitch-group">
        <h1 style={{color: "white", display: "inline-block"}}>
        {teamCount.Goalkeepers.Count +
          teamCount.Defenders.Count +
          teamCount.Midfielders.Count +
          teamCount.Forwards.Count}
        /15
      </h1>
      <h1>
        {teamCount.TotalCost}
        /100
      </h1>
        <div className="pitch-display">
          {myTeam
            ? Object.keys(myTeam).map((pos) => {
              
                return (
                  <div id={pos} key={crypto.randomUUID()}>
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
                            editMT.Remove([pos,index]);
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })
            : null}
        </div>
        </div>
        {/* Grubby Fix ? */}
        <div>
          <select
            name=""
            id=""
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
          <br />
          <input
            type="search"
            name=""
            id=""
            onChange={(e) => {
              handleInput(e);
            }}
            placeholder="Search for Player"
          />
          <PositionList
            playerList={listInfo.List}
            title={listInfo.Title}
            maxList={maxList}
            onModalOpen={(pl) => {
              setIsOpen(true);
              setListFocus(pl);
              document.body.style.overflow = "hidden";
            }}
            setSearch={setInput}
            showAll={showAll}
            key={reRun}
          />
        </div>
      </div>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setPlayerFocus(undefined);
          document.body.style.overflow = "visible";
        }}
        successModal={successModal}
      />
    </div>
  );
}
