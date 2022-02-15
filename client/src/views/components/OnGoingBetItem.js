import React from "react";

function OnGoingBetItem(props) {
  const { getOnGoingBets } = props;
  return <div>OnGoingBetItem{getOnGoingBets()}</div>;
}

export default OnGoingBetItem;
