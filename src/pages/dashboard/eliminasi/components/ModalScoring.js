import * as React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Button } from "reactstrap";
import ScoringGrid from "./ScoringGrid";

const computeMemberName = (data) => data?.participant.member.name;
const computeCategoryLabel = (data) => {
  return data?.[0]?.participant.categoryLabel || data?.[1]?.participant.categoryLabel;
};

export default function ModalScoring({ data: scoringData, modalControl }) {
  scoringData = scoringData ?? [];
  const { isModalScoringOpen, toggleModalScoring, closeModalScoring } = modalControl;

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
                <ScoringGrid data={scoringData[0].scores} />
              </Col>

              <Col className="px-4">
                <h5 className="text-center mb-3">{computeMemberName(scoringData[1])}</h5>
                <ScoringGrid data={scoringData[1].scores} />
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
            <Button color="primary">Simpan</Button>
            <Button color="success">Tentukan</Button>
          </React.Fragment>
        </ModalFooter>
      )}
    </Modal>
  );
}
