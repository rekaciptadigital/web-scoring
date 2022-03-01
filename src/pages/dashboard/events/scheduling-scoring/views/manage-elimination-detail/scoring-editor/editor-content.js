import * as React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useScoringDetail } from "./hooks/scoring-detail";
import { useScoreGrid } from "./hooks/score-grid";
import { ScoringService } from "services";

import { LoadingScreen } from "components";
import {
  ButtonBlue,
  ButtonOutlineBlue,
  SpinnerDotBlock,
  AlertSubmitError,
  AlertConfirmAction,
} from "components/ma";
import { FieldInputBudrestNo } from "./field-input-budrest-no";
import { ScoreGridForm } from "./score-grid-form";

import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconCross from "components/ma/icons/mono/cross";
import IconTrophyWin from "components/ma/icons/fill/trophy-win";

import { errorsUtil } from "utils";
import { makeScoringPayload, hasWinner } from "./utils";

function EditorContent({ code, bracketProps, configs, onClose, onSuccess }) {
  const location = useLocation();
  const { roundIndex, seedIndex } = bracketProps;

  const scoring = {
    code: code,
    elimination_id: configs.eliminationId,
    round: roundIndex + 1,
    match: seedIndex + 1,
  };

  const {
    data: scoringDetail,
    status: scoringDetailStatus,
    refetch: refetchScoring,
  } = useScoringDetail(scoring);

  const {
    data: gridLeft,
    updateShot: updateShotLeft,
    updateExtraShot: updateExtraShotLeft,
    resetGrid: resetGridLeft,
    dispatchSubmit,
    status: statusSubmit,
    errors: submitErrors,
  } = useScoreGrid(scoringDetail?.[0].scores);
  const {
    data: gridRight,
    updateShot: updateShotRight,
    updateExtraShot: updateExtraShotRight,
    resetGrid: resetGridRight,
  } = useScoreGrid(scoringDetail?.[1].scores);

  const [targetNo, setTargetNo] = React.useState("");
  const [isEditMode, setEditMode] = React.useState(false);

  const handleCancelSessionGrid = () => {
    resetGridLeft();
    resetGridRight();
    setEditMode(false);
  };

  const handleSubmitSessionGrid = async () => {
    dispatchSubmit({ status: "loading", errors: null });
    const payload = {
      save_permanent: 0,
      ...scoring,
      ...makeScoringPayload({ data: [gridLeft, gridRight], state: scoringDetail }),
    };

    const result = await ScoringService.saveParticipantScore(payload);
    if (result.success) {
      dispatchSubmit({ status: "success" });
      setEditMode(false);
      refetchScoring();
      onSuccess?.();
    } else {
      const errors = errorsUtil.interpretServerErrors(result);
      dispatchSubmit({ status: "error", errors: errors });
    }
  };

  const handleConfirmDetermineWinner = () => setAlertConfirmStatus("open");

  const handleDetermineWinner = async () => {
    dispatchSubmit({ status: "loading", errors: null });
    const payload = {
      save_permanent: 1,
      ...scoring,
      ...makeScoringPayload({ data: [gridLeft, gridRight], state: scoringDetail }),
    };

    const result = await ScoringService.saveParticipantScore(payload);
    if (result.success) {
      dispatchSubmit({ status: "success" });
      setEditMode(false);
      refetchScoring();
    } else {
      const errors = errorsUtil.interpretServerErrors(result);
      dispatchSubmit({ status: "error", errors: errors });
    }
  };

  const [alertConfirmStatus, setAlertConfirmStatus] = React.useState("close");

  const isLoadingScoringDetail = scoringDetailStatus === "loading";
  const isLoadingSubmit = statusSubmit === "loading";
  const isErrorSubmit = statusSubmit === "error";
  const matchHasWinner = hasWinner(scoringDetail);
  const isDetermineWinnerAllowed = scoringDetail?.some((member) => member.scores.result);
  const shouldShowConfirm = alertConfirmStatus === "open";

  const computeCategoryLabel = () => {
    const { competitionCategoryId, ageCategoryId } = location.state.category;
    return `${competitionCategoryId} ${ageCategoryId}`;
  };

  return (
    <div>
      {!matchHasWinner && (
        <EditorHeader>
          <div>
            <h4>
              Scoresheet
              {scoringDetail?.[0]?.scores.eliminationtScoreType === 1
                ? " - Sistem Poin"
                : " - Sistem Akumulasi Skor"}
            </h4>
          </div>

          <div className="float-end">
            <ButtonClose disabled={isEditMode} onClick={() => !isEditMode && onClose()}>
              <IconCross size="16" /> Tutup
            </ButtonClose>
          </div>
        </EditorHeader>
      )}

      {!scoringDetail && isLoadingScoringDetail ? (
        <SpinnerDotBlock />
      ) : scoringDetail ? (
        <React.Fragment>
          {!matchHasWinner ? (
            <HUDPlayerTop>
              <PlayerName>{scoringDetail[0].participant.name}</PlayerName>
              <PlayerScores>
                {scoringDetail[0].scores.result || 0}-{scoringDetail[1].scores.result || 0}
              </PlayerScores>
              <PlayerName>{scoringDetail[1].participant.name}</PlayerName>
            </HUDPlayerTop>
          ) : (
            <WinnerHUDContainer>
              <HUDPlayerTop>
                <PlayerName>{scoringDetail[0].participant.name}</PlayerName>

                <div className="hud-middle">
                  {Boolean(scoringDetail[0].scores.win) && (
                    <span className="indicator-winner left">
                      <IconTrophyWin size="28" />
                    </span>
                  )}

                  <PlayerScores>
                    {scoringDetail[0].scores.result || 0}-{scoringDetail[1].scores.result || 0}
                  </PlayerScores>

                  {Boolean(scoringDetail[1].scores.win) && (
                    <span className="indicator-winner right">
                      <IconTrophyWin size="28" />
                    </span>
                  )}
                </div>

                <PlayerName>{scoringDetail[1].participant.name}</PlayerName>
              </HUDPlayerTop>
            </WinnerHUDContainer>
          )}

          {location?.state?.category && !matchHasWinner && (
            <YeahCategory>
              <div>{location.state.category.teamCategoryDetail.label}</div>
              <div>
                <IconBow size="16" /> {computeCategoryLabel()}
              </div>
              <div>
                <IconDistance size="16" /> {location.state.category.distanceId}m
              </div>
            </YeahCategory>
          )}

          {!matchHasWinner && (
            <SectionTableContainer>
              <TableLoadingIndicator isLoading={isLoadingScoringDetail} />

              <SplitEditor>
                <div>
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
                  </FormHeader>

                  {gridLeft ? (
                    <ScoreGridForm
                      scoringType={scoringDetail?.[0]?.scores.eliminationtScoreType}
                      gridData={gridLeft}
                      updateShot={updateShotLeft}
                      updateExtraShot={updateExtraShotLeft}
                      isEditMode={isEditMode}
                    />
                  ) : (
                    <div>Ada kesalahan dalam memproses data input skor. Silakan coba lagi.</div>
                  )}
                </div>

                <div>
                  <FormHeader>
                    <div>
                      <FieldInputBudrestNo
                        value={targetNo || ""}
                        onChange={(value) => setTargetNo(value)}
                      >
                        Bantalan
                      </FieldInputBudrestNo>
                    </div>
                  </FormHeader>

                  {gridRight ? (
                    <ScoreGridForm
                      scoringType={scoringDetail?.[1]?.scores.eliminationtScoreType}
                      gridData={gridRight}
                      updateShot={updateShotRight}
                      updateExtraShot={updateExtraShotRight}
                      isEditMode={isEditMode}
                    />
                  ) : (
                    <div>Ada kesalahan dalam memproses data input skor. Silakan coba lagi.</div>
                  )}
                </div>
              </SplitEditor>
            </SectionTableContainer>
          )}

          {!matchHasWinner ? (
            <EditorFooter>
              <div></div>
              {isEditMode ? (
                <SpacedButtonsGroup>
                  <ButtonClose onClick={handleCancelSessionGrid}>Batal</ButtonClose>
                  <ButtonBlue onClick={handleSubmitSessionGrid}>Simpan</ButtonBlue>
                  <ButtonOutlineBlue
                    disabled={!isDetermineWinnerAllowed}
                    onClick={handleConfirmDetermineWinner}
                  >
                    Tentukan
                  </ButtonOutlineBlue>
                </SpacedButtonsGroup>
              ) : (
                <SpacedButtonsGroup>
                  <ButtonBlue onClick={() => setEditMode(true)}>Ubah Skor</ButtonBlue>
                </SpacedButtonsGroup>
              )}
            </EditorFooter>
          ) : (
            <EditorFooter>
              <div></div>
              <SpacedButtonsGroup>
                <ButtonClose
                  onClick={() => {
                    onSuccess?.();
                    onClose();
                  }}
                >
                  <IconCross size="16" /> Tutup
                </ButtonClose>
              </SpacedButtonsGroup>
            </EditorFooter>
          )}
        </React.Fragment>
      ) : (
        <div>
          Ada error dalam mengambil data scoring. Silakan coba kembali beberapa saat lagi, atau
          hubungi technical support.
        </div>
      )}

      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={submitErrors} onConfirm={() => {}} />
      <AlertConfirmAction
        shouldConfirm={shouldShowConfirm}
        onConfirm={handleDetermineWinner}
        onClose={() => setAlertConfirmStatus("close")}
        labelCancel="Periksa kembali"
      >
        Skor tidak dapat diubah lagi setelah ditentukan pemenang. Pastikan semua skor telah diisi
        benar.
      </AlertConfirmAction>
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

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const SectionTableContainer = styled.div`
  position: relative;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
  }
`;

const EditorFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
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

const WinnerHUDContainer = styled.div`
  padding: 3rem 2rem;

  .hud-middle {
    position: relative;
    flex: 1 24 100px;

    .indicator-winner {
      position: absolute;
      z-index: 10;
      top: 20%;

      &.left {
        left: -12.5%;
      }

      &.right {
        right: -12.5%;
      }
    }
  }
`;

const HUDPlayerTop = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  flex-wrap: wrap;
  overflow: hidden;
  border: solid 1px var(--ma-blue);
  border-radius: 0.75rem;

  > *:last-child {
    text-align: right;
  }
`;

const PlayerName = styled.h4`
  flex: 24 1 0%;
  margin: 0;
  padding: 0.75rem 1rem;
`;

const PlayerScores = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0.75rem 1rem;
  background-color: #90aad4;
  color: #ffffff;
  font-size: 1.125em;
  font-weight: 600;

  clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
`;

const YeahCategory = styled.div`
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

const SplitEditor = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem 1.75rem;
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

const SpacedButtonsGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
`;

export { EditorContent };
