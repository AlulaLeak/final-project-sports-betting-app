import React from "react";
import "../../styles/BetSlipItem.css";

function BetSlipItem(props) {
  const { cancelFromBetSlipArray, bet } = props;
  // console.log(bet);
  return (
    <>
      {bet.typeOfBet === "moneyline" && (
        <div>
          <div className="betslip-item-box-space-between">
            <div className="cancel-and-bet-info">
              <button
                onClick={() => cancelFromBetSlipArray(bet)}
                className="betslip-cancel-button"
              >
                cancel
              </button>
              <div className="team-bet-game">
                <div>{bet.teamsPlaying}</div>
                <div>MONEYLINE</div>
                <div>Bet on: {bet.betOn}</div>
              </div>
            </div>
            <div className="odds-on-slip">{bet.odds}</div>
          </div>
        </div>
      )}
      {bet.typeOfBet === "total" && (
        <div>
          <div className="betslip-item-box-space-between">
            <div className="cancel-and-bet-info">
              <button
                onClick={() => cancelFromBetSlipArray(bet)}
                className="betslip-cancel-button"
              >
                cancel
              </button>
              <div className="team-bet-game">
                <div>{bet.teamsPlaying}</div>
                <div>TOTAL: {bet.total}</div>
                <div>Bet on: {bet.betOn}</div>
              </div>
            </div>
            <div className="odds-on-slip">{bet.odds}</div>
          </div>
        </div>
      )}
      {bet.typeOfBet === "spread" && (
        <div>
          <div className="betslip-item-box-space-between">
            <div className="cancel-and-bet-info">
              <button
                onClick={() => cancelFromBetSlipArray(bet)}
                className="betslip-cancel-button"
              >
                cancel
              </button>
              <div className="team-bet-game">
                <div>{bet.teamsPlaying}</div>
                <div>SPREAD: {bet.spread}</div>
                <div>Bet on: {bet.betOn}</div>
              </div>
            </div>
            <div className="odds-on-slip">{bet.odds}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default BetSlipItem;
