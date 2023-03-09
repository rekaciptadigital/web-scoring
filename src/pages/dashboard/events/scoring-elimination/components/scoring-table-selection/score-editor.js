import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-details";
import { useSubmitScore } from "../../hooks/submit-score";

import { AlertSubmitError } from "components/ma";
import { toast } from "components/ma/processing-toast";
import { EditorForm } from "./editor-form";
// import { ConfirmPrompt } from "../confirm-prompt";

import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

/**
 * Kontainer untuk render kondisional open/closed
 * Komponen yang kerja beneran di bawah: `<ScoreEditorControl />`
 */
function ScoreEditor({
  isLocked,
  isOpen = false,
  memberId,
  sessionNumbersList,
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
    isLocked,
    memberId,
    sessionNumbersList,
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
  isLocked,
  memberId,
  sessionNumbersList,
  scoreTotal,
  isLoading: isLoadingFromProp,
  onChange,
  onSaveSuccess,
  onClose,
}) {
  const [sessionNumber, setSessionNumber] = React.useState(1);

  const code = _makeEliminationCode(memberId, sessionNumber);
  const { data: scoreDetail, isLoading: isLoadingScore } =
    useScoringDetail(code);
  const {
    data: formValues,
    isDirty: isFormDirty,
    setFormValues,
    resetForm,
  } = useForm(scoreDetail);
  const {
    submitScore,
    isLoading: isSubmiting,
    isError,
    errors: errorsShotoff,
  } = useSubmitScore();

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

  const handleChangeSession = (targetSessionNumber) => {
    if (targetSessionNumber === sessionNumber) {
      return;
    }

    if (!isFormDirty) {
      resetForm();
      setSessionNumber(targetSessionNumber);
      return;
    }

    const payload = { code: code, shoot_scores: formValues };
    submitScore(payload, {
      onSuccess() {
        toast.success("Berhasil simpan skor");
        resetForm();
        setSessionNumber(targetSessionNumber);
        onSaveSuccess?.();
      },
      onError() {
        toast.error("Gagal menyimpan skor");
        // TODO: prompt retry / switch without saving anyway
      },
    });
  };

  const handleSaveScoreData = () => {
    const payload = { code: code, shoot_scores: formValues };
    submitScore(payload, {
      onSuccess() {
        toast.success("Berhasil simpan skor");
        onClose?.();
        onSaveSuccess?.();
      },
      onError() {
        toast.error("Gagal menyimpan skor");
        // TODO: prompt retry / switch without saving anyway
      },
    });
  };

  return (
    <ScoreEditorContainer>
      <AlertSubmitError isError={isError} errors={errorsShotoff} />
      <EditorHeader>
        {sessionNumbersList ? (
          <EditorHeaderContent>
            <SessionTabList
              sessions={sessionNumbersList}
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
          <EditorCloseButton flexible onClick={handleSaveScoreData}>
            <IconX size="16" />
          </EditorCloseButton>
        </div>
      </EditorHeader>

      <EditorForm
        key={sessionNumber}
        viewMode={isLocked}
        isLoading={isLoadingForm}
        scoresData={formValues}
        onChange={(scoresData) => setFormValues(scoresData)}
      />
    </ScoreEditorContainer>
  );
}

function SessionTabList({ sessions, currentSession = 1, onChange }) {
  const _checkIsTabActive = (sessionNumber) => {
    return parseInt(sessionNumber) === parseInt(currentSession);
  };

  if (!sessions) {
    return (
      <SessionTabListContainer>
        <li>Data sesi eliminasi tidak tersedia</li>
      </SessionTabListContainer>
    );
  }

  return (
    <SessionTabListContainer>
      {sessions.map((sessionNumber) => (
        <li key={sessionNumber}>
          <SessionTabButton
            disabled={_checkIsTabActive(sessionNumber)}
            className={classnames({
              "session-tab-active": _checkIsTabActive(sessionNumber),
            })}
            onClick={() => onChange?.(parseInt(sessionNumber))}
          >
            Eli-{sessionNumber}
          </SessionTabButton>
        </li>
      ))}
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

  const setFormValues = (payload) =>
    dispatch({ type: "CHANGE", payload: payload });
  const resetForm = () => dispatch({ type: "RESET" });
  const markFormAsDirty = () => dispatch({ type: "FORCE_MARKED_DIRTY" });

  return { ...formState, setFormValues, markFormAsDirty, resetForm };
}

/* =============================== */
// utils

function _makeEliminationCode(memberId, sessionNumber) {
  if (!memberId || !sessionNumber) {
    return null;
  }
  const SCORING_TYPE_NUMBER = 4;
  return `${SCORING_TYPE_NUMBER}-${memberId}-${sessionNumber}`;
}

export { ScoreEditor };
