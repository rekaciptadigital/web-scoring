import * as React from "react";
import styled from "styled-components";
import { ScoringService } from "services";

import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Button } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import ScoringGrid from "./ScoringGrid";

const computeScoringTypeId = (data) => {
  return data[0].scores.eliminationtScoreType || data[1].scores.eliminationtScoreType;
};
const computeScoringTypeLabel = (data, options) => {
  const typeId = computeScoringTypeId(data);
  const typeObj = options.find((type) => parseInt(type.id) === parseInt(typeId));
  return typeObj.label;
};
const computeMemberId = (data) => data?.participant.member.id;
const computeMemberName = (data) => data?.participant.member.name;
const computeClubName = (data) => {
  if (data?.participant.club) {
    return `(${data?.participant.club})`;
  }
  return <span style={{ color: "var(--bs-gray-400)" }}>&mdash;</span>;
};
const computeCategoryLabel = (data) => {
  return data?.[0]?.participant.categoryLabel || data?.[1]?.participant.categoryLabel;
};
const computeTotalPoints = (data) => {
  return data?.shot.reduce((prev, rambahan) => prev + Number(rambahan.point), 0);
};

const computeTotalScores = (data) => {
  return data?.shot.reduce((prev, rambahan) => prev + Number(rambahan.total), 0);
};

