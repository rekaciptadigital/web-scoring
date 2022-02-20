import * as React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useScoringDetail } from "./hooks/scoring-detail";
import { useScoreGrid } from "./hooks/score-grid";
import { ScoringService } from "services";

import { LoadingScreen } from "components";
import { ButtonBlue, ButtonOutlineBlue, SpinnerDotBlock, AlertSubmitError } from "components/ma";
import { FieldInputBudrestNo } from "./field-input-budrest-no";
import { ScoreGridForm } from "./score-grid-form";

import IconBow from "components/ma/icons/mono/bow";
import IconDistance from "components/ma/icons/mono/arrow-left-right";
import IconCross from "components/ma/icons/mono/cross";

import { errorsUtil } from "utils";
import { makeScoringPayload } from "./utils";

function EditorContent({ bracketProps, configs, onClose, onSuccess }) {
  const location = useLocation();
  const { roundIndex, seedIndex, seed } = bracketProps;
  const memberId = seed.teams.find((team) => Boolean(team.id))?.id;

  const scoring = {
    code: `2-${memberId}-1`,
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

  const isLoadingScoringDetail = scoringDetailStatus === "loading";
  const isLoadingSubmit = statusSubmit === "loading";
  const isErrorSubmit = statusSubmit === "error";

  const computeCategoryLabel = () => {
    const { competitionCategoryId, ageCategoryId } = location.state.category;
    return `${competitionCategoryId} ${ageCategoryId}`;
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
          <HUDPlayerTop>
            <PlayerName>{scoringDetail[0].participant.name}</PlayerName>
            <PlayerScores>
              {scoringDetail[0].scores.total}-{scoringDetail[1].scores.total}
            </PlayerScores>
            <PlayerName>{scoringDetail[1].participant.name}</PlayerName>
          </HUDPlayerTop>

          {location?.state?.category && (
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

          <EditorFooter>
            <div></div>
            {isEditMode ? (
              <SpacedButtonsGroup>
                <ButtonClose onClick={handleCancelSessionGrid}>Batal</ButtonClose>
                <ButtonBlue onClick={handleSubmitSessionGrid}>Simpan</ButtonBlue>
                <ButtonOutlineBlue onClick={() => {}}>Tentukan</ButtonOutlineBlue>
              </SpacedButtonsGroup>
            ) : (
              <SpacedButtonsGroup>
                <ButtonBlue onClick={() => setEditMode(true)}>Ubah Skor</ButtonBlue>
              </SpacedButtonsGroup>
            )}
          </EditorFooter>
        </React.Fragment>
      ) : (
        <div>
          Ada error dalam mengambil data scoring. Silakan coba kembali beberapa saat lagi, atau
          hubungi technical support.
        </div>
      )}

      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={submitErrors} onConfirm={() => {}} />
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
  flex: 1 24 100px;
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
