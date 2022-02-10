import React from "react";
import HomeGreeting from "../components/HomeGreeting";
import LeagueSelector from "../components/LeagueSelector";
import GameList from "../components/GameList";
// import MockGameList from "../components/MockGameList";
import ViewSelector from "../components/ViewSelector";
import BetSlipList from "../components/BetSlipList";
import { useState } from "react";
import { usePageMode } from "../../helpers/usePageMode";
import { useBetSlip } from "../../helpers/useBetSlip";
import "./Home.css";

function Home() {
  const {
    addToBetSlipArray,
    cancelFromBetSlipArray,
    betSlipArray,
    showBetSlipList,
  } = useBetSlip([]);

  const { pageMode, transitionPage } = usePageMode("GAMES");
  const [leagueName, setLeagueName] = useState("");

  return (
    <div className="home-greeting-event-separator">
      <HomeGreeting />
      <BetSlipList
        cancelFromBetSlip={cancelFromBetSlipArray}
        betSlipArray={betSlipArray}
        addToBetSlipArray={addToBetSlipArray}
        showBetSlipList={showBetSlipList}
      />
      <ViewSelector
        setLeagueName={setLeagueName}
        transitionPage={transitionPage}
      />
      {pageMode === "PROFILE" && <div>hi</div>}
      {pageMode === "GAMES" && (
        <>
          <LeagueSelector setLeagueName={setLeagueName} />
          <GameList
            leagueName={leagueName}
            addToBetSlipArray={addToBetSlipArray}
          />
          {/* <MockGameList addToBetSlipArray={addToBetSlipArray} /> */}
        </>
      )}
    </div>
  );
}

export default Home;
