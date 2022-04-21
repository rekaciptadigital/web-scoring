import * as React from "react";
import styled from "styled-components";

import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ScoreEditor({ sessionNumbersList, onSaveSuccess, onClose }) {
  const [activeSessionNumber, setActiveSessionNumber] = React.useState(1);
  return (
    <ScoreEditorContainer>
      <EditorHeader>
        {sessionNumbersList ? (
          <EditorHeaderContent>
            <SessionTabList
              sessions={sessionNumbersList}
              currentSession={activeSessionNumber}
              onChange={setActiveSessionNumber}
            />
            <StatsScoreAccumulation>
              <span>Akumulasi Skor</span>
              <span>360</span>
            </StatsScoreAccumulation>
          </EditorHeaderContent>
        ) : (
          <EditorHeaderContent></EditorHeaderContent>
        )}

        <div>
          <EditorCloseButton flexible onClick={() => onClose?.()}>
            <IconX size="16" />
          </EditorCloseButton>
        </div>
      </EditorHeader>

      <SessionContainer key={activeSessionNumber}>
        {sessionNumbersList ? (
          <EditorBody>
            <ScoresTable className="table table-responsive">
              <thead>
                <tr>
                  <th>End</th>
                  <th colSpan="6">Shot</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4, 5, 6].map((id, indexRambahan) => (
                  <tr key={id}>
                    <td>{indexRambahan + 1}</td>

                    {[1, 2, 3, 4, 5, 6].map((id, indexShot) => (
                      <td key={id}>
                        <select
                          name={`shot-score-${indexRambahan}-${indexShot}`}
                          id={`shot-score-${indexRambahan}-${indexShot}`}
                          defaultValue={""}
                          onChange={(ev) => {
                            alert(`Simpan nilai jadi ${ev.target.value}`);
                            onSaveSuccess?.();
                          }}
                        >
                          <option value="" disabled>
                            &ndash;
                          </option>
                          {["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => (
                            <option key={value} value={value}>
                              {isNaN(value) ? value.toUpperCase() : value}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}

                    <td>60</td>
                  </tr>
                ))}
              </tbody>
            </ScoresTable>

            <ShotOffBar>
              <div>
                <div>S-Off</div>
                <div>
                  {[1, 2, 3].map((number) => (
                    <select
                      key={number}
                      name={`shot-off-score`}
                      id={`shot-off-score`}
                      defaultValue={""}
                      onChange={(ev) => {
                        alert(`Simpan nilai jadi ${ev.target.value}`);
                        onSaveSuccess?.();
                      }}
                    >
                      <option value="" disabled>
                        &ndash;
                      </option>
                      {["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => (
                        <option key={value} value={value}>
                          {isNaN(value) ? value.toUpperCase() : value}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>

              <div>29</div>
            </ShotOffBar>
          </EditorBody>
        ) : (
          <EditorBody>
            <EmptySession>Data sesi skoring tidak tersedia</EmptySession>
          </EditorBody>
        )}

        <EditorFooter>
          <StatItem>
            <span>X+10:</span>
            <span>20</span>
          </StatItem>

          <StatItem>
            <span>X:</span>
            <span>10</span>
          </StatItem>

          <StatItem>
            <span>Total:</span>
            <TotalNumber>360</TotalNumber>
          </StatItem>
        </EditorFooter>
      </SessionContainer>
    </ScoreEditorContainer>
  );
}

function SessionTabList({ sessions, currentSession = 1, onChange }) {
  if (!sessions) {
    return (
      <SessionTabListContainer>
        <li>Data sesi tidak tersedia</li>
      </SessionTabListContainer>
    );
  }

  return (
    <SessionTabListContainer>
      {sessions.map((sessionNumber) => (
        <li key={sessionNumber}>
          <SessionTabButton
            className={classnames({
              "session-tab-active": parseInt(sessionNumber) === parseInt(currentSession),
            })}
            onClick={() => onChange?.(parseInt(sessionNumber))}
          >
            Sesi {sessionNumber}
          </SessionTabButton>
        </li>
      ))}
    </SessionTabListContainer>
  );
}

const ScoreEditorContainer = styled.div`
  position: sticky;
  top: var(--ma-header-height);
  bottom: 0;
  padding: 0.5rem;
  background-color: var(--ma-gray-50);

  > * + * {
    margin-top: 0.5rem;
  }
`;

const EditorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
    align-self: flex-start;
  }
`;

const SessionContainer = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

const EditorHeaderContent = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const StatsScoreAccumulation = styled.div`
  > * + * {
    margin-left: 1rem;
  }

  > *:nth-child(2) {
    color: var(--ma-blue);
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

const EditorBody = styled.div`
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const EditorFooter = styled.div`
  padding: 0.75rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 3rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
`;

const TotalNumber = styled.span`
  font-size: 1.125rem;
`;

const SessionTabListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  gap: 0.5rem;
`;

const SessionTabButton = styled.button`
  border: none;
  padding: 0.25rem 0.5rem;
  padding-bottom: 0;
  background-color: transparent;

  color: var(--ma-gray-400);
  font-size: 0.875rem;
  font-weight: 600;

  transition: all 0.15s;

  position: relative;

  &::before {
    content: " ";
    position: absolute;
    height: 2px;
    top: 0;
    left: 0.5rem;
    width: 40%;
    background-color: transparent;
    transition: all 0.3s;
    transform: scaleX(0);
    transform-origin: left;
  }

  &:hover {
    color: var(--ma-blue);
  }

  &.session-tab-active {
    color: var(--ma-blue);

    &::before {
      background-color: #90aad4;
      transform: scaleX(1);
    }
  }
`;

const EditorCloseButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  background-color: transparent;
  color: var(--ma-blue);

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

const EmptySession = styled.div`
  min-width: 30rem;
  min-height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ma-gray-400);
  font-weight: 600;
`;

const ScoresTable = styled.table`
  margin: 0;

  th {
    color: var(--ma-txt-black);
    font-weight: 600;
  }

  td {
    text-align: center;
    vertical-align: middle;
  }
`;

const ShotOffBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;

  > *:nth-child(1) {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
  }
`;

export { ScoreEditor };
