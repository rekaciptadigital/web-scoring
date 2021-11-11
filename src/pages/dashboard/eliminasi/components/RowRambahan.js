import * as React from "react";
import SelectScore from "./SelectScore";

const createInitialScoresList = (initialScoresList) => {
  const scoresList = initialScoresList.map((score) => {
    const transformedValue = Number(score);
    return isNaN(transformedValue) ? score : transformedValue;
  });
  return () => scoresList;
};

export default function RowRambahan({ nomor, rambahan: rambahanData }) {
  const [scoreData, setScoreData] = React.useState(createInitialScoresList(rambahanData.score));
  const isDirty = React.useRef(false);

  const updateScoreData = (ev) => {
    isDirty.current = isDirty.current || true;
    setScoreData((currentData) => {
      const dataUpdated = [...currentData];
      dataUpdated[ev.nomor - 1] = ev.value;
      return dataUpdated;
    });
  };

  const computeTotal = () => {
    // Defaultnya tampilkan data total dari respon BE,
    // tapi timpa dengan nilai dari select ketika ada inputan baru
    if (isDirty.current) {
      return scoreData?.reduce(summingReducer, 0);
    }
    return rambahanData.total;
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #{nomor}
      </td>

      {rambahanData.score.map((scoreValue, index) => (
        <td key={index}>
          <SelectScore
            nomor={index + 1}
            defaultValue={scoreValue}
            onChange={(ev) => updateScoreData(ev)}
          />
        </td>
      ))}

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
