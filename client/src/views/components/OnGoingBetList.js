import React from "react";
import OnGoingBetItem from "./OnGoingBetItem";
import { useOngoingBets } from "../../helpers/useOnGoingBets";
import "../../styles/OnGoingBetList.css";

function OnGoingBetList() {
  const { usersOnGoingBets } = useOngoingBets();

  return (
    <>
      {usersOnGoingBets &&
        usersOnGoingBets.map((onGoingBetSlip, idx) => {
          if (onGoingBetSlip[0]) {
            return (
              <>
              <div className="on-going-bets-card">
  
                <OnGoingBetItem key={idx} onGoingBetSlip={onGoingBetSlip} />

                  <div className="ongoing-bet-bottom">
                    <div className="potential-payout-ongoing">
                      <button className="early-cashout-button">Early Cashout</button>
                    </div>
                    <div>
                      <div className="potential-payout-ongoing">
                        <div>
                          Potential Payout: &nbsp; 
                          </div>
                          <div>

                        {(onGoingBetSlip[0].potential_payout).toFixed(2)}
                          </div>
                      </div>
                      <div className="potential-payout-ongoing">
                        <div>Amount Wagered: &nbsp;  </div>
                        <div>  {(onGoingBetSlip[0].amount_wagered).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
              </div>
              </>
            );
          }

        })}
    </>
  );
}

export default OnGoingBetList;
