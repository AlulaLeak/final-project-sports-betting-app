import { useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3020");

export function useFetch(league = "?league=NHL") {
  const leagueName = league;
  const [games, setGames] = useState("");

  socket.on("working_test_message", (allGames) => {
    // console.log("This is a two day game list: ", allGames);

    const {
      fetchedNhlGameInfo,
      fetchedNbaGameInfo,
      fetchedNflGameInfo,
      fetchedMlbGameInfo,
    } = allGames;

    // console.log("This is tdy and tmo nba games: ", fetchedNbaGameInfo);

    if (leagueName === "?league=NHL") {
      setGames(fetchedNhlGameInfo);
    }
    if (leagueName === "?league=NBA") {
      setGames(fetchedNbaGameInfo);
    }
    if (leagueName === "?league=NFL") {
      setGames(fetchedNflGameInfo);
    }
    if (leagueName === "?league=MLB") {
      setGames(fetchedMlbGameInfo);
    }
  });

  return { games };
}

// let nhlGames =
//   allGames && allGames.filter((game) => game.details.league === "NHL");
// let nbaGames =
//   allGames && allGames.filter((game) => game.details.league === "NBA");
// let nflGames =
//   allGames && allGames.filter((game) => game.details.league === "NFL");
// let mlbGames =
//   allGames && allGames.filter((game) => game.details.league === "MLB");
