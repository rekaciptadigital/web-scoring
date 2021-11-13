import * as React from "react";
import SelectScore from "./SelectScore";

export default function RowRambahan({ nomor, shot, scoringType, onChange: notifyChangeToParent }) {
  const { score, point } = shot;

  const handleSelectScoreChange = (ev) => {
    if (!notifyChangeToParent) {
      return;
    }

    const scoreUpdated = [...score];
    scoreUpdated[ev.nomor - 1] = ev.value;

    const shotUpdated = {
      nomor: nomor,
      value: { ...shot, score: scoreUpdated },
    };
    notifyChangeToParent(shotUpdated);
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #{nomor}
      </td>

      {score.map((scoreValue, index) => (
        <td key={index}>
          <SelectScore
            nomor={index + 1}
            value={scoreValue}
            onChange={(ev) => handleSelectScoreChange(ev)}
          />
        </td>
      ))}

      <td className="text-end fw-bold">{computeTotal(score)}</td>
      {scoringType === 1 && <td className="text-end fw-bold">{point}</td>}
    </tr>
  );
}

const computeTotal = (score) => {
  return score?.reduce(summingReducer, 0);
};

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
