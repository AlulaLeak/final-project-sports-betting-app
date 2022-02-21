import { useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3021");

export const useFetch = (league = "?league=NHL") => {
  const leagueName = league;
  const [games, setGames] = useState("");

  socket.on("league_games", (allGames) => {
    const {
      fetchedNhlGameInfo,
      fetchedNbaGameInfo,
      fetchedNflGameInfo,
      fetchedMlbGameInfo,
      fetchedAllGameInfo,
    } = allGames;

    leagueName === "?league=NHL" && setGames(fetchedNhlGameInfo);
    leagueName === "?league=NBA" && setGames(fetchedNbaGameInfo);
    leagueName === "?league=NFL" && setGames(fetchedNflGameInfo);
    leagueName === "?league=MLB" && setGames(fetchedMlbGameInfo);
  });

  return { games };
};
