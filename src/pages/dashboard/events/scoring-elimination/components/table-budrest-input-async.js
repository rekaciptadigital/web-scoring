import * as React from "react";
import styled from "styled-components";
import { useSubmitBudrest } from "../hooks/submit-budrest";
import { AlertSubmitError } from "components/ma";

function BudrestInputAsync({
  categoryId,
  playerDetail,
  disabled,
  scoring,
  participantId,
  memberId,
  onSuccess,
}) {
  const inputRef = React.useRef(null);
  const [isDirty, setDirty] = React.useState(false);
  const previousValue = React.useRef(null);
  const [inputValue, setInputValue] = React.useState("");

  const { submitBudrest, isError, errors } = useSubmitBudrest({
    categoryId: categoryId,
    eliminationId: scoring.elimination_id,
    round: scoring.round,
    match: scoring.match,
    participantId: participantId,
    memberId: memberId,
  });

  React.useEffect(() => {
    if (!playerDetail) {
      return;
    }
    isDirty && setDirty(false);
    previousValue.current = playerDetail.budrestNumber;
    setInputValue(playerDetail.budrestNumber);
  }, [playerDetail]);

  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      submitBudrest(inputValue, {
        onSuccess() {
          onSuccess?.();
        },
        onError() {
          isDirty && setDirty(false);
          setInputValue(previousValue.current);
        },
      });
    }, 1750);

    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  return (
    <React.Fragment>
      <InputAsyncWrapper>
        <InputBudrestNumber
          ref={inputRef}
          type="text"
          placeholder="-"
          disabled={disabled}
          value={inputValue}
          onChange={(ev) => {
            !isDirty && setDirty(true);
            setInputValue(ev.target.value?.toUpperCase?.());
          }}
          onFocus={(ev) => ev.target.select()}
        />
      </InputAsyncWrapper>

      <AlertSubmitError
        isError={isError}
        errors={errors}
        onConfirm={() => inputRef.current?.focus()}
      />
    </React.Fragment>
  );
}


const InputAsyncWrapper = styled.span`
  display: inline-block;
  position: relative;

  > *:nth-child(2) {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--ma-gray-400);

    > * {
      animation: spin-loading 0.7s infinite linear;

      @keyframes spin-loading {
        0% {
          transform: rotateZ(0deg);
        }

        100% {
          transform: rotateZ(360deg);
        }
      }
    }
  }
`;

const InputBudrestNumber = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-400);
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export { BudrestInputAsync };
