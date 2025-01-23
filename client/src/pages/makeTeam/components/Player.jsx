// import { ReactComponent as CloseIcon} from "../assets/close-icon.svg"
export default function Player({ photo, type, position, name, cost, addPlayer, removePlayer }) {
  let res;
  if (type == "gk-empty") {
    res = "shirt_1.png";
  } else if (type == "empty") {
    res = "shirt_2.png";
  } else {
    res = photo;
  }
  return (
    <div
      className="pl"
      onClick={addPlayer}
    >
      <div
        className="player"
        style={{
          backgroundImage: `url(${res})`,
        }}
      >
        {/* <CloseIcon fillColor="grey"/> */}
        {photo ? (
          <span id="close-icon" onClick={removePlayer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="12px"
              height="12px"
              fill="white"
            >
              <path stroke="white" strokeWidth="5"
              d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
            </svg>
          </span>
        ) : null}
      </div>
      
        {photo ?
        <div id="name-cost-container">
          <p id="player-name">{name}</p>
          <p id="player-cost">{cost}</p>
        </div> 
        :
        <pre id="add-button">Add {"\n"+position}</pre>
        }
        
      
    </div>
  );
}
