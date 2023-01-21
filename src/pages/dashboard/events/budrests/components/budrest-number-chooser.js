import * as React from "react";
import styled from "styled-components";

import { components } from "react-select";
import CreatableSelect from "react-select/creatable";

import IconDot from "components/ma/icons/mono/dot";

// Komponen berat & banyak dipakai di table, perlu di-memoize
// supaya gak render ulang terus ketika onchange search, berat.
// Kalau gak di-memo, ngetik di search jadi nge-lag.
const MemoizedCreatableSelect = React.memo(CreatableSelect);

function BudrestNumberChooser({ selectedNumber, options, onSubmit }) {
  // Buat nampilin sementara value yang diselect sebelum hit API & direfresh datanya
  const [tempSelected, setTempSelected] = React.useState(null);

  // Semua prop value & callback yang dioper ke React Select pelu di-memo juga
  // supaya memo komponen di atas working
  const selectedOption = React.useMemo(
    () => getSelectedFromValue(options, selectedNumber, tempSelected),
    [options, selectedNumber, tempSelected]
  );

  const handleNumberChange = React.useCallback((opt) => {
    setTempSelected(opt);
  }, []);

  const handleCreateNumber = React.useCallback((inputValue) => {
    const newOption = { label: inputValue, value: inputValue };
    setTempSelected(newOption);
  }, []);

  const formatCreateLabel = React.useCallback((inputValue) => `Buat: "${inputValue}"`, []);

  const isOptionDisabled = React.useCallback(
    (option) => option.value === selectedNumber,
    [selectedNumber]
    );

  const customComponents = React.useMemo(() => ({ Option }), []);

  React.useEffect(() => {
    if (!tempSelected || !onSubmit) return

    onSubmit(tempSelected)
  }, [tempSelected])

  return (
    <React.Fragment>
      <StyledWrapper>
        <MemoizedCreatableSelect
          options={options}
          placeholder="-"
          value={selectedOption}
          styles={customSelectStyles}
          onChange={handleNumberChange}
          onCreateOption={handleCreateNumber}
          formatCreateLabel={formatCreateLabel}
          components={customComponents}
          isOptionDisabled={isOptionDisabled}
        />
      </StyledWrapper>
    </React.Fragment>
  );
}

function Option({ children, ...props }) {
  if (props.data.__isNew__) {
    return (
      <components.Option {...props}>
        <span style={{ color: "#6a7187" }}>{children}</span>
      </components.Option>
    );
  }

  if (!props.data.isEmpty) {
    return (
      <div title="Terpakai">
        <components.Option {...props}>
          <OptionLabelWithDot>
            <span>{children}</span>
            <DotBlue>
              <IconDot size="6" />
            </DotBlue>
          </OptionLabelWithDot>
        </components.Option>
      </div>
    );
  }

  return (
    <div title="Belum terpakai">
      <components.Option {...props}>
        <OptionLabelWithDot>
          <span>{children}</span>
          <DotGray>
            <IconDot size="6" />
          </DotGray>
        </OptionLabelWithDot>
      </components.Option>
    </div>
  );
}

const StyledWrapper = styled.div`
  max-width: 5.5rem;
`;

const OptionLabelWithDot = styled.span`
  width: 100%;

  > span + span {
    margin-left: 0.375rem;
  }
`;

const DotBlue = styled.span`
  color: rgb(38, 132, 255);
`;

const DotGray = styled.span`
  color: var(--ma-gray-200);
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

/* ========================= */
// utils

function getSelectedFromValue(options, selectedNumber, tempSelected) {
  if (tempSelected) {
    return { label: tempSelected.label, value: tempSelected.value };
  }

  // Untuk cari value dari objek yang ada di option.
  // Karena kalau beda objek walaupun valuenya sama
  // nanti menu selectnya default ke atas, enggak
  // scroll ke option yang terpilih.
  const foundOption = options.find((option) => option.value === selectedNumber);
  if (foundOption) {
    return foundOption;
  }

  return { label: selectedNumber, value: selectedNumber };
}

export { BudrestNumberChooser };
