import React from "react";
import EachSingleOnGoingBetItem from "./EachSingleOnGoingBetItem";

function OnGoingBetItem(props) {
  const { onGoingBetSlip } = props;

  return (
    <>

      {onGoingBetSlip &&
        onGoingBetSlip.map((singleBet, idx) => {
          return <EachSingleOnGoingBetItem key={idx} singleBet={singleBet} />;
        })}
    
    </>
  );
}

export default OnGoingBetItem;
