import * as React from "react";

import { Table } from "reactstrap";
import RowRambahan from "./RowRambahan";
import RowExtraShot from "./RowExtraShot";

const initialScoreGridData = {
  shot: [
    {
      score: ["", "", "", "", "", ""],
      total: 0,
      status: "empty",
      point: 0,
    },
    {
      score: ["", "", "", "", "", ""],
      total: 0,
      status: "empty",
      point: 0,
    },
    {
      score: ["", "", "", "", "", ""],
      total: 0,
      status: "empty",
      point: 0,
    },
    {
      score: ["", "", "", "", "", ""],
      total: 0,
      status: "empty",
      point: 0,
    },
    {
      score: ["", "", "", "", "", ""],
      total: 0,
      status: "empty",
      point: 0,
    },
  ],
  extraShot: [
    {
      distanceFromX: 0,
      score: "",
      status: "empty",
    },
    {
      distanceFromX: 0,
      score: "",
      status: "empty",
    },
    {
      distanceFromX: 0,
      score: "",
      status: "empty",
    },
    {
      distanceFromX: 0,
      score: "",
      status: "empty",
    },
    {
      distanceFromX: 0,
      score: "",
      status: "empty",
    },
  ],
  win: 0,
  total: 0,
  eliminationtScoreType: 2, // tipe 2 akumulasi dulu
};

export default function ScoringGrid({ data: scoresData, onChange: notifyChangeToParent }) {
  const [scoreGridData, setScoreGridData] = React.useState(() => initialScoreGridData);
  const firstMount = React.useRef(true);

  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    notifyChangeToParent?.(scoreGridData);
  }, [scoreGridData]);

  const handleRowRambahanChange = (ev) => {
    const shotsDataUpdated = [...scoreGridData.shot]; // supaya gak mutasi array aslinya
    shotsDataUpdated[ev.nomor - 1] = { ...ev.value }; // supaya gak mutasi objek aslinya
    setScoreGridData((gridData) => ({ ...gridData, shot: shotsDataUpdated }));
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
          </tr>
        </thead>

        <tbody>
          {scoresData.shot.map((rambahan, index) => (
            <RowRambahan
              key={index}
              nomor={index + 1}
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
              <h6 className="mb-0">Extra Shot</h6>
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
