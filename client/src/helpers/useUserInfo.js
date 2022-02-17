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
      .post("http://localhost:3019/balance", options)
      .then(function (response) {
        setBalance(response.data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [balance]);

  function setNewBalanceAfterCheckout(amountWagered) {
    const options = {
      amountWagered,
      userId: user.sub,
    };

    return axios
      .post("http://localhost:3019/balance/after-checkout", options)
      .then(function (response) {
        const NewBalanceAfterCheckout = parseInt(response.data);
        setBalance(NewBalanceAfterCheckout);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  return { balance, setNewBalanceAfterCheckout };
}
