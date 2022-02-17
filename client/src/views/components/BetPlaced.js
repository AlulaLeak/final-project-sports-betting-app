import React from "react";

function BetPlaced(props) {
  const {
    awayScore,
    homeScore,
    teamsPlaying,
    currentPeriods,
    periodTimeRemaining,
    league,
  } = props;
  return (
    <div className="fixture-card">
      <div>ADDED TO BET SLIP</div>
      <div>{league}</div>
      <div className="teams-and-scores">
        <div className="live-score">{awayScore}</div>
        <br />
        <div>{teamsPlaying}</div>
        <br />
        <div className="live-score">{homeScore}</div>
      </div>
      <div>period: {currentPeriods}</div>
      <div>time remaining: {periodTimeRemaining}</div>
    </div>
  );
}

export default BetPlaced;
