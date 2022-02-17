import * as React from "react";
import styled from "styled-components";
import { useWizardView } from "utils/hooks/wizard-view";
import { useScoringDetail } from "./hooks/scoring-detail";
import { useScoreGrid } from "./hooks/score-grid";
import { ScoringService } from "services";

import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue, SpinnerDotBlock } from "components/ma";
import { SelectScore } from "./select-score";
import { FieldInputBudrestNo } from "./field-input-budrest-no";

import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconCross from "components/ma/icons/mono/cross";

import classnames from "classnames";
import { makeSessionStepsFromData, sumScoresList, sumEntireTotal } from "./utils";

function EditorContent({ rowItem, code, targetNumber, onClose, onSuccess }) {
  const [currentCode, setCurrentCode] = React.useState(code);
  const [targetNo, setTargetNo] = React.useState(targetNumber);
  const [isEditMode, setEditMode] = React.useState(false);

  const {
    data: scoringDetail,
    status: scoringDetailStatus,
    refetch: refetchScoringDetail,
  } = useScoringDetail({ code: currentCode });

  const sessionSteps = makeSessionStepsFromData(rowItem.sessions);
  const { currentStep: currentSession, goToStep: goToSession } = useWizardView(sessionSteps);

  const handleSwitchSession = (sessionNumber) => {
    const { member } = rowItem;
    goToSession(sessionNumber);
    setCurrentCode(`1-${member.id}-${sessionNumber}`);
    refetchScoringDetail();
  };

  const {
    data: currentGrid,
    status: submitStatus,
    setScore,
    resetGrid,
    dispatchSubmit,
  } = useScoreGrid(scoringDetail?.score);

  const handleCancelSessionGrid = () => {
    resetGrid();
    setEditMode(false);
  };

  const handleSubmitSessionGrid = async () => {
    dispatchSubmit({ status: "loading", errors: null });

    const payload = {
      save_permanent: 1,
      code: currentCode,
      target_no: targetNo,
      shoot_scores: currentGrid,
    };
    const result = await ScoringService.saveParticipantScore(payload);

    if (result.success) {
      dispatchSubmit({ status: "success" });
      refetchScoringDetail();
      setEditMode(false);
      onSuccess?.();
    } else {
      dispatchSubmit({ status: "error", errors: result.errors || result.message });
      // TODO: alert handle error submit dari API
    }
  };

  const isLoadingScoringDetail = scoringDetailStatus === "loading";
  const isLoadingSubmit = submitStatus === "loading";

  const computeCategoryLabel = () => {
    const { competitionCategoryDetail, ageCategoryDetail } = scoringDetail.category;
    return `${competitionCategoryDetail.label} ${ageCategoryDetail.label}`;
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

      {!scoringDetail && isLoadingScoringDetail ? (
        <SpinnerDotBlock />
      ) : scoringDetail ? (
        <React.Fragment>
          <FormHeader>
            <div>
              <FieldInputBudrestNo
                isAutoFocus
                value={targetNo || ""}
                onChange={(value) => setTargetNo(value)}
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
                <ButtonBlue onClick={() => setEditMode(true)}>Ubah Skor</ButtonBlue>
              </SpacedButtonsGroup>
            )}
          </FormHeader>

          <YeahCategory>
            <div>{rowItem.member.participantNumber}</div>
            <div>{rowItem.member.name}</div>
            <div>
              <IconBow size="16" /> {computeCategoryLabel()}
            </div>
            <div>
              <IconDistance size="16" /> {scoringDetail.category.distanceDetail.label}
            </div>
          </YeahCategory>

          <SessionsTabList>
            {sessionSteps.map((session) => (
              <ButtonSession
                key={session.step}
                className={classnames({ "tab-active": currentSession === session.step })}
                disabled={isEditMode}
                onClick={() => handleSwitchSession(session.step)}
              >
                {session.label}
              </ButtonSession>
            ))}
          </SessionsTabList>

          <SectionTableContainer>
            <TableLoadingIndicator isLoading={isLoadingScoringDetail} />
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
                  {Object.keys(currentGrid).map((rambahanIdKey) => {
                    const rambahan = currentGrid[rambahanIdKey];
                    const rambahanId = parseInt(rambahanIdKey);
                    return (
                      <tr key={rambahanIdKey}>
                        <td>
                          <span>{rambahanIdKey}</span>
                        </td>

                        <td>
                          {isEditMode ? (
                            <RambahanUhuy>
                              {rambahan.map((shot, shotIndex) => (
                                <SelectScore
                                  key={shotIndex}
                                  score={shot}
                                  onChange={(value) => {
                                    setScore({
                                      rambahan: rambahanId,
                                      shot: shotIndex,
                                      value,
                                    });
                                  }}
                                />
                              ))}
                            </RambahanUhuy>
                          ) : (
                            <RambahanUhuy>
                              {rambahan.map((score, index) => (
                                <DisplayScoreItem key={index}>
                                  {!score ? "-" : score}
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
          </SectionTableContainer>

          <EditorFooter>
            <div></div>
            <div>
              <DisplayScoreTotal>
                <div>Total:</div>
                <div>{sumEntireTotal(currentGrid)}</div>
              </DisplayScoreTotal>
            </div>
          </EditorFooter>
        </React.Fragment>
      ) : (
        <div>
          Ada error dalam mengambil data scoring. Silakan coba kembali beberapa saat lagi, atau
          hubungi technical support.
        </div>
      )}

      <LoadingScreen loading={isLoadingSubmit} />
    </div>
  );
}

function TableLoadingIndicator({ isLoading }) {
  if (!isLoading) {
    return null;
  }
  return (
    <LoaderContainer>
      <SpinnerDotBlock />
    </LoaderContainer>
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

const SectionTableContainer = styled.div`
  position: relative;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
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
