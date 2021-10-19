import * as React from "react";

import { Container, Col, Row, Card, CardBody, Button } from "reactstrap";
import { Breadcrumbs } from "components";

export default function CertificateNew() {
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Dashboards" breadcrumbItems={[{ title: "Dashboard" }]} />
        <Row>
          <Col lg="12">
            <Row>
              <Col lg="8">
                <h1>Sertifikat Peserta </h1>
                <p>
                  Klik untuk mengubah jenis dan ukuran teks. Geser untuk mengatur komposisi
                  sertifikat.
                </p>
              </Col>

              <Col lg="4">
                <div className="float-end">
                  <Button color="primary" className="ms-2 mw-50">
                    Save
                  </Button>
                  <Button color="secondary" className="ms-2 mw-50">
                    Preview
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg="8">
                <Card>
                  <CardBody>
                    <div className="ratio ratio-16x9">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                          <h1 className="text-uppercase">NAMA PESERTA</h1>

                          <hr />

                          <p className="mb-0">Peringkat/Posisi Kepesertaan</p>
                          <p>
                            <strong>Kategori</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="4">
                <div className="ratio ratio-16x9">
                  <div className="d-flex justify-content-center align-items-center bg-secondary bg-opacity-10">
                    <div className="text-center">
                      <Button color="primary">
                        <i className="bx bx-plus font-size-18 align-middle"></i> Upload Background
                      </Button>
                      <p className="mt-3 mb-0">PNG/JPEG, Ukuran 1280 x 908 pixel</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
