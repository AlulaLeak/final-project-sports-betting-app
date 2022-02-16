import React from "react";

function EachSingleOnGoingBetItem(props) {
  const { singleBet } = props;
  console.log(singleBet);
  return (
    <>
      <div>
        {singleBet.total && singleBet.teams_playing}
        {singleBet.total && `  |  TOTAL: `}
        {singleBet.total && singleBet.total}
        {singleBet.total && ` |  `}
        {singleBet.total && singleBet.odds}
        {singleBet.bet_on_under && `  |  UNDER`}
        {singleBet.bet_on_over && `  |  OVER`}

        {singleBet.spread && singleBet.teams_playing}
        {singleBet.spread && `  |  SPREAD: `}
        {singleBet.spread && singleBet.spread}
        {singleBet.spread && ` |  `}
        {singleBet.spread && singleBet.odds}

        {!singleBet.spread && !singleBet.total && singleBet.teams_playing}
        {!singleBet.spread && !singleBet.total && `  |  MONEYLINE: `}
        {!singleBet.spread && !singleBet.total && singleBet.total}
        {!singleBet.spread && !singleBet.total && ` |  `}
        {!singleBet.spread && !singleBet.total && singleBet.odds}
        {!singleBet.total && singleBet.bet_on_away && `  |  AWAY`}
        {!singleBet.total && singleBet.bet_on_home && `  |  HOME`}
      </div>
    </>
  );
}

export default EachSingleOnGoingBetItem;
