import React from "react";

function EachSingleOnGoingBetItem(props) {
  const { singleBet } = props;
  console.log(singleBet);
  return <h1>SingleOnGoingBetItem id:{singleBet.id}</h1>;
}

export default EachSingleOnGoingBetItem;
