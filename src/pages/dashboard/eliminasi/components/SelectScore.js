import * as React from "react";
import styled from "styled-components";

import { Button } from "reactstrap";
import Select from "react-select";

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

export default function SelectScore({ nomor, onChange: notifyValueToParent }) {
  const [editMode, setEditMode] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({ value: "m", label: "M" });

  const openSelect = () => setEditMode(true);
  const closeSelect = () => setEditMode(false);

  React.useEffect(() => {
    notifyValueToParent?.({ nomor, value: selectedValue });
  }, [selectedValue]);

  if (editMode) {
    return (
      <React.Fragment>
        <DropdownOverlay onClick={() => closeSelect()} />
        <Select
          defaultMenuIsOpen
          options={scoreOptions}
          value={selectedValue}
          onChange={(ev) => {
            setSelectedValue(ev);
            closeSelect();
          }}
          onMenuClose={() => closeSelect()}
        />
      </React.Fragment>
    );
  }

  return (
    <Button outline color="primary" type="button" onClick={() => openSelect()}>
      {selectedValue?.label || "M"}
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
