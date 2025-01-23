import "./makeTeam.css";
import { useState } from "react";
import Modal from "./components/Modal.jsx";
import PositionList from "./components/PositionList.jsx";
import SelectPlayer from "./components/SelectPlayer.jsx";
import Position from "./components/Position.jsx";
import Stats from "./components/Stats.jsx";

//MakeTeam takes first 30 highest points and forms a arr of obj {[1/2/3/4 (representing gp, df, md, fw)] : player} which PositionList uses to display the players in a certain order
export default function MakeTeam({
  allPlayers,
  allPlayersSorted,
  playerPositions,
  playerTeam,
}) {
  const maxList = 30;

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
    TotalCost: 0,
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
      console.log(currCount, maxCount, found)
      if (currCount < maxCount && !found) {
        for (let i = 0; i < tempTeamCount[`${pos}`].MaxCount; i++) {
          if (tempTeam[`${pos}`][i] == undefined) {
            tempTeam[`${pos}`][i] = id;
            break;
          }
        }
        tempTeamCount[`${pos}`].Count += 1;
        tempTeamCount.TotalCost += parseFloat(allPlayers[id].price);
        // console.log(typeof tempTeamCount.TotalCost);
      }
      setMyTeam((tempTeam));
      setTeamCount(tempTeamCount);
    },
    Remove: ([pos, index]) => {
      const tempTeam = { ...myTeam };
      const tempTeamCount = { ...teamCount };
      let playerCost = allPlayers[tempTeam[`${pos}`][index]].price;
      tempTeam[`${pos}`][index] = undefined;
      tempTeamCount[`${pos}`].Count -= 1;
      tempTeamCount.TotalCost -= playerCost;

      setMyTeam(tempTeam);
      setTeamCount(tempTeamCount);
    },
  };
  //handling of modal opening/closing/overlay.
  const [isOpen, setIsOpen] = useState(false);
  const [modalFunction, setModalFunction] = useState(undefined);
  const [modalText, setModalText] = useState("");
  const successModal = (pl) => {
    // setIsOpen(false);
    document.body.style.overflow = "visible";
    editMT.Add(pl);
  };
  const removeModal = (pl) => {
    // setIsOpen(false);
    document.body.style.overflow = "visible";
    editMT.Remove(pl);
  };
  const onModalOpen = (pl, checkboxID) => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    let checkBox = document.getElementById(checkboxID);
    if (checkBox.checked == true) {
      setModalFunction(() => {successModal(pl)});
      setModalText("Add This Player?");
    } else {
      setModalFunction(() => {removeModal(pl)});
      setModalText("Remove This Player?");
    }
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
          <Stats teamCount={teamCount} />
          <div className="pitch-display">
            {myTeam
              ? Object.keys(myTeam).map((pos) => {
                  return (
                    <Position
                      key={crypto.randomUUID()}
                      pos={pos}
                      myTeam={myTeam}
                      handlePlayerClick={handlePlayerClick}
                      editMT={editMT}
                      allPlayers={allPlayers}
                    />
                  );
                })
              : null}
          </div>
        </div>
        {/* Grubby Fix ? */}
        <div id="positions-selector">
          <SelectPlayer
            handleSelect={handleSelect}
            playerPositions={playerPositions}
            playerTeam={playerTeam}
          />
          <br />
          <input
            type="search"
            onChange={(e) => {
              handleInput(e);
            }}
            placeholder="Search for a Player"
          />
          <br />
          <PositionList
            playerList={listInfo.List}
            title={listInfo.Title}
            maxList={maxList}
            onModalOpen={onModalOpen}
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
        modalFunction={modalFunction}
        text={modalText}
      />
    </div>
  );
}
