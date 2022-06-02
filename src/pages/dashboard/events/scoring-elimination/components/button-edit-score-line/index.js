import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-detail";
import { useSubmitScores } from "../../hooks/submit-scores";
import { useGridForm } from "../../hooks/grid-form.js";
import { useAdminTotal } from "../../hooks/admin-total";
import { useSubmitAdminTotal } from "../../hooks/submit-total";

import { Modal as BSModal, ModalBody } from "reactstrap";
import {
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
  SpinnerDotBlock,
  LoadingScreen,
  AlertSubmitError,
} from "components/ma";
import { toast } from "../processing-toast";
import { ScoreGridForm } from "./components/score-grid-form";
import { ScoreGridFormRight } from "./components/score-grid-form-right";

import IconEdit from "components/ma/icons/mono/edit";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";
import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";

import classnames from "classnames";

function ButtonEditScoreLine({ disabled, scoring, headerInfo, onSuccessSubmit, categoryDetails }) {
  const [isOpen, setOpen] = React.useState(false);

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonOutlineBlue
        flexible
        title={disabled ? undefined : "Edit detail skor"}
        onClick={open}
        disabled={disabled}
      >
        <span>Edit</span>{" "}
        <span>
          <IconEdit size="16" />
        </span>
      </ButtonOutlineBlue>

      {isOpen && (
        <ModalEditor
          headerInfo={headerInfo}
          onClose={close}
          scoring={scoring}
          onSuccessSubmit={onSuccessSubmit}
          categoryDetails={categoryDetails}
        />
      )}
    </React.Fragment>
  );
}

