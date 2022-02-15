import React from "react";
import Game from "./Game";
import { returnMockData } from "../../helpers/mockData";

function MockGameList(props) {
  const mockdata = returnMockData();
  const { addToBetSlipArray } = props;

  return (
    <>
      <div>
        {mockdata.map((game, idx) => {
          <Game key={idx} addToBetSlipArray={addToBetSlipArray} {...game} />;
        })}
      </div>
    </>
  );
}

export default MockGameList;
