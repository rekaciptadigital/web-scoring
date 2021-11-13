import * as React from "react";
import { Badge } from "reactstrap";
import { Button } from "components";

export default function QualificationDaysPlaceholder({ qualificationDays }) {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "#ffffff",
          opacity: 0.8,
        }}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Hari</th>
            <th>Sesi</th>
            <th style={{ width: "1%", whiteSpace: "nowrap" }}>Detail Sesi</th>
            <th>Kuota</th>
            <th style={{ width: "1%", whiteSpace: "nowrap" }}>{/* ... */}</th>
          </tr>
        </thead>

        {qualificationDays.map((day) => (
          <tbody key={day.id}>
            <tr>
              <td>{day.label}</td>
              <td>
                <Badge className="bg-info" style={{ fontSize: "1em" }}>
                  {day.details?.length} Sesi
                </Badge>
              </td>
              <td>-</td>
              <td>
                <Badge className="bg-info" style={{ fontSize: "1em" }}>
                  0
                </Badge>
              </td>
              <td style={{ width: "1%", whiteSpace: "nowrap" }}>
                <Button disabled outline type="secondary" size="sm" icon="plus-circle" />{" "}
                <Button disabled outline type="secondary" size="sm" icon="chevron-down" />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
