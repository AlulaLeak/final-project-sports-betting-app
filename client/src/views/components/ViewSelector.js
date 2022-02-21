import React from "react";
import "../../styles/ViewSelector.css";


function ViewSelector(props) {
  const { transitionPage, setLeagueName } = props;

  // function handleProfileClick(e) {
  //   setLeagueName("");
  //   transitionPage(e.target.value);
  // }

  return (
    <div className="view-select-wrapper">
      <button
        onClick={(e) => transitionPage(e.target.value)}
        value="PROFILE"
        className="selector-card"
      >
        On-Going Bets
      </button>
      <button
        onClick={(e) => transitionPage(e.target.value)}
        value="GAMES"
        className="selector-card"
      >
        Live Games{" "}
      </button>
    </div>
  );
}

export default ViewSelector;
