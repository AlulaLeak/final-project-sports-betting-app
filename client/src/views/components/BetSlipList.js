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
    cancelAllFromBetSlipArray,
    balance,
    amountWagered,
    setNewBalanceAfterCheckout,
  } = props;

  return (
    <>
      <div className="balance">Balance: $ {balance && balance}</div>

      {!betSlipArray[0] && (
        <>
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
          amountWagered={amountWagered}
          setNewBalanceAfterCheckout={setNewBalanceAfterCheckout}
          balance={balance}
        />
      )}
    </>
  );
}

export default BetSlipList;
