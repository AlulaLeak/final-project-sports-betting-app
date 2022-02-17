import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export function useUserInfo() {
  const { user } = useAuth0();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const options = {
      userId: user.sub,
    };
    return axios
      .post("http://localhost:3019/balance", options) // changed to my backend port
      .then(function (response) {
        console.log("user balance passed from the server:", response.data);
        setBalance(response.data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);

  return { balance };
}
