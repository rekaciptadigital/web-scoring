import * as React from "react";
import styled from "styled-components";

const InputEventKeyWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding: 24px 20px;
  background-color: #ffffff;
  border-radius: 8px;

  .field-group-event-key {
    padding-bottom: 12px;
    border-bottom: solid 1px #e2e2e2;

    .field-event-key-label {
      position: absolute;
      visibility: hidden;
      top: -200%;
      left: -200%;
    }

    input[type="text"].field-event-key-input {
      width: 100%;
      border: none;
      font-size: 1.2rem;
      color: var(--ma-gray-400);

      &::placeholder {
        color: var(--ma-gray-400);
        opacity: 1;
      }
    }
  }

  .input-event-key-action {
    text-align: right;

    .btn-check-key {
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      background-color: unset;
      color: var(--ma-gray-400);

      &:hover {
        background-color: var(--ma-gray-100);
        color: var(--ma-gray-500);
      }
    }
  }
`;

export default function InputEventKey({ name = "eventKey", value = "", onChange, onCheck }) {
  const inputRef = React.useRef(null);

  const handleInputChange = (ev) => onChange?.(ev);
  const handleKeyCheckClick = () => {
    if (onCheck) {
      if (value) {
        const ev = { target: { value: value } };
        onCheck(ev);
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <InputEventKeyWrapper>
      <div className="field-group-event-key">
        <label htmlFor="input-event-key" className="field-event-key-label">
          Masukkan Key
        </label>

        <input
          ref={inputRef}
          className="field-event-key-input"
          type="text"
          id="input-event-key"
          name={name}
          placeholder="Masukkan Key"
          value={value}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-3 input-event-key-action">
        <button className="mb-0 btn-check-key" onClick={handleKeyCheckClick}>
          Periksa Key
        </button>
      </div>
    </InputEventKeyWrapper>
  );
}
