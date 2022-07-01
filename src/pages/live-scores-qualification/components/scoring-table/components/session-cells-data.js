import * as React from "react";
import { useDisplaySettings } from "../../../contexts/display-settings";

const sessionIsNotShootOff = (sessionNumber) => parseInt(sessionNumber) !== 11;

function SessionCellsDataHeading({ sessions }) {
  const { sessionNumber } = useDisplaySettings();

  if (!sessions) {
    return [];
  }

  if (sessionNumber > 0) {
    return <th className="text-uppercase">Total</th>;
  }

  return Object.keys(sessions)
    .filter(sessionIsNotShootOff)
    .map((currentSession) => <th key={currentSession}>Sesi {currentSession}</th>);
}

function SessionCellsData({ sessions }) {
  const { sessionNumber } = useDisplaySettings();

  if (!sessions) {
    return [];
  }

  if (sessionNumber > 0) {
    return <td>{sessions[sessionNumber]?.total}</td>;
  }

  return Object.keys(sessions)
    .filter(sessionIsNotShootOff)
    .map((currentSession) => <td key={currentSession}>{sessions[currentSession].total}</td>);
}

export { SessionCellsDataHeading, SessionCellsData };
