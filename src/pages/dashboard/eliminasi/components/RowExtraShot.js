import * as React from "react";
import styled from "styled-components";

import { Button, Input } from "reactstrap";
import Select from "react-select";

const createInitialShotsList = (initialShotsList) => {
  const scoresList = initialShotsList.map((shot) => {
    const transformedValue = Number(shot.score);
    const interpretedValue = isNaN(transformedValue) ? shot.score : transformedValue;
    return {
      score: interpretedValue || "m",
      distanceFromX: shot.distanceFromX || 0,
    };
  });
  return () => scoresList;
};

export default function RowExtraShot({ data: extraShotData, onChange: notifyChangeToParent }) {
  const [shotsData, setShotsData] = React.useState(createInitialShotsList(extraShotData));

  React.useEffect(() => {
    notifyChangeToParent?.(shotsData);
  }, [shotsData]);

  const handleSetScoreChange = (ev) => {
    setShotsData((shotsData) => {
      const shotsDataUpdated = [...shotsData];
      shotsDataUpdated[ev.nomor - 1] = { ...ev.value };
      return shotsDataUpdated;
    });
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #
      </td>

      {extraShotData.map((shot, index) => (
        <td key={index}>
          <SetScoreExtra nomor={index + 1} defaultData={shot} onChange={handleSetScoreChange} />
        </td>
      ))}
    </tr>
  );
}

const createInitialValueData = (defaultData) => {
  const transformedScoreValue = Number(defaultData.score);
  const interpretedScoreValue = isNaN(transformedScoreValue)
    ? defaultData.score
    : transformedScoreValue;
  return () => ({
    score: interpretedScoreValue || "m",
    distanceFromX: defaultData.distanceFromX || 0,
  });
};

function SetScoreExtra({ nomor, defaultData, onChange: notifyValueToParent }) {
  const [editMode, setEditMode] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(createInitialValueData(defaultData));
  const refDistanceInput = React.useRef(null);

  const openSelect = () => setEditMode(true);
  const closeSelect = () => {
    setEditMode(false);
    notifyValueToParent?.({ nomor: nomor, value: currentValue });
  };

  const handleSelectScoreChange = (ev) => {
    setCurrentValue((value) => ({ ...value, score: Number(ev.value) || ev.value }));
    refDistanceInput.current?.focus();
  };

  const handleInputDistanceChange = (ev) => {
    setCurrentValue((value) => ({
      ...value,
      distanceFromX: Number(ev.target.value) || 0,
    }));
  };

  if (editMode) {
    return (
      <React.Fragment>
        <DropdownOverlay onClick={() => closeSelect()} />
        <Select
          options={scoreOptions}
          autoFocus
          value={getOptionFromValue(currentValue.score)}
          onChange={handleSelectScoreChange}
        />
        <Input
          innerRef={refDistanceInput}
          type="text"
          name="distanceFromX"
          placeholder="Jarak dari X"
          className="mt-2"
          style={{ position: "relative" }}
          defaultValue={currentValue.distanceFromX}
          onChange={handleInputDistanceChange}
        />
        <Button
          color="success"
          size="sm"
          className="mt-2"
          style={{ position: "relative" }}
          onClick={() => closeSelect()}
        >
          Simpan
        </Button>
      </React.Fragment>
    );
  }

  return (
    <Button outline color="primary" type="button" tag="div" onClick={() => openSelect(true)}>
      <div className="border-bottom border-primary">
        {getOptionFromValue(currentValue?.score)?.label || "M"}
      </div>
      <div>{currentValue?.distanceFromX}</div>
    </Button>
  );
}

const DropdownOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  opacity: 0.8;
`;

const getOptionFromValue = (value) => {
  return scoreOptions.find((option) => option.value === value);
};

const scoreOptions = [
  { value: "m", label: "M" },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: "x", label: "X" },
];
