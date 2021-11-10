import * as React from "react";
import styled from "styled-components";

import { Button, Input } from "reactstrap";
import Select from "react-select";

export default function RowExtraShot() {
  return (
    <tr>
      <td className="text-center" style={{ color: "var(--bs-gray-400)" }}>
        #
      </td>
      <td>
        <SetScoreExtra nomor={1} />
      </td>
      <td>
        <SetScoreExtra nomor={2} />
      </td>
      <td>
        <SetScoreExtra nomor={3} />
      </td>
      <td>
        <SetScoreExtra nomor={4} />
      </td>
      <td>
        <SetScoreExtra nomor={5} />
      </td>
    </tr>
  );
}

function SetScoreExtra({ nomor, onChange: notifyValueToParent }) {
  const [editMode, setEditMode] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(() => ({
    nomor: nomor,
    score: { value: "m", label: "M" },
    distance: null,
  }));
  const refDistanceInput = React.useRef(null);

  const openSelect = () => setEditMode(true);
  const closeSelect = () => {
    setEditMode(false);
    notifyValueToParent?.(currentValue);
  };

  if (editMode) {
    return (
      <React.Fragment>
        <DropdownOverlay onClick={() => closeSelect()} />
        <Select
          options={scoreOptions}
          autoFocus
          value={currentValue.score}
          onChange={(ev) => {
            setCurrentValue((value) => ({ ...value, score: ev }));
            refDistanceInput.current?.focus();
          }}
        />
        <Input
          innerRef={refDistanceInput}
          type="text"
          name="distance"
          placeholder="Jarak dari X"
          className="mt-2"
          style={{ position: "relative" }}
          defaultValue={currentValue.distance}
          onChange={(ev) => {
            setCurrentValue((value) => ({ ...value, distance: ev.target.value || null }));
          }}
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
    <Button
      outline
      color="primary"
      type="button"
      tag="div"
      onClick={() => openSelect(true)}
      style={{ minWidth: "2em" }}
    >
      <div className="border-bottom border-primary">{currentValue?.score?.label || "M"}</div>
      <div>{currentValue?.distance || <span>&mdash;</span>}</div>
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
