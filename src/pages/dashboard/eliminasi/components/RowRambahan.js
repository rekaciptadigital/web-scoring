import * as React from "react";
import SelectScore from "./SelectScore";

const createInitialScoresList = (initialScoresList) => {
  const scoresList = initialScoresList.map((score) => {
    const transformedValue = Number(score);
    const interpretedValue = isNaN(transformedValue) ? score : transformedValue;
    return interpretedValue || "m";
  });
  return () => scoresList;
};

export default function RowRambahan({
  nomor,
  rambahan: rambahanData,
  scoringType,
  onChange: notifyChangeToParent,
}) {
  const [scoreData, setScoreData] = React.useState(createInitialScoresList(rambahanData.score));

  React.useEffect(() => {
    const rambahanObject = {
      nomor: nomor,
      value: {
        score: scoreData,
        // total: 0, // bagian ini mungkin bisa diabaikan dulu tapi pasang aja in case perlu nanti
        // status: "empty", // ...idem...
        // point: 0, // ...idem...
      },
    };
    notifyChangeToParent?.(rambahanObject);
  }, [scoreData]);

  const updateScoreData = (ev) => {
    setScoreData((currentData) => {
      const dataUpdated = [...currentData];
      dataUpdated[ev.nomor - 1] = ev.value;
      return dataUpdated;
    });
  };

  const computeTotal = () => {
    return scoreData?.reduce(summingReducer, 0);
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
      {scoringType === 1 && <td className="text-end fw-bold">{rambahanData.point}</td>}
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
