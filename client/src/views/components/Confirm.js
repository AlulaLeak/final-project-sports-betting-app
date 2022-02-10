import React from "react";
import "../../styles/game.css";

function Confirm(props) {
  const BET_PLACED = "BET_PLACED";

  const { transition, back } = props;

  function placeBet() {
    transition(BET_PLACED);
  }
  function goBack() {
    back();
  }

  return (
    <div className="fixture-card">
      <div>Add To Bet Slip?</div>
      <button onClick={() => placeBet()}>Confirm</button>
      <button onClick={() => goBack()}>Back</button>
    </div>
  );
}

export default Confirm;
