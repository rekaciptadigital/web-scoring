import * as React from "react";
import styled from "styled-components";
import { useScoringDetail } from "../../hooks/scoring-detail";
import { useSubmitScores } from "../../hooks/submit-scores";
import { useGridForm } from "../../hooks/grid-form";
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
import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ButtonEditScoreTeam({
  disabled,
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
    // TODO:
    // data: scoringDetails,
    fetchScoringDetail,
    // TODO: scoring, fetch detail
  } = useScoringDetail(/* scoring */ {});

  // TODO: hapus
  const scoringDetails = fakeDetails;

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
    // TODO: elimination ID
    eliminationId: scoring?.elimination_id || 333,
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
                  <RankLabel>
                    #{headerPlayer1?.potition || headerPlayer1?.postition || "-"}
                  </RankLabel>

                  <div>
                    <TeamNameLabel>
                      {player1?.participant.member.name || headerPlayer1?.name || "-"}
                    </TeamNameLabel>
                    <MembersList>
                      <li>Anggota satu</li>
                      <li>Anggota dua</li>
                      <li>Anggota tigaaa...</li>
                    </MembersList>
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
                    onFocus={(ev) => ev.target.select()}
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
              </HeadToHeadScores>

              <PlayerLabelContainerRight>
                <PlayerNameData>
                  <RankLabel>
                    #{headerPlayer2?.potition || headerPlayer2?.postition || "-"}
                  </RankLabel>

                  <div>
                    <TeamNameLabel>
                      {player2?.participant.member.name ||
                        headerPlayer2?.name ||
                        "Nama archer tidak tersedia"}
                    </TeamNameLabel>
                    <MembersList>
                      <li>Anggota satu</li>
                      <li>Anggota dua</li>
                      <li>Anggota tigaaa...</li>
                    </MembersList>
                  </div>
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

export { ButtonEditScoreTeam };

const fakeDetails = [
  {
    participant: {
      id: 1426,
      eventId: 22,
      userId: 618,
      name: "Muhammad Usman Al Fatih",
      type: "individual",
      email: "muhammadusmanalfatih9@gmail.com",
      phoneNumber: "087700656735",
      age: 13,
      gender: "male",
      teamCategoryId: "individu male",
      ageCategoryId: "U-15",
      competitionCategoryId: "Compound",
      distanceId: 40,
      qualificationDate: null,
      transactionLogId: 1358,
      uniqueId: "07b5cd5f-e57e-4122-9afb-68ad4724a692",
      createdAt: "2022-03-22 20:32:15",
      updatedAt: "2022-05-13 00:35:23",
      teamName: "Tim Kiri",
      eventCategoryId: 91,
      status: 1,
      clubId: 49,
      reasonRefund: null,
      uploadImageRefund: null,
      isPresent: 1,
      registerBy: 1,
      categoryLabel: "individu male-U-15-Compound-40m",
      member: {
        id: 1265,
        archeryEventParticipantId: 1426,
        name: "Tim Kiri Tim Kiri Tim Kiri",
        teamCategoryId: "individu male",
        email: null,
        phoneNumber: null,
        club: null,
        age: 13,
        gender: "male",
        qualificationDate: null,
        createdAt: "2022-03-22 20:32:15",
        updatedAt: "2022-05-12 16:47:11",
        birthdate: "2008-07-13",
        userId: 618,
        isSeries: 0,
        haveShootOff: 0,
        cityId: null,
      },
      club: "AR-RIDHO ARCHERY",
    },
    scores: {
      shot: [
        {
          score: ["10", "9", "5"],
          total: 24,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
      ],
      extraShot: [
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
      ],
      win: 0,
      total: 24,
      eliminationtScoreType: 2,
      result: 24,
      adminTotal: 0,
      isDifferent: 1,
    },
    round: "2",
    isUpdated: 1,
  },
  {
    participant: {
      id: 1049,
      eventId: 22,
      userId: 95,
      name: "Arbiansyah Abdillah Muttaqin",
      type: "individual",
      email: "bianrizki99@gmail.com",
      phoneNumber: "081289186199",
      age: 13,
      gender: "male",
      teamCategoryId: "individu male",
      ageCategoryId: "U-15",
      competitionCategoryId: "Compound",
      distanceId: 40,
      qualificationDate: null,
      transactionLogId: 985,
      uniqueId: "d0b173d5-8ec2-4b15-9962-edf9de0dfb95",
      createdAt: "2022-03-21 07:01:31",
      updatedAt: "2022-03-21 07:05:45",
      teamName: "Tim Kanan",
      eventCategoryId: 91,
      status: 1,
      clubId: 2,
      reasonRefund: null,
      uploadImageRefund: null,
      isPresent: 1,
      registerBy: 1,
      categoryLabel: "individu male-U-15-Compound-40m",
      member: {
        id: 891,
        archeryEventParticipantId: 1049,
        name: "Tim Kanan Tim Kanan Tim Kanan",
        teamCategoryId: "individu male",
        email: null,
        phoneNumber: null,
        club: null,
        age: 13,
        gender: "male",
        qualificationDate: null,
        createdAt: "2022-03-21 07:01:31",
        updatedAt: "2022-05-12 16:47:10",
        birthdate: "2008-07-30",
        userId: 95,
        isSeries: 1,
        haveShootOff: 0,
        cityId: null,
      },
      club: "Focus Archery Center",
    },
    scores: {
      shot: [
        {
          score: ["7", "6", "5"],
          total: 18,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
        {
          score: ["", "", ""],
          total: 0,
          status: null,
          point: null,
        },
      ],
      extraShot: [
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
        {
          distanceFromX: 0,
          score: "",
          status: null,
        },
      ],
      win: 0,
      total: 18,
      eliminationtScoreType: 2,
      result: 18,
      adminTotal: 0,
      isDifferent: 1,
    },
    round: "2",
    isUpdated: 1,
  },
];
