import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-details";
import { useSubmitScore } from "../../hooks/submit-score";

import { EditorForm } from "./editor-form";
import { EditorFormShootOff } from "./editor-form-shootoff";

import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

/**
 * Kontainer untuk render kondisional open/closed
 * Komponen yang kerja beneran di bawah: `<ScoreEditorControl />`
 */
function ScoreEditor({
  isOpen = false,
  memberId,
  sessionNumbersList,
  hasShootOff = false,
  scoreTotal,
  isLoading,
  onChange,
  onSaveSuccess,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  const controlProps = {
    memberId,
    sessionNumbersList,
    hasShootOff,
    scoreTotal,
    isLoading,
    onChange,
    onSaveSuccess,
    onClose,
  };

  return (
    <div>
      <ScoreEditorControl {...controlProps} />
    </div>
  );
}

function ScoreEditorControl({
  memberId,
  sessionNumbersList,
  hasShootOff = false,
  scoreTotal,
  isLoading: isLoadingFromProp,
  onChange,
  onSaveSuccess,
  onClose,
}) {
  const [sessionNumber, setSessionNumber] = React.useState(1);

  const code = _makeQualificationCode(memberId, sessionNumber);
  const { data: scoreDetail, isLoading: isLoadingScore } = useScoringDetail(code);
  const { data: formValues, isDirty: isFormDirty, setFormValues, resetForm } = useForm(scoreDetail);
  const {
    data: formShootOffValue,
    isDirty: isFormShootOffDirty,
    setShotOffValue,
    resetFormShootOff,
  } = useFormShootOff(scoreDetail);
  const { submitScore, isLoading: isSubmiting } = useSubmitScore();

  const isLoadingForm = isLoadingFromProp || isLoadingScore || isSubmiting;

  // On change dari form skoring biasa
  React.useEffect(() => {
    if (!formValues || !onChange) {
      return;
    }

    const editorValue = {
      sessionNumber: sessionNumber,
      sessionCode: code,
      value: formValues,
      isDirty: isFormDirty,
    };

    onChange?.(editorValue);
  }, [isFormDirty, sessionNumber, code, formValues]);

  // On change dari form skoring shoot off
  React.useEffect(() => {
    if (!formShootOffValue || !onChange) {
      return;
    }

    const editorValueShootOff = {
      sessionNumber: sessionNumber,
      sessionCode: code,
      value: formShootOffValue?.map?.((shot) => ({
        score: shot.score,
        distance_from_x: shot.distance,
      })),
      isDirty: isFormShootOffDirty,
    };

    onChange?.(editorValueShootOff);
  }, [isFormShootOffDirty, sessionNumber, code, formShootOffValue]);

  const handleChangeSession = (targetSessionNumber) => {
    if (targetSessionNumber === sessionNumber) {
      return;
    }

    if (sessionNumber === 11) {
      // shoot off
      if (!isFormShootOffDirty) {
        resetFormShootOff();
        setSessionNumber(targetSessionNumber);
        return;
      }

      const payload = { code: code, shoot_scores: formShootOffValue };
      submitScore(payload, {
        onSuccess() {
          resetFormShootOff();
          setSessionNumber(targetSessionNumber);
          onSaveSuccess?.();
        },
        onError() {
          // TODO: prompt retry / switch without saving anyway
        },
      });
    } else {
      // sesi biasa
      if (!isFormDirty) {
        resetForm();
        setSessionNumber(targetSessionNumber);
        return;
      }

      const payload = { code: code, shoot_scores: formValues };
      submitScore(payload, {
        onSuccess() {
          resetForm();
          setSessionNumber(targetSessionNumber);
          onSaveSuccess?.();
        },
        onError() {
          // TODO: prompt retry / switch without saving anyway
        },
      });
    }
  };

  const handleCloseEditor = () => {
    if (!isFormDirty) {
      onClose?.();
      return;
    }

    const payload = { code: code, shoot_scores: formValues };
    submitScore(payload, {
      onSuccess() {
        onClose?.();
        onSaveSuccess?.();
      },
      onError() {
        // TODO: prompt retry / switch without saving anyway
      },
    });
  };

  return (
    <ScoreEditorContainer>
      <EditorHeader>
        {sessionNumbersList ? (
          <EditorHeaderContent>
            <SessionTabList
              sessions={sessionNumbersList}
              hasShootOff={hasShootOff}
              currentSession={sessionNumber}
              onChange={handleChangeSession}
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
          <EditorCloseButton flexible onClick={handleCloseEditor}>
            <IconX size="16" />
          </EditorCloseButton>
        </div>
      </EditorHeader>

      {sessionNumber === 11 ? (
        hasShootOff ? (
          <EditorFormShootOff
            key={sessionNumber}
            isLoading={isLoadingForm}
            shootOffData={formShootOffValue}
            onChange={(shootOffData) => setShotOffValue(shootOffData)}
          />
        ) : (
          <EmptySheetBox>Shoot off tidak diberlakukan</EmptySheetBox>
        )
      ) : (
        <EditorForm
          key={sessionNumber}
          isLoading={isLoadingForm}
          scoresData={formValues}
          onChange={(scoresData) => setFormValues(scoresData)}
        />
      )}
    </ScoreEditorContainer>
  );
}

function SessionTabList({ sessions, hasShootOff, currentSession = 1, onChange }) {
  const _checkIsTabActive = (sessionNumber) => {
    return parseInt(sessionNumber) === parseInt(currentSession);
  };
  const isShootOffActive = parseInt(currentSession) === 11;

  // Balik ke tab sesi 1 kalau state peserta berubah
  // jadi gak punya shoot off
  React.useEffect(() => {
    if (hasShootOff || !isShootOffActive) {
      return;
    }
    onChange?.(1);
  }, [hasShootOff]);

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
            disabled={_checkIsTabActive(sessionNumber)}
            className={classnames({ "session-tab-active": _checkIsTabActive(sessionNumber) })}
            onClick={() => onChange?.(parseInt(sessionNumber))}
          >
            Sesi {sessionNumber}
          </SessionTabButton>
        </li>
      ))}

      {/* Tab spesial shoot off */}
      <li>
        <SessionTabButton
          title={!hasShootOff ? "Shoot Off tidak diberlakukan" : undefined}
          disabled={isShootOffActive || !hasShootOff}
          className={classnames({
            "session-tab-active": isShootOffActive,
            "shootoff-tab-disabled": !hasShootOff,
          })}
          onClick={() => onChange?.(11)}
        >
          S-Off
        </SessionTabButton>
      </li>
    </SessionTabListContainer>
  );
}

