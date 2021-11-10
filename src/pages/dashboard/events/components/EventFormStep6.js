import { Button } from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

export const EventFormStep6 = () => {
  return (
    <Row>
      <Col
        lg={12}
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{ height: 300 }}
      >
        <h3>Selamat, Eventmu Sudah Live</h3>

        <div className="mt-4">
          <Link to="/dashboard">
            <Button label="Kembali ke Beranda" type="success" />
          </Link>
        </div>
      </Col>
    </Row>
  );
};
