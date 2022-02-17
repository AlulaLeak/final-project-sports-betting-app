import React from "react";
import { useVisualMode } from "../../helpers/useVisualMode";
import getScheduledDate from "../../helpers/getDate";
import Confirm from "./Confirm";
import Selectable from "./Selectable";
import BetPlaced from "./BetPlaced";
import "../../styles/game.css";

function Game(props) {
  const { back, viewMode, transition } = useVisualMode("SELECTABLE");
  const SELECTABLE = "SELECTABLE";
  const CONFIRM = "CONFIRM";
  const BET_PLACED = "BET_PLACED";
  const { addToBetSlipArray, betSlipArray, ...game } = props;
  const {
    details: { league },
    odds,
    schedule: { dateScheduled },
    // teams,
    scoreboard,
    summary,
    status,
    teams,
    gameId,
  } = game;

  const homeTeam = teams.away.team;
  const awayTeam = teams.home.team;
  const awayScore = scoreboard ? scoreboard.score.away : 0;
  const homeScore = scoreboard ? scoreboard.score.home : 0;
  const teamsPlaying = summary && summary;
  const currentPeriods = scoreboard ? scoreboard.currentPeriod : 0;
  const periodTimeRemaining = scoreboard && scoreboard.periodTimeRemaining;
  const awayMoneylineOdds = odds && odds[0].moneyline.current.awayOdds;
  const homeMoneylineOdds = odds && odds[0].moneyline.current.homeOdds;
  const awaySpread = odds && league !== "NHL" ? odds[0].spread.current.away : 0;
  const homeSpread = odds && league !== "NHL" ? odds[0].spread.current.home : 0;
  const awaySpreadOdds =
    odds && league !== "NHL" ? odds[0].spread.current.awayOdds : 0;
  const homeSpreadOdds =
    odds && league !== "NHL" ? odds[0].spread.current.homeOdds : 0;
  const overOdds = odds && odds[0].total.current.overOdds;
  const underOdds = odds && odds[0].total.current.underOdds;
  const pointsForTotalOdds = odds && odds[0].total.current.total;
  const gameScheduledFor = getScheduledDate(dateScheduled);
  const gameEnded = status
    ? "final"
    : "in progress" || "delayed" || "scheduled";

  // getPotentialWinnings(odds, amountWagered) // Already have this! (ty, stackoverflow)
  // betWon(userId, game) // Finds bet in db, compares bet to results, returns true if won (false if not)
  // game info needs

  return (
    <>
      {viewMode === SELECTABLE && (
        <Selectable
          awayScore={awayScore}
          homeScore={homeScore}
          teamsPlaying={teamsPlaying}
          currentPeriods={currentPeriods}
          periodTimeRemaining={periodTimeRemaining}
          awayMoneylineOdds={awayMoneylineOdds}
          homeMoneylineOdds={homeMoneylineOdds}
          awaySpread={awaySpread}
          homeSpread={homeSpread}
          awaySpreadOdds={awaySpreadOdds}
          homeSpreadOdds={homeSpreadOdds}
          overOdds={overOdds}
          underOdds={underOdds}
          pointsForTotalOdds={pointsForTotalOdds}
          league={league}
          transition={transition}
          addToBetSlipArray={addToBetSlipArray}
          betSlipArray={betSlipArray}
          gameId={gameId}
        />
      )}
      {viewMode === CONFIRM && (
        <Confirm
          awayScore={awayScore}
          homeScore={homeScore}
          teamsPlaying={teamsPlaying}
          currentPeriods={currentPeriods}
          periodTimeRemaining={periodTimeRemaining}
          awayMoneylineOdds={awayMoneylineOdds}
          homeMoneylineOdds={homeMoneylineOdds}
          awaySpread={awaySpread}
          homeSpread={homeSpread}
          awaySpreadOdds={awaySpreadOdds}
          homeSpreadOdds={homeSpreadOdds}
          overOdds={overOdds}
          underOdds={underOdds}
          pointsForTotalOdds={pointsForTotalOdds}
          league={league}
          transition={transition}
          addToBetSlipArray={addToBetSlipArray}
          back={back}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      )}
      {viewMode === BET_PLACED && (
        <BetPlaced
          awayScore={awayScore}
          homeScore={homeScore}
          teamsPlaying={teamsPlaying}
          currentPeriods={currentPeriods}
          periodTimeRemaining={periodTimeRemaining}
          league={league}
        />
      )}
    </>
  );
}

export default Game;
