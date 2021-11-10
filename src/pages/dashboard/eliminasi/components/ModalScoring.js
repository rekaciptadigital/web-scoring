import * as React from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col, Button } from "reactstrap";
import ScoringGrid from "./ScoringGrid";

export default function ModalScoring({ modalControl }) {
  const { isModalScoringOpen, toggleModalScoring, closeModalScoring } = modalControl;

  const dataPlayer1 = {};
  const dataPlayer2 = {};

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
        <Row className="mt-4 mb-4">
          <Col>
            <h4 className="text-center">Individu-U-16-Compound-30m</h4>
          </Col>
        </Row>

        <Row>
          <Col className="border-end border-2 px-4">
            <h5 className="text-center mb-3">M PASHA ASSALAFI</h5>
            <ScoringGrid data={dataPlayer1} />
          </Col>

          <Col className="px-4">
            <h5 className="text-center mb-3">Muhammad Ihsan Hafizh</h5>
            <ScoringGrid data={dataPlayer2} />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Simpan</Button>
        <Button color="success">Tentukan</Button>
      </ModalFooter>
    </Modal>
  );
}
