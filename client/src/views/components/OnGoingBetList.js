import React from "react";
import OnGoingBetItem from "./OnGoingBetItem";

function OnGoingBetList(props) {
  const { getOnGoingBets } = props;
  return (
    <>
      {/* {getOnGoingBets ? <OnGoingBetItem /> : <h1>Loading</h1>} */}
      <OnGoingBetItem getOnGoingBets={getOnGoingBets} />
    </>
  );
}

export default OnGoingBetList;
