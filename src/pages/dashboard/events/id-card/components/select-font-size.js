import * as React from "react";

import Select from "react-select/creatable";

const defaultSizeNumbers = [14, 16, 18, 20, 21, 24, 27, 28, 30, 32, 36, 40, 42, 46];

function SelectFontSize({ fontSize, onChange }) {
  const [sizeNumbers, setSizeNumbers] = React.useState(defaultSizeNumbers);

  const optionsSizeNumbers = React.useMemo(
    () => sizeNumbers.map((value) => ({ value: value, label: value })),
    [sizeNumbers]
  );

  const foundOption = _getOptionByValue(optionsSizeNumbers, fontSize);

  React.useEffect(() => {
    if (!fontSize || foundOption) {
      return;
    }
    setSizeNumbers(_createNewSizeNumberUpdater(fontSize));
    onChange?.(Number(fontSize));
  }, [fontSize, foundOption]);

  return (
    <Select
      placeholder="-"
      styles={customSelectStyles}
      options={optionsSizeNumbers}
      value={foundOption}
      onChange={(opt) => onChange?.(opt.value)}
      onCreateOption={(inputString) => {
        if (!inputString || isNaN(inputString)) {
          return;
        }
        setSizeNumbers(_createNewSizeNumberUpdater(inputString));
        onChange?.(Number(inputString));
      }}
      formatCreateLabel={(inputString) => inputString}
      menuPlacement="top"
    />
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  container: (provided) => ({
    ...provided,
    minWidth: "5rem",
  }),
  control: (provided) => ({
    ...provided,
    // minHeight: undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.75rem",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6a7187",
    opacity: 0.6,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0 0.25rem 0 0",
    color: "var(--ma-blue)",
  }),
};

/* ========================= */
// utils

const _getOptionByValue = (numberList, value) => {
  const foundOption = numberList.find((option) => option.value === value);
  return foundOption;
};

function _createNewSizeNumberUpdater(value) {
  return (sizeNumbers) => [...sizeNumbers, Number(value)].sort((a, b) => a - b);
}

export { SelectFontSize };
