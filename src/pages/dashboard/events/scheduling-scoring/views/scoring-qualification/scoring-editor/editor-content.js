import * as React from "react";
import styled from "styled-components";

import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { SelectScore } from "./select-score";
import { FieldInputBudrestNo } from "./field-input-budrest-no";

import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconCross from "components/ma/icons/mono/cross";

import classnames from "classnames";

const scoreTemplate = [
  ["m", "m", "m", "m", "m", "m"],
  ["m", "m", "m", "m", "m", "m"],
  ["m", "m", "m", "m", "m", "m"],
  ["m", "m", "m", "m", "m", "m"],
  ["m", "m", "m", "m", "m", "m"],
  ["m", "m", "m", "m", "m", "m"],
];

function sumScoresList(list) {
  const sumReducer = (total, value) => {
    if (!value || (typeof value === "string" && value.toLowerCase() === "m")) {
      return total;
    }
    if (typeof value === "string" && value.toLowerCase() === "x") {
      return total + 10;
    }
    return total + value;
  };
  return list.reduce(sumReducer, 0);
}

function EditorContent({ onClose, id }) {
  const [isEditMode, setEditMode] = React.useState(false);
  const [scores, setScores] = React.useState(scoreTemplate);
  const [sessionActive, setSessionActive] = React.useState(1);
  const sessions = [1, 2, 3];

  const [shouldFocusOnWarning] = React.useState(false);

  const handleSelectScoreChange = (rambahanIndex, shotIndex, value) =>
    setScores((scores) => {
      const nextScores = scores.map((rambahan, index) => {
        if (rambahanIndex !== index) {
          return rambahan;
        }
        return rambahan.map((shot, index) => {
          return shotIndex === index ? value : shot;
        });
      });
      return nextScores;
    });

  return (
    <div>
      <EditorHeader>
        <div>
          <h4>Scoresheet (ID: {id})</h4>
        </div>
        <div className="float-end">
          <ButtonClose disabled={isEditMode} onClick={() => !isEditMode && onClose()}>
            <IconCross size="16" /> Tutup
          </ButtonClose>
        </div>
      </EditorHeader>

      <FormHeader>
        <div>
          <FieldInputBudrestNo>Bantalan</FieldInputBudrestNo>
        </div>

        {isEditMode ? (
          <SpacedButtonsGroup>
            <Button
              onClick={() => {
                setEditMode(false);
              }}
            >
              Batal
            </Button>

            <ButtonBlue
              onClick={() => {
                alert(`simpan! Hit API -> ${JSON.stringify(scores)}`);
                setEditMode(false);
              }}
            >
              Simpan
            </ButtonBlue>
          </SpacedButtonsGroup>
        ) : (
          <SpacedButtonsGroup>
            <ButtonBlue onClick={() => setEditMode(true)}>Ubah Skor</ButtonBlue>
          </SpacedButtonsGroup>
        )}
      </FormHeader>

      <YeahCategory>
        <div>{"X-XX - Placeholder Nomor Peserta"}</div>

        <div>{"Nama Pesertanya"}</div>

        <div>
          <IconBow size="16" /> {"Barebow"} {"Umum"}
        </div>

        <div>
          <IconDistance size="16" /> {"50m"}
        </div>
      </YeahCategory>

      <SessionsTabList>
        {sessions.map((session, index) => (
          <Button
            key={index}
            className={classnames({ "tab-active": sessionActive === index + 1 })}
            onClick={() => setSessionActive(index + 1)}
          >
            Sesi {index + 1}
          </Button>
        ))}
      </SessionsTabList>

      <ScoresTable
        className={classnames("table", "table-responsive", {
          "table-focused": shouldFocusOnWarning,
        })}
      >
        <thead>
          <tr>
            <th>End</th>
            <th>Shot</th>
            <th>X</th>
            <th>X+10</th>
            <th>Sum</th>
          </tr>
        </thead>

        <tbody>
          {scores.map((rambahan, rambahanIndex) => {
            const isCurrentRambahanActive = isEditMode;

            return (
              <tr key={rambahanIndex}>
                <td>
                  <span>{rambahanIndex + 1}</span>
                </td>

                <td>
                  {isCurrentRambahanActive ? (
                    <RambahanUhuy>
                      {rambahan.map((shot, shotIndex) => (
                        <SelectScore
                          key={shotIndex}
                          score={shot}
                          onChange={(value) => {
                            handleSelectScoreChange(rambahanIndex, shotIndex, value);
                          }}
                        />
                      ))}
                    </RambahanUhuy>
                  ) : (
                    <RambahanUhuy>
                      {rambahan.map((score, index) => (
                        <DisplayScoreItem key={index}>
                          {score === "m" ? "-" : score}
                        </DisplayScoreItem>
                      ))}
                    </RambahanUhuy>
                  )}
                </td>

                <td>
                  {rambahan.reduce((total, value) => {
                    if (typeof value === "string" && value.toLowerCase() === "x") {
                      return total + 1;
                    }
                    return total;
                  }, 0)}
                </td>

                <td>
                  {rambahan.reduce((total, value) => {
                    if (typeof value === "string" && value.toLowerCase() === "x") {
                      return total + 1;
                    }
                    return total;
                  }, 0)}
                </td>

                <td>{sumScoresList(rambahan)}</td>
              </tr>
            );
          })}
        </tbody>
      </ScoresTable>

      <EditorFooter>
        <div></div>
        <div>
          <DisplayScoreTotal>
            <div>Total:</div>
            <div>{40}</div>
          </DisplayScoreTotal>
        </div>
      </EditorFooter>
    </div>
  );
}

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
`;

const ButtonClose = styled(ButtonOutlineBlue)`
  border-color: transparent;

  &:hover,
  &:focus {
    background-color: transparent;
    color: var(--ma-blue);
  }

  &:disabled {
    border-color: transparent;
    background-color: transparent;
    color: var(--ma-gray-400);
    box-shadow: none;
  }
`;

const FormHeader = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  > div:first-child {
    flex: 1 0 100px;
  }
`;

const YeahCategory = styled.div`
  margin: 1rem 0;
  display: flex;
  gap: 1px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;

  > * {
    flex-grow: 1;
    padding: 0.5rem;
    background-color: var(--ma-primary-blue-50);
    color: var(--ma-blue);
    text-align: center;
    font-weight: 600;
  }
`;

const SessionsTabList = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;

  > *,
  > *:hover,
  > *:active,
  > *:focus {
    border-radius: 0;
    border: solid 1px transparent;
    background-color: transparent;

    &.tab-active {
      box-shadow: 0 -2px 0 0 var(--ma-blue);
    }
  }

  > *:hover {
    box-shadow: 0 -2px 0 0 var(--ma-blue);
  }
`;

const ScoresTable = styled.table`
  tbody > tr {
    cursor: default;
  }

  &.table-focused {
    border-radius: 0.25rem;
    box-shadow: 0 0 0 2px var(--ma-field-focused);
  }
`;

const RambahanUhuy = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const DisplayScoreItem = styled.div`
  min-width: 2rem;
  padding: 0.25rem 0.5rem;
  border: solid 1px var(--ma-gray-50);
  border-radius: 0.25rem;
  background-color: var(--ma-gray-50);
  text-transform: uppercase;
  text-align: center;
`;

const EditorFooter = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
`;

const DisplayScoreTotal = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  gap: 1rem;
  justify-content: content;
  align-items: center;
  font-weight: 600;

  > div:last-of-type {
    font-size: 1rem;
  }
`;

const SpacedButtonsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
`;

export { EditorContent };
