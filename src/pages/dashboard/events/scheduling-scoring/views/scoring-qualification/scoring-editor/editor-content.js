import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "utils/hooks/wizard-view";
import { useScoringDetail } from "./hooks/scoring-detail";
import { useScoreGrid } from "./hooks/score-grid";

import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { SelectScore } from "./select-score";
import { FieldInputBudrestNo } from "./field-input-budrest-no";

import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconCross from "components/ma/icons/mono/cross";

import classnames from "classnames";

/**
 * Butuh data:
 * 1. KEPERLUAN DISPLAY:
 *    - nomor peserta
 *    - nama peserta
 *    - kategori:
 *      - competition category: contoh, "Barebow"
 *      - age category: contoh, "Umum" | "U-15" | ...
 *      - distance category: contoh, "50m"
 *
 * 2. KEPERLUAN FORM INPUT SKOR:
 *    - nomor bantalan/target:
 *      - init: ""
 *      - refetch setelah submit: contoh, "1B"
 *    - detail skor, dalam bentuk grid, dikelompokkan per sesi
 *      - init: masing-masing, "" | "m"
 *      - refetch setelah submit: masing-masing, data terakhir yang disubmit
 */

function EditorContent({ onClose, id: scheduleId }) {
  const [isEditMode, setEditMode] = React.useState(false);

  const {
    data: scoringDetail,
    dispatch: dispatchScoring,
    refetch: refetchScoringDetail,
  } = useScoringDetail({
    code: undefined,
    type: undefined,
    scheduleId,
  });

  const { sessions } = scoringDetail || {};
  const sessionSteps = React.useMemo(() => {
    return makeSessionStepsFromData(sessions);
  }, [sessions]);

  const { currentStep: currentSession, goToStep: goToSession } = useWizardView(sessionSteps);

  const currentGridData = React.useMemo(() => {
    return sessions?.[currentSession].scores;
  }, [sessions, currentSession]);

  const {
    data: currentGrid,
    status: submitStatus,
    setScore,
    resetGrid,
    dispatchSubmit,
  } = useScoreGrid(currentGridData);

  const isSubmitLoading = submitStatus === "loading";

  const handleCancelSessionGrid = () => {
    resetGrid();
    setEditMode(false);
  };

  const handleSubmitSessionGrid = async () => {
    dispatchSubmit({ status: "loading", errors: null });

    const payload = {
      schedule_id: scoringDetail.scheduleId,
      target_no: scoringDetail.targetNo,
      type: scoringDetail.type,
      save_permanent: 0,
      sessions: {
        ...scoringDetail.sessions,
        [currentSession]: {
          ...scoringDetail.sessions[currentSession],
          scores: currentGrid,
        },
      },
    };
    // TODO: ganti ke service beneran
    console.log("simpan! Hit API ->", payload);
    alert(`simpan! Hit API -> ${JSON.stringify(payload)}`);
    const result = await FakeService.setScore(payload);

    if (result.success) {
      dispatchSubmit({ status: "success" });
      refetchScoringDetail();
      setEditMode(false);
    } else {
      dispatchSubmit({ status: "error", errors: result.errors || result.message });
      // TODO: alert handle error submit dari API
    }
  };

  return (
    <div>
      <EditorHeader>
        <div>
          <h4>Scoresheet</h4>
        </div>

        <div className="float-end">
          <ButtonClose disabled={isEditMode} onClick={() => !isEditMode && onClose()}>
            <IconCross size="16" /> Tutup
          </ButtonClose>
        </div>
      </EditorHeader>

      {scoringDetail && (
        <FormHeader>
          <div>
            <FieldInputBudrestNo
              isAutoFocus
              value={scoringDetail?.targetNo || ""}
              onChange={(value) => {
                dispatchScoring({
                  type: "CHANGE_TARGET_NO",
                  payload: value,
                });
              }}
            >
              Bantalan
            </FieldInputBudrestNo>
          </div>

          {isEditMode ? (
            <SpacedButtonsGroup>
              <Button onClick={handleCancelSessionGrid}>Batal</Button>

              <ButtonBlue onClick={handleSubmitSessionGrid}>Simpan</ButtonBlue>
            </SpacedButtonsGroup>
          ) : (
            <SpacedButtonsGroup>
              <ButtonBlue disabled={!scoringDetail.targetNo} onClick={() => setEditMode(true)}>
                Ubah Skor
              </ButtonBlue>
            </SpacedButtonsGroup>
          )}
        </FormHeader>
      )}

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

      {scoringDetail ? (
        <React.Fragment>
          <SessionsTabList>
            {sessionSteps.map((session) => (
              <ButtonSession
                key={session.step}
                className={classnames({
                  "tab-active": scoringDetail.targetNo && currentSession === session.step,
                })}
                disabled={isEditMode || !scoringDetail.targetNo}
                onClick={() => goToSession(session.step)}
              >
                {session.label}
              </ButtonSession>
            ))}
          </SessionsTabList>

          {currentGrid ? (
            <ScoresTable key={currentSession} className="table table-responsive">
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
                {Object.keys(currentGrid).map((rambahanId, rambahanIndex) => {
                  const rambahan = currentGrid[rambahanId];
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
                                  setScore({ rambahan: rambahanIndex + 1, shot: shotIndex, value });
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
                          if (
                            (typeof value === "string" && value.toLowerCase() === "x") ||
                            value === 10
                          ) {
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
          ) : (
            <div>Ada kesalahan dalam memproses data input skor. Silakan coba lagi.</div>
          )}
        </React.Fragment>
      ) : (
        <div>Sedang memuat data skor...</div>
      )}

      <EditorFooter>
        <div></div>
        <div>
          <DisplayScoreTotal>
            <div>Total:</div>
            <div>{sumEntireTotal(currentGrid)}</div>
          </DisplayScoreTotal>
        </div>
      </EditorFooter>

      <LoadingScreen loading={isSubmitLoading} />
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
`;

const ButtonSession = styled(Button)`
  &,
  &:hover,
  &:active,
  &:focus {
    border-radius: 0;
    border: solid 1px transparent;
    background-color: transparent;

    &.tab-active {
      box-shadow: 0 -2px 0 0 var(--ma-blue);
    }
  }

  &:hover {
    box-shadow: 0 -2px 0 0 var(--ma-blue);
  }

  &:disabled {
    box-shadow: none;
    border-color: transparent;
    background-color: transparent;
    color: var(--ma-gray-400);

    &.tab-active {
      box-shadow: 0 -2px 0 0 var(--ma-blue);
      color: var(--ma-blue);
    }
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

// util
function makeSessionStepsFromData(data) {
  if (!data) {
    return [];
  }
  return Object.keys(data).map((groupId, index) => ({
    step: parseInt(groupId),
    label: `Sesi ${index + 1}`,
  }));
}

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

function sumEntireTotal(gridData) {
  if (!gridData) {
    return 0;
  }
  const total = Object.keys(gridData).reduce((total, id) => {
    return total + sumScoresList(gridData[id]);
  }, 0);

  return total;
}

const FakeService = {};
FakeService.setScore = function (payload, params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: null, message: "Success", debug: { payload, params } });
    }, 800);
  });
};

export { EditorContent };
