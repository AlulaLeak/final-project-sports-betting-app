import React from "react";
import BetSlipItem from "./BetSlipItem";
import BetSlipSummary from "./BetSlipSummary";
import "../../styles/BetSlipItem.css";

function BetSlipList(props) {
  const {
    cancelFromBetSlipArray,
    betSlipArray,
    getPotentialPayout,
    setAmountWagered,
    placeBet,
    cancelAllFromBetSlipArray
  } = props;

  return (
    <>
      {!betSlipArray[0] && (
        <>
          <div>Single Bet</div>
          <div className="betslip-item-box-center">0 items in BetSlip</div>
        </>
      )}
      {betSlipArray[0] &&
        betSlipArray.map((bet, idx) => {
          return (
            <BetSlipItem
              key={idx}
              cancelFromBetSlipArray={cancelFromBetSlipArray}
              bet={bet}
            />
          );
        })}
      {betSlipArray[0] && (
        <BetSlipSummary
          getPotentialPayout={getPotentialPayout}
          setAmountWagered={setAmountWagered}
          betSlipArray={betSlipArray}
          placeBet={placeBet}
          cancelAllFromBetSlipArray={cancelAllFromBetSlipArray}
        />
      )}
    </>
  );
}

export default BetSlipList;
