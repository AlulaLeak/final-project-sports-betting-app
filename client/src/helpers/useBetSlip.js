import { useState } from "react";
import { useVisualMode } from "./useVisualMode";

export function useBetSlip(initial) {
  const SELECTABLE = "SELECTABLE";
  const BET_PLACED = "BET_PLACED";
  const [betSlipArray, setBetSlipArray] = useState(initial);
  const { transition } = useVisualMode(SELECTABLE);

  const addToBetSlipArray = (betToAdd) => {
    let oldBets = betSlipArray;
    transition(BET_PLACED); // not working no matter where I put it
    setBetSlipArray([betToAdd, ...oldBets]);
  };

  function cancelFromBetSlipArray(betToCancel) {
    let newBetSlipArray = [];
    newBetSlipArray = betSlipArray.filter((bet) => bet.id !== betToCancel.id);
    setBetSlipArray(newBetSlipArray);
  }

  function showBetSlipList() {
    return betSlipArray.length > 0 ? true : false;
  }

  return {
    showBetSlipList,
    addToBetSlipArray,
    cancelFromBetSlipArray,
    betSlipArray,
  };
}
