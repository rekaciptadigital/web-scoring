import * as React from "react";

import { Table } from "reactstrap";
import RowRambahan from "./RowRambahan";
import RowExtraShot from "./RowExtraShot";

export default function ScoringGrid({ data: scoresData }) {
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
            <RowRambahan key={index} nomor={index + 1} rambahan={rambahan} />
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
          <RowExtraShot data={scoresData.extraShot} />
        </tbody>
      </Table>
    </div>
  );
}
