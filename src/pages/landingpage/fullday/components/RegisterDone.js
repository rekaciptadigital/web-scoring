import React from "react";
import { Row, Col, Button } from "reactstrap";
import styled from "styled-components";
import MetaTags from "react-meta-tags";
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";

const H4 = styled.h4`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: #495057;
`;

const H5 = styled.h5`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 140%;
  text-align: center;
  color: #000000;
`;

const Content = styled.div`
  margin-top: 250px;
  margin-bottom: 200px;
`;

const RegisterDone = () => {
  return (
    <React.Fragment>
      <MetaTags>
        <title>ICO Landing | Skote - React Admin & Dashboard Template</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />

      <Content>
        <Row className="text-center">
          <H4>Pendaftaran Jakarta Archery 2021</H4>
          <H5>Transaksi Anda Berhasil! </H5>
          <p>Bukti pembayaran akan dikirim ke email terdaftar:</p>
          <span>nama@mail.com</span>

          <Col sm={12}>
            <Button
              href="/full-day"
              type="button"
              style={{ backgroundColor: "#0D47A1", marginTop: "20px" }}
            >
              Kembali ke Dashboard
            </Button>
          </Col>
        </Row>
      </Content>

      <Footer />
    </React.Fragment>
  );
};

export default RegisterDone;
