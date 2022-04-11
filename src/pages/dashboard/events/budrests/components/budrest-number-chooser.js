import * as React from "react";
import styled from "styled-components";

import CreatableSelect from "react-select/creatable";

function UnmemoizedBudrestNumberChooser({ selectedNumber, options, onSubmit, ...props }) {
  // Buat nampilin sementara value yang diselect sebelum hit API & direfresh datanya
  const [tempSelected, setTempSelected] = React.useState("");

  const handleNumberChange = (opt) => {
    setTempSelected(opt);
    onSubmit?.(opt);
  };

  const handleCreateNumber = (inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setTempSelected(newOption);
    onSubmit?.(newOption);
  };

  return (
    <StyledWrapper>
      <CreatableSelect
        {...props}
        options={options}
        value={
          tempSelected
            ? { label: tempSelected.label, value: tempSelected.value }
            : { label: selectedNumber, value: selectedNumber }
        }
        styles={customSelectStyles}
        onChange={handleNumberChange}
        onCreateOption={handleCreateNumber}
        formatCreateLabel={(inputValue) => `Buat: "${inputValue}"`}
      />
    </StyledWrapper>
  );
}

// TODO: pertimbangkankan ulang implementasinya, update terakhir di onChange bikin memonya gak working
const BudrestNumberChooser = React.memo(UnmemoizedBudrestNumberChooser);

const StyledWrapper = styled.div`
  max-width: 5.5rem;
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: undefined,
    backgroundColor: state.isDisabled ? "#eff2f7" : "#ffffff",
    borderColor: state.isDisabled ? "rgb(206, 212, 218)" : "#ced4da",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "8px 12px",
  }),
  input: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    fontSize: 12,
    opacity: 0.6,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 7,
  }),
};

export { BudrestNumberChooser };