export default function ModalScoring({
  matchData,
  scoringDetail,
  onChangeScoringDetail,
  isOpen,
  onToggle,
  onClosed,
  onSavePermanent,
  scoringTypeOptions,
  refetchScoreDetail,
}) {
  const { queryStringRefetch, updated, teams } = matchData;

  const [isLoading, setIsLoading] = React.useState(false);
  const [savingStatus, setSavingStatus] = React.useState("idle");
  const [alertSavePermanent, setAlertSavePermanent] = React.useState(false);

  const handleToggle = () => onToggle();

  // cuman yang bagian `scores`-nya di payload
  // supaya bisa dipakai untuk refetch setelah save
  const modalScoringData = scoringDetail.map((data) => data.scores);

  const isScoringEnabled = () => {
    return !updated && teams.every((team) => team.win === 0);
  };

  const hasWinner = !isScoringEnabled();

  const handleGridChange = (index, ev) => {
    onChangeScoringDetail(index, ev);
  };

  const computeDataToSave = () => {
    const { type, round, match, elimination_id } = queryStringRefetch;
    return {
      save_permanent: 0,
      elimination_id: elimination_id,
      round: round,
      match: match,
      type: type,
      members: [
        {
          memberId: computeMemberId(scoringDetail[0]),
          scores: modalScoringData[0],
        },
        {
          memberId: computeMemberId(scoringDetail[1]),
          scores: modalScoringData[1],
        },
      ],
    };
  };

  const handleClickSave = async () => {
    setIsLoading(true);
    const { success } = await ScoringService.saveParticipantScore({ ...computeDataToSave() });

    if (success) {
      const refetch = await refetchScoreDetail();
      if (refetch.success) {
        setSavingStatus("success");
      } else {
        setSavingStatus("error");
      }
    } else {
      setSavingStatus("error");
    }
    setIsLoading(false);

    setTimeout(() => {
      setSavingStatus("idle");
    }, 3000);
  };

  const handleClickTentukan = () => setAlertSavePermanent(true);

  const handleConfirmSavePermanent = () => {
    setAlertSavePermanent(false);
    executeSavePermanent();
  };

  const executeSavePermanent = async () => {
    setIsLoading(true);
    const { success } = await ScoringService.saveParticipantScore({
      ...computeDataToSave(),
      save_permanent: 1,
    });

    if (success) {
      onSavePermanent?.();

      const refetch = await refetchScoreDetail();
      if (refetch.success) {
        setSavingStatus("success");
      } else {
        setSavingStatus("error");
      }
    } else {
      setSavingStatus("error");
    }

    setIsLoading(false);

    setTimeout(() => {
      setSavingStatus("idle");
    }, 3000);
  };

  return (
    <Modal
      size="xl"
      backdrop="static"
      autoFocus={true}
      centered={true}
      isOpen={isOpen}
      toggle={handleToggle}
      onClosed={() => onClosed()}
    >
      <ModalHeader toggle={handleToggle}>
        Set Scoring &mdash; {computeScoringTypeLabel(scoringDetail, scoringTypeOptions)}
      </ModalHeader>

      <ModalBody>
        <SavingOverlay loading={isLoading} />

        {scoringDetail?.length ? (
          <React.Fragment>
            <Row className="mt-4 mb-4">
              <Col>
                <h4 className="text-center">{computeCategoryLabel(scoringDetail)}</h4>
              </Col>
            </Row>

            <Row>
              <Col className="border-end border-2 px-4">
                <h5 className="text-center">{computeMemberName(scoringDetail[0])}</h5>
                <h6 className="text-center mb-3">{computeClubName(scoringDetail[0])}</h6>

                {computeScoringTypeId(scoringDetail) === 1 && (
                  <PointsDisplay
                    scoringType={1}
                    point={computeTotalPoints(modalScoringData[0])}
                    hasWinner={hasWinner}
                    winningStatus={modalScoringData[0].win}
                  />
                )}
                {computeScoringTypeId(scoringDetail) === 2 && (
                  <PointsDisplay
                    scoringType={2}
                    point={computeTotalScores(modalScoringData[0])}
                    hasWinner={hasWinner}
                    winningStatus={modalScoringData[0].win}
                  />
                )}

                {!hasWinner && (
                  <ScoringGrid
                    scoringType={computeScoringTypeId(scoringDetail)}
                    scores={modalScoringData[0]}
                    onChange={(ev) => handleGridChange(0, ev)}
                  />
                )}
              </Col>

              <Col className="px-4">
                <h5 className="text-center">{computeMemberName(scoringDetail[1])}</h5>
                <h6 className="text-center mb-3">{computeClubName(scoringDetail[1])}</h6>

                {computeScoringTypeId(scoringDetail) === 1 && (
                  <PointsDisplay
                    scoringType={1}
                    point={computeTotalPoints(modalScoringData[1])}
                    hasWinner={hasWinner}
                    winningStatus={modalScoringData[1].win}
                  />
                )}
                {computeScoringTypeId(scoringDetail) === 2 && (
                  <PointsDisplay
                    scoringType={2}
                    point={computeTotalScores(modalScoringData[1])}
                    hasWinner={hasWinner}
                    winningStatus={modalScoringData[1].win}
                  />
                )}

                {!hasWinner && (
                  <ScoringGrid
                    scoringType={computeScoringTypeId(scoringDetail)}
                    scores={modalScoringData[1]}
                    onChange={(ev) => handleGridChange(1, ev)}
                  />
                )}
              </Col>
            </Row>

            <SweetAlert
              title=""
              show={alertSavePermanent}
              custom
              btnSize="md"
              reverseButtons={true}
              showCancel
              cancelBtnText="Batal"
              confirmBtnText="OK"
              confirmBtnBsStyle="outline-primary"
              cancelBtnBsStyle="primary"
              onConfirm={handleConfirmSavePermanent}
              onCancel={() => setAlertSavePermanent(false)}
              style={{ padding: "30px 40px" }}
            >
              <p className="text-muted">
                Skor tidak akan dapat diubah lagi. Pastikan semua skor telah diisi dengan benar.
              </p>
            </SweetAlert>
          </React.Fragment>
        ) : (
          <div>Preparing...</div>
        )}
      </ModalBody>

      {scoringDetail?.length && (
        <ModalFooter>
          {hasWinner ? (
            <Button color="primary" onClick={() => onClosed()}>
              Selesai
            </Button>
          ) : (
            <div style={{ position: "relative" }}>
              <Button color="primary" onClick={handleClickSave}>
                Simpan
              </Button>

              <Button
                color="success"
                outline
                className="ms-2"
                onClick={handleClickTentukan}
                disabled={false}
              >
                Tentukan
              </Button>

              <FeedBackSavingStatus status={savingStatus} />
            </div>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
}

function PointsDisplay({ scoringType, point = 0, winningStatus, hasWinner }) {
  return (
    <StyledPointsDisplay className="mt-4 mb-4" hasWinner={hasWinner} winningStatus={winningStatus}>
      <span className="label-point">
        {scoringType === 1 && "point"}
        {scoringType === 2 && "skor"}
      </span>
      <span>{point}</span>
    </StyledPointsDisplay>
  );
}

const colorByWinning = ({ hasWinner, winningStatus }) => {
  if (hasWinner) {
    return winningStatus ? "var(--bs-success)" : "var(--bs-gray)";
  }
  return "var(--bs-primary)";
};

const StyledPointsDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 6px 20px;
  max-width: 60px;
  border-radius: 4px;
  border: solid 1px ${(props) => colorByWinning(props)};

  color: ${(props) => colorByWinning(props)};
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;

  .label-point {
    font-size: 0.35em;
    font-weight: normal;
  }
`;

function SavingOverlay({ loading }) {
  if (loading) {
    return (
      <SavingOverlayContainer>
        <h5 className="text-muted">Menyimpan...</h5>
      </SavingOverlayContainer>
    );
  }
  return null;
}

const SavingOverlayContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  opacity: 0.8;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
`;

function FeedBackSavingStatus({ status }) {
  if (status === "success") {
    return (
      <FeedbackMessageSaving className="text-success">
        Skor berhasil disimpan!
      </FeedbackMessageSaving>
    );
  }

  if (status === "error") {
    return (
      <FeedbackMessageSaving className="text-danger">Gagal menyimpan skor!</FeedbackMessageSaving>
    );
  }

  return null;
}

const FeedbackMessageSaving = styled.div`
  position: absolute;
  top: 0.8em;
  left: -100%;
  opacity: 0.5;
`;
