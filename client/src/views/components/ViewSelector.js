import React from "react";
import "../../styles/ViewSelector.css";


function ViewSelector(props) {
  const { transitionPage, setLeagueName } = props;

  function handleProfileClick(e) {
    setLeagueName("");
    transitionPage(e.target.value);
  }

  return (
    <div className="view-select-wrapper">
      <h6
        onClick={(e) => handleProfileClick(e)}
        value="PROFILE"
        className="selector-card"
      >
        On-Going Bets
      </h6>
      <h6
        onClick={(e) => transitionPage(e.target.value)}
        value="GAMES"
        className="selector-card"
      >
        Live Games{" "}
      </h6>
    </div>
  );
}

export default ViewSelector;
