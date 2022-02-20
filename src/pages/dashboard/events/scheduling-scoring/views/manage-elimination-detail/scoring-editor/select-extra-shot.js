import * as React from "react";
import styled from "styled-components";

import Select from "react-select";
import IconCross from "components/ma/icons/mono/cross";

import { stringUtil } from "utils";

const scoreOptions = ["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => ({
  value,
  label: isNaN(value) ? value.toUpperCase() : value,
}));

function getOptionFromValue(value) {
  const defaultOption = { value, label: "-" };
  return scoreOptions.find((option) => option.value === value) || defaultOption;
}

function SelectExtraShot({ score, distanceFromX, onChange, onDistanceChange, onClearDistance }) {
  const [isInputOpen, setInputOpen] = React.useState(false);
  const [distanceValue, setDistanceValue] = React.useState("");

  const formatedValue = getOptionFromValue(score);
  const handleCloseDistance = () => {
    setInputOpen(false);
    setDistanceValue("");
  };

  return (
    <SelectContainer>
      <Select
        name={stringUtil.createRandom()}
        styles={customSelectStyles}
        onChange={(option) => {
          onChange?.(option?.value);
          if (option) {
            setTimeout(() => {
              setInputOpen(true);
            }, 350);
          } else {
            onClearDistance?.();
          }
        }}
        defaultValue={formatedValue}
        value={formatedValue}
        options={scoreOptions}
        blurInputOnSelect
        isClearable
      />
      {Boolean(distanceFromX) && (
        <DisplayDistance>
          {distanceFromX} mm
          <ButtonClearDistance onClick={() => onClearDistance?.()}>
            <IconCross size="12" />
          </ButtonClearDistance>
        </DisplayDistance>
      )}

      {isInputOpen && (
        <React.Fragment>
          <ClickOutsideBlocker onClick={handleCloseDistance} />
          <InputDistanceFromX
            onInputChange={(value) => setDistanceValue(value)}
            onSave={() => {
              onDistanceChange?.(distanceValue);
            }}
            onClose={handleCloseDistance}
          />
        </React.Fragment>
      )}
    </SelectContainer>
  );
}

function InputDistanceFromX({ onInputChange, onClose, onSave }) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <InputDistanceContainer>
      <input
        ref={inputRef}
        id="distanceFromX"
        placeholder="Jarak dari X (mm)"
        onChange={(ev) => onInputChange?.(ev.target.value)}
      />
      <ButtonConfirm
        onClick={() => {
          if (!inputRef.current.value) {
            inputRef.current.focus();
            return;
          }
          onSave?.();
          onClose?.();
        }}
      >
        Simpan
      </ButtonConfirm>
      <ButtonGhost onClick={() => onClose?.()}>Abaikan</ButtonGhost>
    </InputDistanceContainer>
  );
}

// TODO: custom styling container supaya mirip figma
const customSelectStyles = {
  singleValue: (provided) => ({
    ...provided,
    textTransform: "uppercase",
  }),
};

const SelectContainer = styled.div`
  position: relative;
  min-width: 5rem;
`;

const DisplayDistance = styled.div`
  margin-left: 0.375rem;
  color: var(--ma-gray-400);
  font-size: 0.875em;
  font-weight: 600;
`;

const ButtonClearDistance = styled.button`
  border: none;
  background-color: transparent;
  color: var(--ma-gray-500);
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

const ClickOutsideBlocker = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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

export { SelectExtraShot };
