import * as React from "react";
import SelectScore from "./SelectScore";

export default function RowRambahan({ nomor }) {
  const [scoreData, setScoreData] = React.useState([]);

  const updateScoreData = (ev) => {
    setScoreData((currentData) => {
      const dataUpdated = [...currentData];
      dataUpdated[ev.nomor - 1] = ev.value.value;
      return dataUpdated;
    });
  };

  const computeTotal = () => {
    return scoreData?.length ? scoreData.reduce(summingReducer, 0) : 0;
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #{nomor}
      </td>
      <td>
        <SelectScore nomor={1} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={2} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={3} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={4} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={5} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td>
        <SelectScore nomor={6} onChange={(ev) => updateScoreData(ev)} />
      </td>
      <td className="text-end fw-bold">{computeTotal()}</td>
    </tr>
  );
}

const summingReducer = (prev, value) => {
  let interpretedValue;
  if (`${value}`.toLowerCase() === "m") {
    interpretedValue = 0;
  } else if (`${value}`.toLowerCase() === "x") {
    interpretedValue = 10;
  } else {
    interpretedValue = value;
  }
  return prev + interpretedValue;
};
