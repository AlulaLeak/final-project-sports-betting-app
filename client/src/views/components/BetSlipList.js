import React from "react";
import BetSlipItem from "./BetSlipItem";
import BetSlipSummary from "./BetSlipSummary";
import "../../styles/BetSlipItem.css";

function BetSlipList(props) {
  const { cancelFromBetSlipArray, betSlipArray } = props;
  console.log(betSlipArray);

  return (
    <>
      <div className="bet-slip-title">Bet Slip</div>
      {!betSlipArray[0] && (
        <div className="betslip-item-box-center">
          <div className="center-no-items">0 items in BetSlip.</div>
        </div>
      )}
      {betSlipArray[0] && (
        <BetSlipItem
          cancelFromBetSlipArray={cancelFromBetSlipArray}
          betSlipArray={betSlipArray}
        />
      )}
      {betSlipArray[0] && <BetSlipSummary />}
    </>
  );
}

export default BetSlipList;
