import { useState } from "react";
import { useVisualMode } from "./useVisualMode";

export function useBetSlip(initial) {
  const SELECTABLE = "SELECTABLE";
  const BET_PLACED = "BET_PLACED";
  const [betSlipArray, setBetSlipArray] = useState(initial);
  const [amountWagered, setAmountWagered] = useState(0);
  const [singleBet, setSingleBet] = useState({});
  const { transition } = useVisualMode(SELECTABLE);

  const addToBetSlipArray = (betToAdd) => {
    let oldBets = betSlipArray;
    transition(BET_PLACED); // not working no matter where I put it
    setBetSlipArray([betToAdd, ...oldBets]);
  };
  function cancelFromBetSlipArray(betToCancel) {
    let newBetSlipArray = [];
    newBetSlipArray = betSlipArray.filter((bet) => bet.id !== betToCancel.id); // Needs modification (what is bet.id?)
    setBetSlipArray(newBetSlipArray);
  }
  function showBetSlipList() {
    return betSlipArray.length > 0 ? true : false;
  }

  // Seeing potential payout of betSlipArray

  function getPotentialPayout() {
    let odds = 0;
    let allOddsAmerican = [];
    let allOdds = [];
    let currentOdd = 1;

    if (betSlipArray.length === 1) {
      setSingleBet(betSlipArray[0]);
      if (singleBet.odds > 0) {
        odds = singleBet.odds / 100 + 1;
      } else {
        odds = 100 / Math.abs(singleBet.odds) + 1;
      }
      return parseFloat((odds * amountWagered).toFixed(2)) * 0.95;
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
      return parseFloat((currentOdd * amountWagered).toFixed(2)) * 0.9;
    }

    return 0;
  }

  return {
    showBetSlipList,
    addToBetSlipArray,
    cancelFromBetSlipArray,
    betSlipArray,
    getPotentialPayout,
    setAmountWagered,
  };
}
