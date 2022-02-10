import React from "react";
import Game from "./Game";
import { useFetch } from "../../helpers/useFetch";
const GameList = (props) => {
  const { leagueName, addToBetSlipArray } = props;
  const { games } = useFetch(leagueName);

  return (
    <>
      <div>
        {games[0] ? (
          games.map((game, idx) => {
            return game ? (
              <Game
                key={game.gameId}
                addToBetSlipArray={addToBetSlipArray}
                {...game}
              />
            ) : (
              <div key={idx}></div>
            );
          })
        ) : (
          <>no games available yet!</>
        )}
      </div>
    </>
  );
};

export default GameList;
