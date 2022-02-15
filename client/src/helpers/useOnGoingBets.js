import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export function useOngoingBets() {
  const { user } = useAuth0();
  const [usersOnGoingBets, setUsersOngoingBets] = useState([]);

  useEffect(() => {
    const options = {
      userId: user.sub,
    };
    return axios
      .post("http://localhost:3019/seebets", options) // changed to my backend port
      .then(function (response) {
        console.log("bet-slip passed from the server:", response.data);
        setUsersOngoingBets(response.data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);

  return { usersOnGoingBets };
}
