import { useState } from "react";
import { useVisualMode } from "./useVisualMode";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export function useBetSlip(initial) {
  const SELECTABLE = "SELECTABLE";
  const BET_PLACED = "BET_PLACED";
  const [betSlipArray, setBetSlipArray] = useState(initial);
  const [amountWagered, setAmountWagered] = useState(0);
  const [singleBet, setSingleBet] = useState({});
  const [potentialPayout, setPotentialPayout] = useState(0);
  const { transition } = useVisualMode(SELECTABLE);
  const { user } = useAuth0();

  const [modalShow, setModalShow] = useState(false);

  const addToBetSlipArray = (betToAdd) => {
    let oldBets = betSlipArray;
    transition(BET_PLACED); // not working no matter where I put it
    setBetSlipArray([betToAdd, ...oldBets]);
  };
  function cancelFromBetSlipArray(betToCancel) {
    let newBetSlipArray = [];
    newBetSlipArray = betSlipArray.filter(
      (bet) => bet.gameId !== betToCancel.gameId
    );
    // console.log("This is the new betslip array:", newBetSlipArray);
    // Needs modification (what is bet.id?)
    setBetSlipArray(newBetSlipArray);
  }
  function showBetSlipList() {
    return betSlipArray.length > 0 ? true : false;
  }

  function cancelAllFromBetSlipArray() {
    setBetSlipArray([]);
    placeBet();
    setModalShow(true);
  }

  // Seeing potential payout of betSlipArray

  function getPotentialPayout() {
    let odds = 0;
    let allOddsAmerican = [];
    let allOdds = [];
    let currentOdd = 1;

    if (!betSlipArray[0]) {
      setPotentialPayout(0);
    }

    if (betSlipArray.length === 1) {
      setSingleBet(betSlipArray[0]);
      if (singleBet.odds > 0) {
        odds = singleBet.odds / 100 + 1;
      } else {
        odds = 100 / Math.abs(singleBet.odds) + 1;
      }
      let singPotPayout = (parseFloat(odds * amountWagered) * 0.95).toFixed(2);
      if (singPotPayout) {
        setPotentialPayout(singPotPayout);
        return singPotPayout;
      }
      if (!singPotPayout) {
        setPotentialPayout(0);
        return 0;
      }
    } else if (betSlipArray.length > 1) {
      betSlipArray.map((bet) => {
        allOddsAmerican.push(bet.odds);
      });
      allOddsAmerican.map((eachOdd) => {
        if (eachOdd > 0) {
          allOdds.push(eachOdd / 100 + 1);
        } else {
          allOdds.push(100 / Math.abs(eachOdd) + 1);
        }
      });
      allOdds.map((eachnewOdd) => {
        currentOdd = currentOdd * eachnewOdd;
      });
      let potPayout = (parseFloat(currentOdd * amountWagered) * 0.9).toFixed(2);
      if (!potPayout) {
        setPotentialPayout(0);
        return 0;
      }
      if (potPayout) {
        setPotentialPayout(potPayout);
        return potPayout;
      }
    }
    setPotentialPayout(0);
    return 0;
  }

  function placeBet() {
    console.log(
      "betslip passed to server:",
      user.sub,
      betSlipArray,
      amountWagered,
      potentialPayout
    );
    const options = {
      userId: user.sub,
      betSlipArray,
      amountWagered,
      potentialPayout,
    };

    axios
      .post("http://localhost:3019/placebet", options) // changed to my backend port
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  return {
    showBetSlipList,
    addToBetSlipArray,
    cancelFromBetSlipArray,
    betSlipArray,
    getPotentialPayout,
    setAmountWagered,
    placeBet,
    cancelAllFromBetSlipArray,
    setModalShow,
    modalShow,
    amountWagered,
  };
}
