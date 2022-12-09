import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-detail";
import { useSubmitScores } from "../../hooks/submit-scores";
import { useGridForm } from "../../hooks/grid-form";
import { useAdminTotal } from "../../hooks/admin-total";
import { useSubmitAdminTotal } from "../../hooks/submit-total";
import { InputSwitcherProvider } from "../../contexts/input-switcher";

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
import { ScoreGridViewer } from "./components/score-grid-viewer";
import { ScoreGridViewerRight } from "./components/score-grid-viewer-right";

import IconEdit from "components/ma/icons/mono/edit";
import IconAlertCircle from "components/ma/icons/mono/alert-circle";
import IconCheckOkCircle from "components/ma/icons/mono/check-ok-circle.js";
import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";
import { sumScoresList } from "./utils";

function ButtonEditScoreTeam({
  disabled,
  viewMode,
  scoring,
  headerInfo,
  budrestNumber,
  onSuccessSubmit,
  categoryDetails,
}) {
  const [isOpen, setOpen] = React.useState(false);

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  if (viewMode) {
    return (
      <React.Fragment>
        <ButtonOutlineBlue
          flexible
          title={disabled ? undefined : "Lihat detail skor"}
          onClick={open}
          disabled={disabled}
        >
          <span>Detail</span>
        </ButtonOutlineBlue>

        {isOpen && (
          <ModalEditorViewer
            headerInfo={headerInfo}
            budrestNumber={budrestNumber}
            onClose={close}
            scoring={scoring}
            onSuccessSubmit={onSuccessSubmit}
            categoryDetails={categoryDetails}
          />
        )}
      </React.Fragment>
    );
  }

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
          budrestNumber={budrestNumber}
          onClose={close}
          scoring={scoring}
          onSuccessSubmit={onSuccessSubmit}
          categoryDetails={categoryDetails}
        />
      )}
    </React.Fragment>
  );
}