/* ============================= */
// styles

const ScoreEditorContainer = styled.div`
  position: sticky;
  top: var(--ma-header-height);
  bottom: 0;
  min-width: 31rem;
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

  &.shootoff-tab-disabled {
    color: var(--ma-gray-200);

    &:disabled {
      color: var(--ma-gray-200);
    }
  }

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

const EmptySheetBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0.5rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  color: var(--ma-gray-200);
  font-weight: 600;
`;

/* ========================= */
// hook

const defaultFormState = { data: null, isDirty: false };

function useForm(scoreDetail) {
  const [formState, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "RESET": {
        return defaultFormState;
      }

      case "INIT": {
        return { ...defaultFormState, data: action.payload };
      }

      case "CHANGE": {
        return { isDirty: true, data: action.payload };
      }

      case "FORCE_MARKED_DIRTY": {
        return { ...state, isDirty: true };
      }

      default: {
        return state;
      }
    }
  }, defaultFormState);

  React.useEffect(() => {
    const isRegularSession = parseInt(scoreDetail?.session) !== 11;
    if (!scoreDetail?.score || !isRegularSession) {
      return;
    }
    dispatch({ type: "INIT", payload: scoreDetail.score });
  }, [scoreDetail]);

  const setFormValues = (payload) => dispatch({ type: "CHANGE", payload: payload });
  const resetForm = () => dispatch({ type: "RESET" });
  const markFormAsDirty = () => dispatch({ type: "FORCE_MARKED_DIRTY" });

  return { ...formState, setFormValues, markFormAsDirty, resetForm };
}

function useFormShootOff(scoreDetail) {
  const [formState, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "RESET": {
        return defaultFormState;
      }

      case "INIT": {
        return { ...defaultFormState, data: action.payload };
      }

      case "CHANGE": {
        return { isDirty: true, data: action.payload };
      }

      default: {
        return state;
      }
    }
  }, defaultFormState);

  React.useEffect(() => {
    const isShootOffSession = parseInt(scoreDetail?.session) === 11;
    if (!scoreDetail?.score || !isShootOffSession) {
      return;
    }
    dispatch({ type: "INIT", payload: scoreDetail.score });
  }, [scoreDetail]);

  const setShotOffValue = (payload) => {
    dispatch({ type: "CHANGE", payload: payload });
  };
  const resetFormShootOff = () => dispatch({ type: "RESET" });

  return { ...formState, setShotOffValue, resetFormShootOff };
}

/* =============================== */
// utils

function _makeQualificationCode(memberId, sessionNumber) {
  if (!memberId || !sessionNumber) {
    return null;
  }
  return `1-${memberId}-${sessionNumber}`;
}

export { ScoreEditor };
