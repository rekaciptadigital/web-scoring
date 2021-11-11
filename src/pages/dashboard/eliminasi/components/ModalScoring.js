import * as React from "react";
import { ScoringService } from "services";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Button } from "reactstrap";
import ScoringGrid from "./ScoringGrid";

const computeMemberName = (data) => data?.participant.member.name;
const computeCategoryLabel = (data) => {
  return data?.[0]?.participant.categoryLabel || data?.[1]?.participant.categoryLabel;
};

export default function ModalScoring({ data: { scoringData, ...contextDetails }, modalControl }) {
  scoringData = scoringData ?? [];
  const { isModalScoringOpen, toggleModalScoring, closeModalScoring } = modalControl;
  const [, setIsLoading] = React.useState(false);
  // cuman yang bagian `scores`-nya di payload
  const [membersScoringData, setMembersScoringData] = React.useState([]);

  const handleGridChange = (index, ev) => {
    setMembersScoringData((value) => {
      const membersScoringUpdated = [...value];
      membersScoringUpdated[index] = { ...ev };
      return membersScoringUpdated;
    });
  };

  const handleClickSimpan = async () => {
    setIsLoading(true);

    const { type, round, match, elimination_id } = contextDetails;
    const data = {
      elimination_id: elimination_id,
      round: round,
      match: match,
      type: type,
      save_permanent: 0,
      members: [
        {
          memberId: scoringData[0].participant.member.id,
          scores: membersScoringData[0],
        },
        {
          memberId: scoringData[1].participant.member.id,
          scores: membersScoringData[1],
        },
      ],
    };
    const result = await ScoringService.saveParticipantScore(data);

    setIsLoading(false);
  };

  const handleClickTentukan = () => alert("Tentukan!");

  return (
    <Modal
      size="xl"
      backdrop="static"
      autoFocus={true}
      centered={true}
      isOpen={isModalScoringOpen}
      toggle={() => toggleModalScoring()}
      onClosed={() => closeModalScoring()}
    >
      <ModalHeader toggle={() => toggleModalScoring()}>Set Scoring</ModalHeader>
      <ModalBody>
        {scoringData?.length ? (
          <React.Fragment>
            <Row className="mt-4 mb-4">
              <Col>
                <h4 className="text-center">{computeCategoryLabel(scoringData)}</h4>
              </Col>
            </Row>

            <Row>
              <Col className="border-end border-2 px-4">
                <h5 className="text-center mb-3">{computeMemberName(scoringData[0])}</h5>
                <ScoringGrid
                  data={scoringData[0].scores}
                  onChange={(ev) => handleGridChange(0, ev)}
                />
              </Col>

              <Col className="px-4">
                <h5 className="text-center mb-3">{computeMemberName(scoringData[1])}</h5>
                <ScoringGrid
                  data={scoringData[1].scores}
                  onChange={(ev) => handleGridChange(1, ev)}
                />
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <div>Preparing...</div>
        )}
      </ModalBody>

      {scoringData?.length && (
        <ModalFooter>
          <React.Fragment>
            <Button color="primary" onClick={handleClickSimpan}>
              Simpan
            </Button>

            <Button color="success" onClick={handleClickTentukan}>
              Tentukan
            </Button>
          </React.Fragment>
        </ModalFooter>
      )}
    </Modal>
  );
}
