//Notes:
//sometimes no player from a position is present resulting in just a header.
import { useState, useEffect } from "react";
import PlayerCheckbox from "./PlayerCheckbox";
export default function PositionList({
  playerList,
  title,
  maxList,
  onModalOpen,
  setSearch,
  showAll,
}) {
  // This is the highest index on the list of the last rendered list (highest page count)
  const [resultNumber, setResultNumber] = useState(maxList);
  //current page number
  const [pageNumber, setPageNumber] = useState(1);

  const [allList, setAllList] = useState({});
  const [list, setList] = useState([]);
  const resultMax = Math.ceil(playerList.length / maxList);
  const setResults = (start, end) => {
    if (showAll) {
      let tempGk, tempDf, tempMf, tempFw;
      tempGk = tempDf = tempMf = tempFw = [];

      playerList.slice(start, end).forEach((i) => {
        if (i[0] == 0) {
          tempGk = [...tempGk, i[1]];
        } else if (i[0] == 1) {
          tempDf = [...tempDf, i[1]];
        } else if (i[0] == 2) {
          tempMf = [...tempMf, i[1]];
        } else if (i[0] == 3) {
          tempFw = [...tempFw, i[1]];
        }
      });
      setAllList({
        Goalkeepers: tempGk,
        Defenders: tempDf,
        Midfielders: tempMf,
        Forwards: tempFw,
      });
    } else {
      setList(playerList.slice(start, end));
    }
  };
  useEffect(() => {
    setResults(0, maxList);
  }, []);

  const handlePrev = () => {
    if (pageNumber > 1) {
      setResultNumber((resultNumber) => resultNumber - maxList);
      setPageNumber(pageNumber - 1);
      setResults(resultNumber - maxList * 2, resultNumber - maxList);
    } else {
      console.log("poop object (prev)");
    }
  };
  const handleNext = () => {
    if (pageNumber < resultMax) {
      setPageNumber(pageNumber + 1);
      setResultNumber((resultNumber) => resultNumber + maxList);
      setResults(resultNumber, resultNumber + maxList);
    } else {
      console.log("poop (next)");
    }
  };
  return (
    <div id="player-list">
      <h2>{title}</h2>
      <br />
      <div>
        {showAll
          ? Object.keys(allList).map((pos) => {
              return (
                <div key={crypto.randomUUID()}>
                  <h3 className="position-header">{pos}</h3>
                  {allList[`${pos}`].map((item, indx) => {
                    return (
                      
                      <PlayerCheckbox
                      key={crypto.randomUUID()}
                      id={"pchbx" + indx}
                      onClick={() => {
                        onModalOpen([`${item.position}s`, item.id], "pchbx" + indx);
                      }}
                      text={`${item.web_name} £${item.price}`}
                    />
                    );
                  })}
                  <br />
                </div>
              );
            })
          : list.map((item, indx) => {
              return (
                // <button
                //   //Send back the position and the id of the player to add to makeTeam
                //   onClick={() => {
                //     onModalOpen([`${item.position}s`, item.id]);
                //   }}
                //   key={}
                //
                // >{`${item.web_name} ${item.points} ${item.price}`}</button>
                <PlayerCheckbox
                  key={crypto.randomUUID()}
                  id={"pchbx" + indx}
                  onClick={() => {
                    onModalOpen([`${item.position}s`, item.id], "pchbx" + indx);
                  }}
                  text={`${item.web_name} ${item.points} ${item.price}`}
                />
              );
            })}
      </div>

      <div>
        <br />
        <br />
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handleNext}>Next</button>
        <p>Page {pageNumber}</p>
      </div>
    </div>
  );
}
