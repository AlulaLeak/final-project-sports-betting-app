import React from "react";
import ErrorModal from "./ErrorModal";
import { useState } from "react";

function Selectable(props) {
  const BET_PLACED = "BET_PLACED";
  const [modalShow, setModalShow] = useState(false);

  const {
    awayScore,
    homeScore,
    teamsPlaying,
    currentPeriods,
    periodTimeRemaining,
    awayMoneylineOdds,
    homeMoneylineOdds,
    awaySpread,
    homeSpread,
    awaySpreadOdds,
    homeSpreadOdds,
    overOdds,
    underOdds,
    pointsForTotalOdds,
    league,
    transition,
    homeTeam,
    awayTeam,
    addToBetSlipArray,
    betSlipArray,
    gameId,
  } = props;

  const awayMl = {
    odds: awayMoneylineOdds,
    betOn: "AWAY",
    teamsPlaying: teamsPlaying,
    typeOfBet: "moneyline",
    gameId: gameId,
  };
  const homeMl = {
    odds: homeMoneylineOdds,
    betOn: "HOME",
    teamsPlaying: teamsPlaying,
    typeOfBet: "moneyline",
    gameId: gameId,
  };
  const awaySp = {
    odds: awaySpreadOdds,
    spread: awaySpread,
    betOn: "AWAY",
    teamsPlaying: teamsPlaying,
    typeOfBet: "spread",
    gameId: gameId,
  };
  const homeSp = {
    odds: homeSpreadOdds,
    spread: homeSpread,
    betOn: "HOME",
    teamsPlaying: teamsPlaying,
    typeOfBet: "spread",
    gameId: gameId,
  };
  const totalOver = {
    odds: overOdds,
    betOn: "OVER",
    total: pointsForTotalOdds,
    teamsPlaying: teamsPlaying,
    typeOfBet: "total",
    gameId: gameId,
  };
  const totalUnder = {
    odds: underOdds,
    total: pointsForTotalOdds,
    betOn: "UNDER",
    teamsPlaying: teamsPlaying,
    typeOfBet: "total",
    gameId: gameId,
  };

  function confirmBet(betToAdd) {

    let exists = false;
    betSlipArray.map((bet) => {
      if (bet.gameId === betToAdd.gameId) {
        exists = true;
        setModalShow(true);
      }
    });
    !exists && addToBetSlipArray(betToAdd);
  }

  return (
    <div className="fixture-card">
      <div>{league}</div>
      <div className="teams-and-scores">
        <div>{awayScore}</div>
        <br />
        <div>{teamsPlaying}</div>
        <br />
        <div>{homeScore}</div>
      </div>
      <div>period: {currentPeriods}</div>
      <div>time remaining: {periodTimeRemaining}</div>
      <div className="fixture-odds">
        <div className="odds">
          <button
            type="submit"
            onClick={() => confirmBet(awayMl)}
            value={awayMl}
          >
            {awayMoneylineOdds}
          </button>
          <div>moneyline</div>
          <button
            type="submit"
            onClick={() => confirmBet(homeMl)}
            value={homeMl}
          >
            {homeMoneylineOdds}
          </button>
        </div>
        <div className="odds">
          <button
            type="submit"
            onClick={() => confirmBet(awaySp)}
            value={awaySp}
            className="total-and-spread-alignment"
          >
            <div>{awaySpread}</div>
            <div>{awaySpreadOdds}</div>
          </button>
          <div className="total-and-spread-points">spread</div>
          <button
            type="submit"
            onClick={() => confirmBet(homeSp)}
            value={homeSp}
            className="total-and-spread-alignment"
          >
            <div>{homeSpread}</div>
            <div>{homeSpreadOdds}</div>
          </button>
        </div>
        <div className="odds">
          <button
            type="submit"
            onClick={() => confirmBet(totalOver)}
            value={totalOver}
            className="total-and-spread-alignment"
          >
            <div>O</div>
            <div>{overOdds}</div>
          </button>
          <div className="total-and-spread-points">
            total {pointsForTotalOdds} points
          </div>
          <button
            type="submit"
            onClick={() => confirmBet(totalUnder)}
            value={totalUnder}
            className="total-and-spread-alignment"
          >
            <div>U</div>
            <div>{underOdds}</div>
          </button>
        </div>
      </div>
      <ErrorModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default Selectable;