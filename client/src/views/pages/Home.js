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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OnGoingBetList from "../components/OnGoingBetList";
import ModalMessage from "../components/ModalMessage";
import { useUserInfo } from "../../helpers/useUserInfo";
import { useRef } from "react";

function Home() {
  const {
    addToBetSlipArray,
    cancelFromBetSlipArray,
    betSlipArray,
    showBetSlipList,
    getPotentialPayout,
    setAmountWagered,
    placeBet,
    getOnGoingBets,
    cancelAllFromBetSlipArray,
    modalShow,
    setModalShow,
    amountWagered,
  } = useBetSlip([]);
  const { balance, setNewBalanceAfterCheckout } = useUserInfo();
  const { pageMode, transitionPage } = usePageMode("GAMES");
  const [leagueName, setLeagueName] = useState("");

  const navbarRef = useRef(null)

  const executeScroll = () => navbarRef.current.scrollIntoView()   

  return (
    <div className="home-greeting-event-separator">
      <Navbar
      navbarRef={navbarRef}
      setLeagueName={setLeagueName}
      transitionPage={transitionPage} />
      <HomeGreeting />
      <BetSlipList
        cancelAllFromBetSlipArray={cancelAllFromBetSlipArray}
        cancelFromBetSlipArray={cancelFromBetSlipArray}
        betSlipArray={betSlipArray}
        addToBetSlipArray={addToBetSlipArray}
        showBetSlipList={showBetSlipList}
        getPotentialPayout={getPotentialPayout}
        setAmountWagered={setAmountWagered}
        placeBet={placeBet}
        balance={balance}
        amountWagered={amountWagered}
        setNewBalanceAfterCheckout={setNewBalanceAfterCheckout}
      />
    
      {pageMode === "PROFILE" && (
        <OnGoingBetList getOnGoingBets={getOnGoingBets} />
      )}
      {pageMode === "GAMES" && (
        <>
          <LeagueSelector setLeagueName={setLeagueName} />
          <GameList
            leagueName={leagueName}
            addToBetSlipArray={addToBetSlipArray}
            betSlipArray={betSlipArray}
          />
          {/* <MockGameList addToBetSlipArray={addToBetSlipArray} /> */}
        </>
      )}
      <Footer
      executeScroll={executeScroll} 
      />
      <ModalMessage
        show={modalShow}
        onHide={() => setModalShow(false)}
        type="alert"
        header="Alert"
        message1="Your bet has been placed!"
      />
    </div>
  );
}

export default Home;
