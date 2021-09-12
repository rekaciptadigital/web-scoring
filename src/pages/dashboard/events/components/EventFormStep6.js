import { Button } from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom"

export const EventFormStep6 = () => {
  return (
    <>
      <Row>
        <Col lg={12} style={{textAlign: 'center'}}>
          <h3>Selamat, eventmu sudah live</h3>
          <Link to="/dashboard">
            <Button label="Kembali ke Beranda" type="success" />
          </Link>
        </Col>
      </Row>
    </>
  );
};
