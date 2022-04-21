import * as React from "react";
import styled from "styled-components";

import { EditorForm } from "./editor-form";

import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ScoreEditor({ memberId, sessionNumbersList, scoreTotal, onSaveSuccess, onClose }) {
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
            {!isNaN(scoreTotal) && (
              <StatsScoreAccumulation>
                <span>Akumulasi Skor</span>
                <span>{scoreTotal}</span>
              </StatsScoreAccumulation>
            )}
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

      <EditorForm
        key={activeSessionNumber}
        memberId={memberId}
        sessionNumber={activeSessionNumber}
        onSaveSuccess={onSaveSuccess}
      />
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

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

// eslint-disable-next-line no-unused-vars
const EmptySession = styled.div`
  min-width: 30rem;
  min-height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ma-gray-400);
  font-weight: 600;
`;

export { ScoreEditor };
