import React from "react";
import OnGoingBetItem from "./OnGoingBetItem";
import { useOngoingBets } from "../../helpers/useOnGoingBets";

function OnGoingBetList() {
  const { usersOnGoingBets } = useOngoingBets();

  return (
    <>
      {usersOnGoingBets &&
        usersOnGoingBets.map((onGoingBetSlip, idx) => {
          return <OnGoingBetItem key={idx} onGoingBetSlip={onGoingBetSlip} />;
        })}
    </>
  );
}

export default OnGoingBetList;
