import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3021");

export function useUserInfo() {
  const { user } = useAuth0();
  const [balance, setBalance] = useState("...Loading!");

  setInterval(() => {
    socket.emit("user_info", user);
  }, 3000);

  socket.on("user_balance", (usrBalance) => {
    setBalance(
      usrBalance.balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  });

  function setNewBalanceAfterCheckout(amountWagered) {
    const options = {
      amountWagered,
      userId: user.sub,
    };

    return axios
      .post("http://localhost:3021/balance/after-checkout", options)
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
