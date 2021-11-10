import * as React from "react";

import { Table } from "reactstrap";
import RowRambahan from "./RowRambahan";
import RowExtraShot from "./RowExtraShot";

const listRambahan = [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }, { no: 5 }];

export default function ScoringGrid() {
  return (
    <div>
      <Table borderless className="text-muted text-center">
        <thead>
          <tr>
            <td className="text-center">Seri</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td className="text-end">Total</td>
          </tr>
        </thead>

        <tbody>
          {listRambahan.map((row) => (
            <RowRambahan key={row.no} nomor={row.no} />
          ))}

          <tr>
            <td colSpan="8" className="text-end">
              Total: <span className="ms-1 fw-bold">123</span>
            </td>
          </tr>
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
          <RowExtraShot />
        </tbody>
      </Table>
    </div>
  );
}
