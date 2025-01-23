import React from "react";

function PlayerCheckbox({onClick, text, id}) {
  return <div  className="player-checkbox">
    <input type="checkbox" id={id} onClick={onClick}/>
    <label htmlFor={id}>{text}</label>
  </div>;
}

export default PlayerCheckbox;
