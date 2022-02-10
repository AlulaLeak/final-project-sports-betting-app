import { useState } from "react";

export function useVisualMode(initial) {
  const [viewMode, setViewMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setViewMode(newMode);
      history.pop();
      setHistory([...history, newMode]);
    } else {
      setViewMode(newMode);
      setHistory([...history, newMode]);
    }
  }

  function back() {
    if (viewMode !== initial) {
      history.pop();
      setViewMode(history[history.length - 1]);
    }
  }

  return { back, viewMode, transition };
}
