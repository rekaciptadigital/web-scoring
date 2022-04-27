import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Select from "react-select";
import { ButtonBlue } from "components/ma";

function EliminationConfigBar({ isShow, onChangeParticipantsCount }) {
  if (!isShow) {
    return null;
  }

  const handleChangeParticipantsCount = (option) => {
    onChangeParticipantsCount?.(option.value);
  };

  return (
    <ButtonsOnRight>
      <div>
        <label htmlFor="elimination-members-count">Jumlah Peserta Eliminasi</label>
        <Select
          placeholder="Jumlah peserta"
          options={[
            { value: 8, label: 8 },
            { value: 16, label: 16 },
            { value: 32, label: 32 },
          ]}
          onChange={handleChangeParticipantsCount}
        />
      </div>

      <div>
        <HorizontalSpaced>
          <ButtonBlue>Tentukan</ButtonBlue>
          <ButtonNavToBracket as={Link} to="/dashboard">
            Lihat Bagan
          </ButtonNavToBracket>
        </HorizontalSpaced>
      </div>
    </ButtonsOnRight>
  );
}

const ButtonsOnRight = styled.div`
  display: flex;
  gap: 0.5rem;

  > *:first-of-type {
    flex-grow: 1;
  }

  > *:nth-of-type(2) {
    flex-shrink: 0;
    align-self: flex-end;
  }
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ButtonNavToBracket = styled.button`
  &,
  &:focus,
  &:active {
    display: inline-block;
    min-width: 6.5rem;
    padding: 0.47rem 0.75rem;
    border: solid 1px var(--ma-yellow);
    border-radius: 0.5rem;
    box-shadow: none;
    background-color: var(--ma-yellow);

    color: var(--ma-txt-black);
    text-decoration: none;
    line-height: 1.5;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  &:hover {
    background-color: var(--ma-yellow);
    border: solid 1px var(--ma-yellow);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    color: var(--ma-txt-black);
  }

  &:disabled {
    cursor: default;
    background-color: var(--ma-gray-200);
    border: solid 1px var(--ma-gray-200);
    color: var(--ma-gray-400);

    &:hover {
      box-shadow: none;
    }
  }
`;

export { EliminationConfigBar };
