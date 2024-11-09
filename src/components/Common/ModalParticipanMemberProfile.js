import React from "react";
import Avatar from "../../assets/images/users/avatar-man.png";
import { Row, Col, ModalBody, Button, Modal } from "reactstrap";

// Functional Component untuk ModalParticipantMemberProfile
const ModalParticipantMemberProfile = React.memo((props) => {
  const { participant, toggle, isOpen } = props;

  return (
    <Modal isOpen={isOpen} fade={false} toggle={toggle}>
      <ModalBody>
        <Row>
          <Col md={2}>
            <img
              src={Avatar}
              alt=""
              className="avatar-md rounded-circle img-thumbnail"
              style={{ height: 'auto' }}
            />
          </Col>
          <Col md={12}>
            <h4>{participant?.member?.name}</h4>
            <span>{participant?.club}</span>
          </Col>
          <Col md={6}>
            <div>
              <h6>{participant?.phoneNumber}</h6>
            </div>
            <div>
              <h6>Email</h6>
              <p>{participant?.email}</p>
            </div>
          </Col>
          <Col md={6}>
            <div>
              <h6>Tanggal Lahir</h6>
              <p>{participant?.birthdate}</p>
            </div>
            <div>
              <h6>Jenis Kelamin</h6>
              <p>{participant?.gender}</p>
            </div>
          </Col>
          <Col md={12}>
            <Button color="secondary" onClick={toggle}>
              Close
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
});

export default ModalParticipantMemberProfile;
