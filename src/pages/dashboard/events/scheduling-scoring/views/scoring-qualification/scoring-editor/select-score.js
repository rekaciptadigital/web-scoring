import * as React from "react";
import styled from "styled-components";

import Select from "react-select";

function SelectScore({ defaultOpen = false, score, onChange }) {
  const [isOpen, setOpen] = React.useState(defaultOpen);
  const openSelect = () => setOpen(true);
  const closeSelect = () => setOpen(false);

  return (
    <div>
      {!isOpen ? (
        <ButtonOpen onClick={openSelect} onFocus={openSelect}>
          {score}
        </ButtonOpen>
      ) : (
        <SelectContainer>
          <Select
            defaultMenuIsOpen
            autoFocus
            styles={customSelectStyles}
            onSelect={closeSelect}
            onMenuClose={closeSelect}
            onChange={(option) => onChange?.(option.value)}
            value={{ value: score, label: score }}
            options={["M", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "X"].map((value) => ({
              value,
              label: value,
            }))}
          />
        </SelectContainer>
      )}
    </div>
  );
}

const customSelectStyles = {
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
};

const ButtonOpen = styled.button`
  min-width: 2rem;
  padding: 0.25rem 0.5rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.25rem;
  background-color: var(--ma-gray-50);
  text-transform: uppercase;
  color: var(--bs-body-color);
`;

const SelectContainer = styled.div`
  min-width: 5rem;
`;

export { SelectScore };
