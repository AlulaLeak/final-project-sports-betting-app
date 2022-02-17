import { useEffect, useState } from "react";
import axios from "axios";

export function useFetch(league) {
  const leagueName = league;
  const [games, setGames] = useState("");

  useEffect(() => {
    let options = {
      method: "GET",
      url: `https://sportspage-feeds.p.rapidapi.com/games${
        leagueName ? leagueName : "?league=NHL"
      }`,
      headers: {
        "x-rapidapi-host": process.env.REACT_APP_X_RAPIDAPI_HOST,
        "x-rapidapi-key": process.env.REACT_APP_X_RAPIDAPI_KEY
      },
    };
    return axios
      .request(options)
      .then(function (response) {
        response.data.results && setGames(response.data.results);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [leagueName]);

  return { games };
}
