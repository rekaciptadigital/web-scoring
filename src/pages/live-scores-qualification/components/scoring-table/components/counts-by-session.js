import * as React from "react";
import { useDisplaySettings } from "../../../contexts/display-settings";

function CountsBySession({ scoring }) {
  const { sessionNumber } = useDisplaySettings();
  const { sessions } = scoring;

  if (sessionNumber > 0 && sessionNumber !== 11) {
    return (
      <React.Fragment>
        <td>{sessions[sessionNumber]?.totalX}</td>
        <td>{sessions[sessionNumber]?.totalXPlusTen}</td>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <td>{scoring.total}</td>
      <td>{scoring.totalXPlusTen}</td>
      <td>{scoring.totalX}</td>
    </React.Fragment>
  );
}

export { CountsBySession };
