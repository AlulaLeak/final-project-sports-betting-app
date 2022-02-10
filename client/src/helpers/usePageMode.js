import { useState } from "react";

export function usePageMode(initial) {
  const [pageMode, setPageMode] = useState(initial);
  const [pageHistory, setPageHistory] = useState([initial]);

  function transitionPage(newMode, replace = false) {
    if (replace) {
      setPageMode(newMode);
      pageHistory.pop();
      setPageHistory([...pageHistory, newMode]);
    } else {
      setPageMode(newMode);
      setPageHistory([...pageHistory, newMode]);
    }
  }

  function pageBack() {
    if (pageMode !== initial) {
      pageHistory.pop();
      setPageMode(pageHistory[pageHistory.length - 1]);
    }
  }

  return { pageBack, pageMode, transitionPage };
}
