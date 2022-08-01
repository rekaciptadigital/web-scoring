import * as React from "react";
import styled from "styled-components";
import { useSubmitAdminTotal } from "../hooks/submit-total";

import { AlertSubmitError } from "components/ma";
import { toast } from "./processing-toast";

import IconLoading from "./icon-loading";

function TotalInputAsync({ categoryId, playerDetail, disabled, scoring, onSuccess }) {
  const inputRef = React.useRef(null);
  const [isDirty, setDirty] = React.useState(false);
  const previousValue = React.useRef(null);
  const [inputValue, setInputValue] = React.useState("");

  const { submitAdminTotal, isLoading, isError, errors } = useSubmitAdminTotal({
    categoryId: categoryId,
    participantId: playerDetail?.participantId,
    memberId: playerDetail.id,
    eliminationId: scoring.elimination_id,
    round: scoring.round,
    match: scoring.match,
  });

  React.useEffect(() => {
    if (!playerDetail) {
      return;
    }
    isDirty && setDirty(false);
    previousValue.current = playerDetail.adminTotal;
    setInputValue(playerDetail.adminTotal);
  }, [playerDetail]);

  // nge-debounce action/event handler submit
  React.useEffect(() => {
    if (!isDirty) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      toast.loading("Sedang menyimpan skor total...");
      submitAdminTotal(inputValue, {
        onSuccess() {
          toast.dismiss();
          toast.success("Total berhasil disimpan");
          inputRef.current?.focus();
          onSuccess?.();
        },
        onError() {
          isDirty && setDirty(false);
          setInputValue(previousValue.current);
          toast.dismiss();
          toast.error("Gagal menyimpan total");
        },
      });
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  return (
    <React.Fragment>
      <InputAsyncWrapper>
        <InputInlineScore
          ref={inputRef}
          type="text"
          placeholder="-"
          disabled={disabled || isLoading}
          value={disabled ? "" : inputValue}
          onChange={(ev) => {
            !isDirty && setDirty(true);
            setInputValue((previousValue) => {
              const { value } = ev.target;
              const validatedNumberValue = isNaN(value) ? previousValue : Number(value);
              return validatedNumberValue;
            });
          }}
          onFocus={(ev) => ev.target.select()}
        />
        {isLoading && (
          <span>
            <IconLoading />
          </span>
        )}
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

const InputInlineScore = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-200);
  border-radius: 0.25rem;
  color: var(--ma-gray-500);
  font-size: 0.85em;
  text-align: center;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export { TotalInputAsync };
