import * as React from "react";
import styled from "styled-components";

import { Button, Input } from "reactstrap";
import Select from "react-select";

export default function RowExtraShot({ data: extraShotData }) {
  const handleSetScoreChange = () => {};

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

const createInitialValueData = (nomor, defaultData) => {
  const transformedScoreValue = Number(defaultData.score);
  const interpretedScoreValue = isNaN(transformedScoreValue)
    ? defaultData.score
    : transformedScoreValue;
  return () => ({
    nomor: nomor,
    score: interpretedScoreValue || "m",
    distanceFromX: defaultData.distanceFromX || null,
  });
};

function SetScoreExtra({ nomor, defaultData, onChange: notifyValueToParent }) {
  const [editMode, setEditMode] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(
    createInitialValueData(nomor, defaultData)
  );
  const refDistanceInput = React.useRef(null);

  const openSelect = () => setEditMode(true);
  const closeSelect = () => {
    setEditMode(false);
    notifyValueToParent?.(currentValue);
  };

  const handleSelectScoreChange = (ev) => {
    setCurrentValue((value) => ({ ...value, score: Number(ev.value) }));
    refDistanceInput.current?.focus();
  };

  const handleInputDistanceChange = (ev) => {
    setCurrentValue((value) => ({
      ...value,
      distanceFromX: Number(ev.target.value) || null,
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
      <div>{currentValue?.distanceFromX || <span>&mdash;</span>}</div>
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
