import React from "react";
import "../../styles/BetSlipSummary.css";
import { useAuth0 } from "@auth0/auth0-react";

function BetSlipSummary(props) {
  const { betSlipArray, setAmountWagered, getPotentialPayout, placeBet } =
    props;
  const { user } = useAuth0();
  return (
    <>
      <div className="main-betslip-summary-box">
        {betSlipArray && <div className="bet-type-summary-title">Parlay</div>}
        {betSlipArray && (
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
            // console.log("betSlipparray and user", betSlipArray, user);
            placeBet();
          }}
        >
          Place Bet
        </button>
      </div>
    </>
  );
}

export default BetSlipSummary;

// {betSlipArray.length === 1 && <div>single</div>}
