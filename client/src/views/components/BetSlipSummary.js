import React from "react";
import "../../styles/BetSlipSummary.css";
import { useAuth0 } from "@auth0/auth0-react";
// import useBetSlip from '../../helpers/useBetSlip'
import { useState } from "react";
import ModalMessage from "./ModalMessage";

function BetSlipSummary(props) {
  const {
    betSlipArray,
    setAmountWagered,
    getPotentialPayout,
    placeBet,
    cancelAllFromBetSlipArray,
    amountWagered,
    setNewBalanceAfterCheckout,
  } = props;

  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className="main-betslip-summary-box">
        {betSlipArray.length > 1 && (
          <div className="bet-type-summary-title">Parlay</div>
        )}
        {betSlipArray.length === 1 && (
          <div className="bet-type-summary-title">Single Bet</div>
        )}
        <div className="total-wager">
          <div>Total Wager</div>
          <div className="dollar-sign-input">
            <p>$</p>
            <input onChange={(e) => setAmountWagered(e.target.value)} />
          </div>
        </div>
        <div className="cashout-title">CASH OUT</div>
        <div className="potential-payout">
          <div>Potential Payout</div>
          <div>{getPotentialPayout()}</div>
        </div>
        <button
          className="place-bet-button"
          onClick={() => {
            setNewBalanceAfterCheckout(amountWagered);
            cancelAllFromBetSlipArray();
          }}
        >
          Place Bet
        </button>
      </div>
    </>
  );
}

export default BetSlipSummary;
