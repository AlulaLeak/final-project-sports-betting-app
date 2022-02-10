import React from "react";
import "../../styles/BetSlipItem.css";

function BetSlipItem(props) {
  const { cancelFromBetSlipArray } = props;
  return (
    <div>
      <div className="betslip-item-box-space-between">
        <div className="cancel-and-bet-info">
          <button
            onClick={(e) => e.preventDefault()}
            className="betslip-cancel-button"
          >
            cancel
          </button>
          <div className="team-bet-game">
            <div>TOR Raptors</div>
            <div>MONEYLINE</div>
            <div>Toronto @ Miami</div>
          </div>
        </div>
        <div className="odds-on-slip">-120</div>
      </div>
    </div>
  );
}

export default BetSlipItem;
