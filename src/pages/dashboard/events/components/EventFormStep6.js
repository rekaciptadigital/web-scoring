import { Button } from "components";
import React from "react";
import { Col, Row } from "reactstrap";

export const EventFormStep6 = () => {
  return (
    <>
      <Row>
        <Col lg={12} style={{textAlign: 'center'}}>
          <h3>Selamat, eventmu sudah live</h3>
          <Button label="Kembali ke Beranda" type="success" />
        </Col>
      </Row>
    </>
  );
};
