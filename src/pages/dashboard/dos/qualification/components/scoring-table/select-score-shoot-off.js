import * as React from "react";
import styled from "styled-components";

import ReactSelect from "react-select";

import classnames from "classnames";
import { misc } from "utils";

const Select = React.memo(ReactSelect);

const optionsScoreNumbers = ["", "m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: !value ? "-" : isNaN(value) ? value.toUpperCase() : value,
}));

const VALUES_WITHOUT_DISTANCE = ["", "-", "m"];

const defaultSelectValue = { score: "", distance: "" };

function SelectScoreShootOff({ name, value, onChange, onSetDistance, isFocus, onFocus, onBlur }) {
  value = value || defaultSelectValue;
  const convertedValueType = _convertValueType(value.score);
  const distanceValue = value.distance;
  const selectedOption = _getOptionFromValue(convertedValueType);
  const refSelect = React.useRef(null);

  const [isDistanceInputOpen, setDistanceInputOpen] = React.useState(false);
  const openDistanceInput = () => setDistanceInputOpen(true);

  React.useEffect(() => {
    if (!isFocus) {
      return;
    }
    refSelect.current?.focus();
  }, [isFocus]);

  const handleChange = React.useCallback(
    async (option) => {
      const valueObject = {
        score: option.value,
        distance: "",
      };

      onChange?.(valueObject);

      const isValueForDistance = _checkIsValueForDistance(option.value);
      if (!isValueForDistance) {
        return;
      }

      // buka input jarak setelah delay sebentar
      await misc.sleep(300);
      openDistanceInput();
    },
    [convertedValueType, distanceValue]
  );

  const handleNoOption = React.useCallback(() => "-", []);
  const handleFocus = React.useCallback(onFocus, []);
  const handleBlur = React.useCallback(onBlur, []);

  return (
    <SelectContainer>
      <Select
        name={name}
        placeholder="-"
        styles={customSelectStyles}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={selectedOption}
        options={optionsScoreNumbers}
        noOptionsMessage={handleNoOption}
        ref={refSelect}
      />

      <DistanceLabel scoreValue={convertedValueType} onOpen={openDistanceInput}>
        {distanceValue}
      </DistanceLabel>

      <DistanceInput
        isOpen={isDistanceInputOpen}
        onConfirm={(distanceValue) => {
          const valueObject = {
            score: convertedValueType,
            distance: _convertValueType(distanceValue),
          };

          onChange?.(valueObject);
          onSetDistance?.();
        }}
        onClose={() => {
          setDistanceInputOpen(false);
          onSetDistance?.();
        }}
      />
    </SelectContainer>
  );
}

function DistanceLabel({ children, distanceValue, scoreValue, onOpen }) {
  const isValueAllowed = _checkIsValueForDistance(scoreValue);

  const distanceInputTriggerProps = {
    title: isValueAllowed ? "Klik untuk ubah jarak" : "Isi skor lebih dulu",
    onClick: () => {
      if (!isValueAllowed) {
        return;
      }
      onOpen?.();
    },
  };

  if (!children && !distanceValue) {
    return (
      <LabelDistanceSmall
        className={classnames("dimmer", { "distance-disabled": !isValueAllowed })}
        {...distanceInputTriggerProps}
      >
        Jarak
      </LabelDistanceSmall>
    );
  }

  return (
    <LabelDistanceSmall {...distanceInputTriggerProps}>
      {children || distanceValue} mm
    </LabelDistanceSmall>
  );
}

function DistanceInput({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  const inputDistanceProps = { onConfirm, onClose };

  return (
    <React.Fragment>
      <ClickOutsideBlocker onClick={onClose} />
      <InputDistanceFromX {...inputDistanceProps} />
    </React.Fragment>
  );
}

function InputDistanceFromX({ onConfirm, onClose }) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleConfirm = (ev) => {
    ev.preventDefault();
    if (!inputRef.current.value) {
      inputRef.current.focus();
      return;
    }
    onConfirm?.(inputRef.current.value);
    onClose?.();
  };

  return (
    <InputDistanceContainer>
      <form id="form-distance" onSubmit={handleConfirm}>
        <input ref={inputRef} id="distanceFromX" placeholder="Jarak dari X (mm)" />
      </form>

      <ButtonConfirm form="form-distance" type="submit">
        Simpan
      </ButtonConfirm>
      <ButtonGhost onClick={onClose}>Abaikan</ButtonGhost>
    </InputDistanceContainer>
  );
}

/* ================================== */
// styles

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: undefined,
  }),
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0 0 0.25rem",
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
  }),
};

const SelectContainer = styled.div`
  position: relative;
  min-width: 3.25rem;
  max-width: 4rem;
`;

const LabelDistanceSmall = styled.div`
  margin-top: 0.25rem;
  color: var(--ma-gray-400);
  font-size: 0.625rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;

  &.distance-disabled {
    cursor: default;
  }

  &.dimmer {
    color: var(--ma-gray-200);
  }
`;

const ClickOutsideBlocker = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const InputDistanceContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: -0.5rem;
  left: -0.5rem;
  width: 9rem;
  min-height: 100px;
  padding: 0.75rem 0.75rem;
  border-radius: 0.25rem;
  border: solid 1px var(--ma-gray-400);
  background-color: #ffffff;
  box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.075);

  > * + * {
    margin-top: 0.375rem;
  }

  label {
    font-weight: 400;
    font-size: 0.875em;
    color: var(--ma-gray-500);
    display: none;
  }

  input {
    width: 100%;
    padding: 0.25rem 0.5rem;
    border-radius: 0.125rem;
    border: solid 1px var(--ma-gray-200);
    font-size: 0.875em;
    transition: border-color 0.1s, box-shadow 0.1s;

    &::placeholder {
      color: #6a7187;
      opacity: 0.6;
    }

    &:focus {
      border-color: rgb(38, 132, 255);
      box-shadow: 0 0 0 1px rgb(38, 132, 255);
    }
  }
`;

const ButtonGhost = styled.button`
  width: 100%;
  padding: 0.125rem 0.5rem;
  border: solid 1px #ffffff;
  border-radius: 0.125rem;
  background-color: #ffffff;
  color: var(--ma-blue);
  font-size: 0.875em;
`;

const ButtonConfirm = styled(ButtonGhost)`
  border: solid 1px var(--ma-blue);
  background-color: var(--ma-blue);
  color: #ffffff;
  font-weight: 600;
`;

/* =============================== */
// utils

function _convertValueType(inputValue) {
  if (!inputValue || inputValue === "-") {
    return "-";
  }
  if (["m", "x"].indexOf(inputValue.toLowerCase?.()) >= 0) {
    return inputValue;
  }
  return Number(inputValue);
}

function _getOptionFromValue(value) {
  return optionsScoreNumbers.find((option) => option.value === value);
}

function _checkIsValueForDistance(value) {
  return VALUES_WITHOUT_DISTANCE.indexOf(value) < 0;
}

export { SelectScoreShootOff };