function ModalEditor({
  headerInfo,
  budrestNumber,
  onClose,
  scoring,
  onSuccessSubmit,
  categoryDetails,
}) {
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
  const player1 = _getPlayerDataByIndex(scoringDetails, 0);
  const player2 = _getPlayerDataByIndex(scoringDetails, 1);

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

  // untuk nge-"queue" refetch, lihat yang panggil ini di bawah
  const shouldRefetch = React.useRef(false);

  // mutate
  const {
    submitScoringDetail,
    isLoading: isSubmitingDetail,
    isError: isErrorSubmitDetail,
    errors: errorsSubmitDetail,
  } = useSubmitScores();

  const {
    submitAdminTotal: submitAdminTotalP1,
    isLoading: isSubmitingTotalP1,
    isError: isErrorSubmitingTotalP1,
    errors: errorsSubmitingTotalP1,
  } = useSubmitAdminTotal({
    categoryId: categoryDetails.id,
    participantId: player1?.teamDetail.participantId,
    eliminationId: scoring?.elimination_id,
    round: scoring.round,
    match: scoring.match,
  });

  const {
    submitAdminTotal: submitAdminTotalP2,
    isLoading: isSubmitingTotalP2,
    isError: isErrorSubmitingTotalP2,
    errors: errorsSubmitingTotalP2,
  } = useSubmitAdminTotal({
    categoryId: categoryDetails.id,
    participantId: player2?.teamDetail.participantId,
    eliminationId: scoring?.elimination_id,
    round: scoring.round,
    match: scoring.match,
  });

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
      <AlertSubmitError isError={isErrorScoringDetail} errors={errorsScoringDetail} />
      <AlertSubmitError isError={isErrorSubmitDetail} errors={errorsSubmitDetail} />
      <AlertSubmitError isError={isErrorSubmitingTotalP1} errors={errorsSubmitingTotalP1} />
      <AlertSubmitError isError={isErrorSubmitingTotalP2} errors={errorsSubmitingTotalP2} />

      <Modal isOpen centered backdrop="static" size="lg" autoFocus onClosed={onClose}>
        <ModalBody>
          <LoadingBlocker
            isLoading={isSubmitingTotalP1 || isSubmitingTotalP2 || isSubmitingDetail}
          />
          <BodyWrapper>
            <ModalHeaderBar>
              <h4>Scoresheet</h4>
              <EditorCloseButton flexible onClick={onClose}>
                <IconX size="16" />
              </EditorCloseButton>
            </ModalHeaderBar>

            <ScoresheetHeader>
              <BudrestNumberLabel>{budrestNumber || "-"}</BudrestNumberLabel>

              <PlayerLabelContainerLeft>
                <PlayerNameData>
                  {headerPlayer1?.status === "bye" ? (
                    <span></span>
                  ) : (
                    <RankLabel>#{headerPlayer1?.potition || "-"}</RankLabel>
                  )}

                  <div>
                    <TeamNameLabel
                      className={classnames({ "label-bye": headerPlayer1?.status === "bye" })}
                    >
                      {player1?.teamDetail.teamName ||
                        headerPlayer1?.teamName ||
                        (headerPlayer1?.status === "bye" ? "Bye" : "Nama tim tidak tersedia")}
                    </TeamNameLabel>
                    {Boolean(player1?.listMember?.length) && (
                      <MembersList>
                        {player1.listMember.map((member) => (
                          <li key={member.memberId}>{member.name}</li>
                        ))}
                      </MembersList>
                    )}
                  </div>
                </PlayerNameData>
              </PlayerLabelContainerLeft>

              <HeadToHeadScores>
                {headerPlayer1?.status === "bye" ? (
                  <HeaderScoreInput></HeaderScoreInput>
                ) : (
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
                      value={adminTotalP1}
                      onChange={(ev) => {
                        setTotalP1((previousValue) => {
                          const { value } = ev.target;
                          if (!value) {
                            return "";
                          }
                          if (isNaN(value)) {
                            return previousValue;
                          }
                          return Number(value);
                        });
                      }}
                      onFocus={(ev) => ev.target.select()}
                    />
                  </HeaderScoreInput>
                )}

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

                {headerPlayer2?.status === "bye" ? (
                  <HeaderScoreInput></HeaderScoreInput>
                ) : (
                  <HeaderScoreInput>
                    <ScoreInput
                      type="text"
                      placeholder="-"
                      value={adminTotalP2}
                      onChange={(ev) => {
                        setTotalP2((previousValue) => {
                          const { value } = ev.target;
                          if (!value) {
                            return "";
                          }
                          if (isNaN(value)) {
                            return previousValue;
                          }
                          return Number(value);
                        });
                      }}
                      onFocus={(ev) => ev.target.select()}
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
                )}
              </HeadToHeadScores>

              <PlayerLabelContainerRight>
                <PlayerNameData>
                  {headerPlayer2?.status === "bye" ? (
                    <span></span>
                  ) : (
                    <RankLabel>#{headerPlayer2?.potition || "-"}</RankLabel>
                  )}

                  <div>
                    <TeamNameLabel
                      className={classnames({ "label-bye": headerPlayer2?.status === "bye" })}
                    >
                      {player2?.teamDetail.teamName ||
                        headerPlayer2?.teamName ||
                        (headerPlayer2?.status === "bye" ? "Bye" : "Nama tim tidak tersedia")}
                    </TeamNameLabel>
                    {Boolean(player2?.listMember?.length) && (
                      <MembersList>
                        {player2.listMember.map((member) => (
                          <li key={member.memberId}>{member.name}</li>
                        ))}
                      </MembersList>
                    )}
                  </div>
                </PlayerNameData>
              </PlayerLabelContainerRight>
            </ScoresheetHeader>

            <CategoryLabel>
              <div>{categoryDetails?.teamCategoryLabel}</div>
              <div>
                <IconBow size="16" /> {categoryDetails?.competitionCategoryId}{" "}
                {categoryDetails?.ageCategoryId}
              </div>
              <div>
                <IconDistance size="16" />{" "}
                {_getDistanceCategoryLabel(categoryDetails?.classCategory)}
              </div>
            </CategoryLabel>

            <SplitEditor>
              <InputSwitcherProvider
                scoringDetails={scoringDetails}
                grid={[gridDataPlayer1?.shot, gridDataPlayer2?.shot]}
              >
                {headerPlayer1?.status === "bye" ? (
                  <EmptyByeGrid playerIndex={0} />
                ) : (
                  <div>
                    <ScoreGridForm
                      scoringType={player1?.scores.eliminationtScoreType}
                      gridData={gridDataPlayer1}
                      onChange={(value) => {
                        if (player1?.scores.eliminationtScoreType === 1) {
                          // Itung poin real-time untuk tipe skoring poin
                          const [valP1, valP2] = _computePoints(value, gridDataPlayer2);
                          setGridDataPlayer1(valP1);
                          setGridDataPlayer2(valP2); // opponent
                        } else {
                          setGridDataPlayer1(value);
                        }
                      }}
                    />
                  </div>
                )}

                {headerPlayer2?.status === "bye" ? (
                  <EmptyByeGrid playerIndex={1} />
                ) : (
                  <div>
                    <ScoreGridFormRight
                      scoringType={player2?.scores.eliminationtScoreType}
                      gridData={gridDataPlayer2}
                      onChange={(value) => {
                        if (player2?.scores.eliminationtScoreType === 1) {
                          const [valP2, valP1] = _computePoints(value, gridDataPlayer1);
                          setGridDataPlayer2(valP2);
                          setGridDataPlayer1(valP1); // opponent
                        } else {
                          setGridDataPlayer2(value);
                        }
                      }}
                    />
                  </div>
                )}
              </InputSwitcherProvider>
            </SplitEditor>

            <HorizontalSpaced>
              <Button onClick={onClose}>Batal</Button>
              <ButtonBlue
                onClick={async () => {
                  // Hack promise sederhana untuk menghindari "race condition" ketika harus
                  // refetch data tapi menunggu semua request async dari ketiga API selesai,
                  // apapun hasilnya, sukses maupun gagal.

                  // Preparing refetching "queue"
                  const savingTotal1 = {};
                  const savingTotal2 = {};
                  const savingScoreDetails = {};

                  savingTotal1.promise = new Promise((resolve) => {
                    savingTotal1.done = resolve;
                  });
                  savingTotal2.promise = new Promise((resolve) => {
                    savingTotal2.done = resolve;
                  });
                  savingScoreDetails.promise = new Promise((resolve) => {
                    savingScoreDetails.done = resolve;
                  });

                  const waitForAllDone = () => {
                    return Promise.all([
                      savingTotal1.promise,
                      savingTotal2.promise,
                      savingScoreDetails.promise,
                    ]);
                  };

                  // Running requests in queue
                  // 1.
                  if (isDirtyTotalP1) {
                    submitAdminTotalP1(adminTotalP1, {
                      onSuccess: () => {
                        toast.success("Total tim 1 berhasil disimpan");
                        savingTotal1.done();
                        shouldRefetch.current = true;
                      },
                      onError: () => {
                        toast.error("Gagal menyimpan total tim 1");
                        savingTotal1.done();
                      },
                    });
                  } else {
                    // done tanpa kirim request
                    savingTotal1.done();
                  }

                  // 2.
                  if (isDirtyTotalP2) {
                    submitAdminTotalP2(adminTotalP2, {
                      onSuccess: () => {
                        toast.success("Total tim 2 berhasil disimpan");
                        savingTotal2.done();
                        shouldRefetch.current = true;
                      },
                      onError: () => {
                        toast.error("Gagal menyimpan total tim 2");
                        savingTotal2.done();
                      },
                    });
                  } else {
                    // done tanpa kirim request
                    savingTotal2.done();
                  }

                  // 3.
                  const payload = {
                    save_permanent: 0,
                    ...scoring,
                    ..._makeMemberScoresPayload({
                      state: scoringDetails,
                      payload: [gridDataPlayer1, gridDataPlayer2],
                    }),
                  };

                  submitScoringDetail(payload, {
                    onSuccess: () => {
                      toast.success("Detail skor berhasil disimpan");
                      savingScoreDetails.done();
                      shouldRefetch.current = true;
                    },
                    onError: () => {
                      toast.error("Gagal menyimpan detail");
                      savingScoreDetails.done();
                    },
                  });

                  // Eksekusi logic di bawah hanya setelah queue-nya selesai/resolve semua
                  await waitForAllDone();

                  if (shouldRefetch.current) {
                    fetchScoringDetail();
                    onSuccessSubmit?.();
                  }

                  shouldRefetch.current = false;
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

function ModalEditorViewer({ headerInfo, budrestNumber, onClose, scoring, categoryDetails }) {
  const {
    isError: isErrorScoringDetail,
    errors: errorsScoringDetail,
    data: scoringDetails,
  } = useScoringDetail(scoring);

  const isSettled = Boolean(scoringDetails) || (!scoringDetails && isErrorScoringDetail);
  const headerPlayer1 = headerInfo?.teams[0];
  const headerPlayer2 = headerInfo?.teams[1];
  const player1 = scoringDetails?.[0];
  const player2 = scoringDetails?.[1];

  const { value: gridDataPlayer1 } = useGridForm(player1?.scores);
  const { value: gridDataPlayer2 } = useGridForm(player2?.scores);

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
    <Modal isOpen centered backdrop="static" size="lg" autoFocus onClosed={onClose}>
      <ModalBody>
        <BodyWrapper>
          <ModalHeaderBar>
            <h4>Scoresheet</h4>
            <EditorCloseButton flexible onClick={onClose}>
              <IconX size="16" />
            </EditorCloseButton>
          </ModalHeaderBar>

          <ScoresheetHeader>
            <BudrestNumberLabel>{budrestNumber || "-"}</BudrestNumberLabel>

            <PlayerLabelContainerLeft>
              <PlayerNameData>
                <RankLabel>#{headerPlayer1?.potition || headerPlayer1?.postition || "-"}</RankLabel>

                <div>
                  <TeamNameLabel>
                    {player1?.teamDetail.teamName ||
                      headerPlayer1?.teamName ||
                      "Nama tim tidak tersedia"}
                  </TeamNameLabel>
                  {Boolean(player1?.listMember?.length) && (
                    <MembersList>
                      {player1.listMember.map((member) => (
                        <li key={member.memberId}>{member.name}</li>
                      ))}
                    </MembersList>
                  )}
                </div>
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
                <RankLabel>#{headerPlayer2?.potition || headerPlayer2?.postition || "-"}</RankLabel>

                <div>
                  <TeamNameLabel>
                    {player2?.teamDetail.teamName ||
                      headerPlayer2?.teamName ||
                      "Nama tim tidak tersedia"}
                  </TeamNameLabel>
                  {Boolean(player2?.listMember?.length) && (
                    <MembersList>
                      {player2.listMember.map((member) => (
                        <li key={member.memberId}>{member.name}</li>
                      ))}
                    </MembersList>
                  )}
                </div>
              </PlayerNameData>
            </PlayerLabelContainerRight>
          </ScoresheetHeader>

          <CategoryLabel>
            <div>{categoryDetails?.teamCategoryLabel}</div>
            <div>
              <IconBow size="16" /> {categoryDetails?.competitionCategoryId}{" "}
              {categoryDetails?.ageCategoryId}
            </div>
            <div>
              <IconDistance size="16" /> {_getDistanceCategoryLabel(categoryDetails?.classCategory)}
            </div>
          </CategoryLabel>

          <SplitEditor>
            <div>
              <ScoreGridViewer
                scoringType={player1?.scores.eliminationtScoreType}
                gridData={gridDataPlayer1}
              />
            </div>
            <div>
              <ScoreGridViewerRight
                scoringType={player2?.scores.eliminationtScoreType}
                gridData={gridDataPlayer2}
              />
            </div>
          </SplitEditor>

          <HorizontalSpaced>
            <ButtonBlue onClick={onClose}>Tutup</ButtonBlue>
          </HorizontalSpaced>
        </BodyWrapper>
      </ModalBody>
    </Modal>
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

function EmptyByeGrid({ playerIndex = 0 }) {
  return (
    <EmptyByeGridWrapper className={classnames({ "bye-player2": playerIndex === 1 })}>
      Bye
    </EmptyByeGridWrapper>
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
  max-width: 72rem;
`;

const ModalHeaderBar = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
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
  margin-right: 1rem;
`;

const PlayerLabelContainerRight = styled.div`
  flex-grow: 1;
  margin-left: 1rem;
`;

const PlayerNameData = styled.div`
  min-width: 12rem;
  display: flex;
  gap: 1rem;
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

const TeamNameLabel = styled.span`
  display: block;
  font-weight: 600;
  text-align: left;

  &.label-bye {
    color: var(--ma-gray-200);
  }
`;

const MembersList = styled.ol`
  margin: 0;
  margin-top: 0.5rem;
  padding-left: 1rem;
  text-align: left;
  font-size: 0.625rem;
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

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
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

const EmptyByeGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ma-gray-200);
  font-size: 1.5rem;
  font-weight: 600;

  border-right: 1px solid var(--ma-gray-100);

  &.bye-player2 {
    border-right: none;
    border-left: 1px solid var(--ma-gray-100);
  }
`;

/* =========================== */
// utils

function _getPlayerDataByIndex(scoringDetails, playerIndex) {
  const data = scoringDetails?.[playerIndex];
  if (Array.isArray(data) && !data.length) {
    return undefined;
  }
  return data;
}

// Nge-update payload detail skor di rambahan & shoot-off
function _makeMemberScoresPayload({ state, payload }) {
  const participants = state.map((member, index) => {
    if (Array.isArray(member) && !member.length) {
      // kalah bye, kirim array kosong
      return [];
    }
    return {
      participant_id: member?.teamDetail?.participantId,
      scores: {
        shot: payload[index].shot.map((rambahan) => ({ score: rambahan })),
        extraShot: payload[index].extraShot,
        win: member.scores.win,
        adminTotal: member.scores.adminTotal,
      },
    };
  });
  //coba tanpa type?
  return { type: 2, participants };
}

function _getDistanceCategoryLabel(classCategory) {
  return classCategory.split(" - ")?.[1]?.trim() || "-";
}

function _computePoints(value, valueOpponent) {
  const sums = value.shot.reduce((sums, rambahan, index) => {
    const pointA = sumScoresList(rambahan);
    const pointB = sumScoresList(valueOpponent.shot[index]);
    sums.push([pointA, pointB]);
    return sums;
  }, []);

  const points = sums.reduce((points, [a, b]) => {
    let pair = [1, 1];
    if (a > b) {
      pair = [2, 0];
    } else if (a < b) {
      pair = [0, 2];
    } else if (a === 0 && b === 0) {
      pair = [0, 0];
    }
    points.push(pair);
    return points;
  }, []);

  const resultPair = [value, valueOpponent].map((player, playerIndex) => {
    const stats = points.reduce((stats, pointPair, rambahanIndex) => {
      const point = pointPair[playerIndex];
      stats[rambahanIndex] = { ...player.stats[rambahanIndex], point };
      return stats;
    }, {});

    const result = points.reduce((total, pointPair) => {
      return total + pointPair[playerIndex];
    }, 0);

    return {
      ...player,
      stats: {
        ...player.stats,
        ...stats,
        result: result,
      },
    };
  });

  return resultPair;
}

export { ButtonEditScoreTeam };
