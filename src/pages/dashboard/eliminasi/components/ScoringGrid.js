import * as React from "react";

import { Table } from "reactstrap";
import RowRambahan from "./RowRambahan";
import RowExtraShot from "./RowExtraShot";

export default function ScoringGrid({ scoringType, scores, onChange: notifyChangeToParent }) {
  const { shot, extraShot } = scores;

  const handleRowRambahanChange = (ev) => {
    if (!notifyChangeToParent) {
      return;
    }
    const { nomor, value } = ev;

    const shotsDataUpdated = [...shot];
    shotsDataUpdated[nomor - 1] = {
      ...shotsDataUpdated[nomor - 1],
      ...value,
    };
    notifyChangeToParent({ ...scores, shot: shotsDataUpdated });
  };

  const handleRowExtrashotChange = (ev) => {
    if (!notifyChangeToParent) {
      return;
    }
    notifyChangeToParent({ ...scores, extraShot: [...ev] });
  };

  return (
    <div>
      <Table borderless className="text-muted text-center">
        <thead>
          <tr>
            <td className="text-center">Seri</td>
            {shot[0].score.map((col, index) => (
              <td key={index}>{index + 1}</td>
            ))}
            <td className="text-end">Total</td>
            {scoringType === 1 && <td className="text-end">Point</td>}
          </tr>
        </thead>

        <tbody>
          {shot.map((rambahan, index) => (
            <RowRambahan
              key={index}
              nomor={index + 1}
              scoringType={scoringType}
              shot={rambahan}
              onChange={handleRowRambahanChange}
            />
          ))}
        </tbody>
      </Table>

      <Table borderless className="text-muted text-center">
        <thead>
          <tr>
            <td colSpan="6" className="text-start">
              <h6 className="mb-0">Shot Off</h6>
            </td>
          </tr>
        </thead>
        <tbody>
          <RowExtraShot extraShot={extraShot} onChange={handleRowExtrashotChange} />
        </tbody>
      </Table>
    </div>
  );
}
