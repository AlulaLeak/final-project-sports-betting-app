import React, { useState } from "react";
import "../../styles/EventFilter.css";
export const LeagueName = React.createContext("");

function LeagueSelector({ setLeagueName }) {
  function gameFilteringHandler(e) {
    setLeagueName(e.target.value);
  }

  function liveFilteringHandler(e) {
    e.preventDefault();
    // add function to filter for live events
  }

  return (
    <div className="event-box">
      
      {/* <br className="event-filter-divider" /> */}
      <div className="event-selection-button-homepage">
        <button
          value="?league=NBA"
          className="game-button"
          onClick={(e) => setLeagueName(e.target.value)}
        >
          NBA
        </button>
        <button
          value="?league=NFL"
          className="game-button"
          onClick={(e) => setLeagueName(e.target.value)}
        >
          NFL
        </button>
        <button
          value="?league=NHL"
          className="game-button"
          onClick={(e) => setLeagueName(e.target.value)}
        >
          NHL
        </button>
        <button
          value="?league=MLB"
          className="game-button"
          onClick={(e) => setLeagueName(e.target.value)}
        >
          MLB
        </button>
      </div>
    </div>
  );
}

export default LeagueSelector;

// can use specification to express 4 buttons in div
