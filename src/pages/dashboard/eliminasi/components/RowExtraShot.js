import * as React from "react";
import styled from "styled-components";

import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import Select from "react-select";

export default function RowExtraShot({ extraShot, onChange: notifyChangeToParent }) {
  const handleSetScoreChange = (ev) => {
    if (!notifyChangeToParent) {
      return;
    }

    const shotsDataUpdated = [...extraShot];
    shotsDataUpdated[ev.nomor - 1] = { ...ev.value };
    notifyChangeToParent(shotsDataUpdated);
  };

  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #
      </td>

      {extraShot.map((shot, index) => (
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
        <ExtraShotFieldGroup>
          <Select
            options={scoreOptions}
            autoFocus
            value={getOptionFromValue(currentValue.score)}
            onChange={handleSelectScoreChange}
          />
          <InputGroup className="mt-2">
            <Input
              innerRef={refDistanceInput}
              type="text"
              name="distanceFromX"
              placeholder="Jarak dari X"
              style={{ position: "relative" }}
              defaultValue={currentValue.distanceFromX}
              onChange={handleInputDistanceChange}
            />
            <InputGroupText className="text-muted" style={{ fontSize: "0.8em" }}>
              mm
            </InputGroupText>
          </InputGroup>
          <Button
            color="success"
            size="sm"
            className="mt-2"
            style={{ position: "relative" }}
            onClick={() => closeSelect()}
          >
            Simpan
          </Button>
        </ExtraShotFieldGroup>
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

const ExtraShotFieldGroup = styled.div`
  width: 100%;
  max-width: 100px;
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
