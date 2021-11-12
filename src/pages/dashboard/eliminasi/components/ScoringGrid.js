import * as React from "react";

import { Table } from "reactstrap";
import RowRambahan from "./RowRambahan";
import RowExtraShot from "./RowExtraShot";

export default function ScoringGrid({
  scoringType,
  data: scoresData,
  onChange: notifyChangeToParent,
}) {
  // `scoreGridData` cuma simpan data list score, lainnya (`point`, dll) masih dari prop `scoresData`
  const [scoreGridData, setScoreGridData] = React.useState(() => scoresData);
  const firstMount = React.useRef(true);

  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    notifyChangeToParent?.(scoreGridData);
  }, [scoreGridData]);

  const handleRowRambahanChange = (ev) => {
    setScoreGridData((gridData) => {
      const shotsDataUpdated = [...gridData.shot]; // supaya gak mutasi array aslinya
      const memberIndex = ev.nomor - 1;
      shotsDataUpdated[memberIndex] = {
        ...shotsDataUpdated[memberIndex],
        ...ev.value,
      }; // supaya gak mutasi objek aslinya
      return { ...gridData, shot: shotsDataUpdated };
    });
  };

  const handleRowExtrashotChange = (ev) => {
    setScoreGridData((gridData) => ({ ...gridData, extraShot: [...ev] }));
  };

  return (
    <div>
      <Table borderless className="text-muted text-center">
        <thead>
          <tr>
            <td className="text-center">Seri</td>
            {scoresData.shot[0].score.map((col, index) => (
              <td key={index}>{index + 1}</td>
            ))}
            <td className="text-end">Total</td>
            {scoringType === 1 && <td className="text-end">Point</td>}
          </tr>
        </thead>

        <tbody>
          {scoresData.shot.map((rambahan, index) => (
            <RowRambahan
              key={index}
              nomor={index + 1}
              scoringType={scoringType}
              rambahan={rambahan}
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
          <RowExtraShot data={scoresData.extraShot} onChange={handleRowExtrashotChange} />
        </tbody>
      </Table>
    </div>
  );
}
