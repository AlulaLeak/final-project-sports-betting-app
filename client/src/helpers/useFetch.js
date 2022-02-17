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
        "x-rapidapi-host": "sportspage-feeds.p.rapidapi.com",
        "x-rapidapi-key": "a4bfa14385msh95345752cc73d7fp1359f2jsn167a97dbba62"
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