function ModalEditor({ headerInfo, onClose, scoring, onSuccessSubmit, categoryDetails }) {
  // "query"
  const {
    isError: isErrorScoringDetail,
    errors: errorsScoringDetail,
    data: scoringDetails,
    fetchScoringDetail,
  } = useScoringDetail(scoring);

  const isSettled = Boolean(scoringDetails) || (!scoringDetails && isErrorScoringDetail);
  const headerPlayer1 = headerInfo?.teams[0];
  const headerPlayer2 = headerInfo?.teams[1];
  const player1 = scoringDetails?.[0];
  const player2 = scoringDetails?.[1];

  const { value: gridDataPlayer1, setValue: setGridDataPlayer1 } = useGridForm(player1?.scores);
  const { value: gridDataPlayer2, setValue: setGridDataPlayer2 } = useGridForm(player2?.scores);

  const {
    isDirty: isDirtyTotalP1,
    value: adminTotalP1,
    setTotal: setTotalP1,
  } = useAdminTotal(player1?.scores);

  const {
    isDirty: isDirtyTotalP2,
    value: adminTotalP2,
    setTotal: setTotalP2,
  } = useAdminTotal(player2?.scores);

  // mutate
  const {
    submitScoringDetail,
    isLoading: isSubmiting,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitScores();

  const { submitAdminTotal, isLoading: isSubmitingTotal } = useSubmitAdminTotal({
    eliminationId: scoring.elimination_id,
    round: scoring.round,
    match: scoring.match,
  });

  const onSuccess = () => {
    toast.success("Detail skor berhasil disimpan");
    fetchScoringDetail();
    onSuccessSubmit?.();
  };

  if (!isSettled) {
    return (
      <React.Fragment>
        <AlertSubmitError
          isError={isErrorScoringDetail}
          errors={errorsScoringDetail}
          onConfirm={onClose}
        />
        <LoadingScreen loading />
      </React.Fragment>
    );
  }

  if (!scoringDetails && isErrorScoringDetail) {
    return <AlertSubmitError isError errors={errorsScoringDetail} onConfirm={onClose} />;
  }

  return (
    <React.Fragment>
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />
      <AlertSubmitError isError={isErrorScoringDetail} errors={errorsScoringDetail} />

      <Modal isOpen centered backdrop="static" size="lg" autoFocus onClosed={onClose}>
        <ModalBody>
          <LoadingBlocker isLoading={isSubmitingTotal || isSubmiting} />
          <BodyWrapper>
            <div>
              <h4>Scoresheet</h4>

              <ScoresheetHeader>
                <BudrestNumberLabel>{scoringDetails?.budrestNumber || "-"}</BudrestNumberLabel>

                <PlayerLabelContainerLeft>
                  <PlayerNameData>
                    <RankLabel>
                      #{headerPlayer1?.potition || headerPlayer1?.postition || "-"}
                    </RankLabel>
                    <NameLabel>
                      {player1?.participant.member.name || headerPlayer1?.name || "-"}
                    </NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerLeft>

                <HeadToHeadScores>
                  <HeaderScoreInput>
                    {player1?.scores.isDifferent ? (
                      <IndicatorIconFloating className="indicator-left indicator-warning">
                        <IconAlertCircle />
                      </IndicatorIconFloating>
                    ) : (
                      <IndicatorIconFloating className="indicator-left indicator-valid">
                        <IconCheckOkCircle />
                      </IndicatorIconFloating>
                    )}

                    <ScoreInput
                      type="text"
                      placeholder="-"
                      value={adminTotalP1 || ""}
                      onChange={(ev) => {
                        setTotalP1((previousValue) => {
                          const { value } = ev.target;
                          const validatedNumberValue = isNaN(value) ? previousValue : Number(value);
                          return validatedNumberValue;
                        });
                      }}
                    />
                  </HeaderScoreInput>

                  <HeadToHeadScoreLabels>
                    <ScoreCounter
                      className={classnames({
                        "score-counter-highlighted":
                          player1?.scores?.adminTotal > player2?.scores?.adminTotal,
                      })}
                    >
                      {player1?.scores?.adminTotal || 0}
                    </ScoreCounter>

                    <span>&ndash;</span>

                    <ScoreCounter
                      className={classnames({
                        "score-counter-highlighted":
                          player2?.scores?.adminTotal > player1?.scores?.adminTotal,
                      })}
                    >
                      {player2?.scores?.adminTotal || 0}
                    </ScoreCounter>
                  </HeadToHeadScoreLabels>

                  <HeaderScoreInput>
                    <ScoreInput
                      type="text"
                      placeholder="-"
                      value={adminTotalP2 || ""}
                      onChange={(ev) => {
                        setTotalP2((previousValue) => {
                          const { value } = ev.target;
                          const validatedNumberValue = isNaN(value) ? previousValue : Number(value);
                          return validatedNumberValue;
                        });
                      }}
                    />

                    {player2?.scores.isDifferent ? (
                      <IndicatorIconFloating className="indicator-right indicator-warning">
                        <IconAlertCircle />
                      </IndicatorIconFloating>
                    ) : (
                      <IndicatorIconFloating className="indicator-right indicator-valid">
                        <IconCheckOkCircle />
                      </IndicatorIconFloating>
                    )}
                  </HeaderScoreInput>
                </HeadToHeadScores>

                <PlayerLabelContainerRight>
                  <PlayerNameData>
                    <RankLabel>
                      #{headerPlayer2?.potition || headerPlayer2?.postition || "-"}
                    </RankLabel>
                    <NameLabel>
                      {player2?.participant.member.name ||
                        headerPlayer2?.name ||
                        "Nama archer tidak tersedia"}
                    </NameLabel>
                  </PlayerNameData>
                </PlayerLabelContainerRight>
              </ScoresheetHeader>

              <CategoryLabel>
                <div>{categoryDetails?.teamCategoryLabel}</div>
                <div>
                  <IconBow size="16" />{" "}
                  {categoryDetails?.originalCategoryDetail.competitionCategoryId}{" "}
                  {categoryDetails?.originalCategoryDetail.ageCategoryId}
                </div>
                <div>
                  <IconDistance size="16" />{" "}
                  {_getDistanceCategoryLabel(categoryDetails?.originalCategoryDetail.classCategory)}
                </div>
              </CategoryLabel>
            </div>

            <SplitEditor>
              <div>
                <ScoreGridForm
                  scoringType={player1?.scores.eliminationtScoreType}
                  gridData={gridDataPlayer1}
                  onChange={(value) => setGridDataPlayer1(value)}
                />
              </div>

              <div>
                <ScoreGridFormRight
                  scoringType={player2?.scores.eliminationtScoreType}
                  gridData={gridDataPlayer2}
                  onChange={(value) => setGridDataPlayer2(value)}
                />
              </div>
            </SplitEditor>

            <HorizontalSpaced>
              <Button onClick={onClose}>Batal</Button>
              <ButtonBlue
                onClick={() => {
                  if (isDirtyTotalP1) {
                    submitAdminTotal(
                      {
                        memberId: player1.participant.member.id,
                        value: adminTotalP1,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Total berhasil disimpan");
                        },
                        onError: () => {
                          toast.error("Gagal menyimpan total");
                        },
                      }
                    );
                  }

                  if (isDirtyTotalP2) {
                    submitAdminTotal(
                      {
                        memberId: player2.participant.member.id,
                        value: adminTotalP2,
                      },
                      {
                        onSuccess: () => {
                          toast.success("Total berhasil disimpan");
                        },
                        onError: () => {
                          toast.error("Gagal menyimpan total");
                        },
                      }
                    );
                  }

                  const payload = {
                    save_permanent: 0,
                    ...scoring,
                    ..._makeMemberScoresPayload({
                      state: scoringDetails,
                      payload: [gridDataPlayer1, gridDataPlayer2],
                    }),
                  };
                  submitScoringDetail(payload, { onSuccess });
                }}
              >
                Simpan
              </ButtonBlue>
            </HorizontalSpaced>
          </BodyWrapper>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

function LoadingBlocker({ isLoading = false }) {
  if (!isLoading) {
    return null;
  }
  return (
    <LoadingContainer>
      <SpinnerDotBlock />
    </LoadingContainer>
  );
}

/* ================================== */
// styles

const BodyWrapper = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const Modal = styled(BSModal)`
  position: relative;
  max-width: 56.25rem;
`;

const ScoresheetHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  padding: 1rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.5rem;
`;

const BudrestNumberLabel = styled.div`
  width: 3rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-align: center;
`;

const PlayerLabelContainerLeft = styled.div`
  flex-grow: 1;
  margin-right: 2rem;
`;

const PlayerLabelContainerRight = styled.div`
  flex-grow: 1;
  margin-left: 2rem;
`;

const PlayerNameData = styled.div`
  min-width: 11rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const RankLabel = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-primary-blue-50);
  white-space: nowrap;
  font-weight: 600;
  text-align: center;
`;

const NameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;
`;

const HeadToHeadScores = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const HeaderScoreInput = styled.div`
  position: relative;
`;

const ScoreInput = styled.input`
  padding: calc(0.625rem - 1px) calc(0.5rem - 1px);
  width: 3rem;
  border: solid 1px var(--ma-gray-200);
  border-radius: 0.25rem;
  color: var(--ma-gray-500);
  font-size: 0.85em;
  text-align: center;
`;

const IndicatorIconFloating = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;

  &.indicator-left {
    left: -1.75rem;
  }

  &.indicator-right {
    right: -1.75rem;
  }

  &.indicator-warning {
    color: var(--ma-secondary);
  }

  &.indicator-valid {
    color: var(--ma-alert-positive);
  }
`;

const HeadToHeadScoreLabels = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ScoreCounter = styled.span`
  display: block;
  padding: 0.625rem 0.5rem;
  min-width: 3rem;
  background-color: var(--ma-gray-200);
  white-space: nowrap;
  text-align: center;

  &.score-counter-highlighted {
    background-color: var(--ma-secondary);
  }
`;

const SplitEditor = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem 4rem;
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const CategoryLabel = styled.div`
  margin: 1.25rem 0;
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
    text-transform: capitalize;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.6);
`;

/* =========================== */
// utils

// Nge-update payload detail skor di rambahan & shoot-off
function _makeMemberScoresPayload({ state, payload }) {
  const members = state.map((member, index) => ({
    member_id: member.participant.member.id,
    scores: {
      shot: payload[index].shot.map((rambahan) => ({ score: rambahan })),
      extraShot: payload[index].extraShot,
      win: member.scores.win,
      adminTotal: member.scores.adminTotal,
    },
  }));
  //coba tanpa type?
  return { type: 2, members };
}

function _getDistanceCategoryLabel(classCategory) {
  return classCategory.split(" - ")?.[1]?.trim() || "-";
}

export { ButtonEditScoreLine };
