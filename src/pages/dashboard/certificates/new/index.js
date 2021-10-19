import * as React from "react";

import { Container, Col, Row, Card, CardBody, Button, Modal, ModalBody } from "reactstrap";
import { Breadcrumbs } from "components";

// TODO: Hapus ganti dengan length dari list image yang user sudah pernah upload
const count = 0;

export default function CertificateNew() {
  const [isModePilihBg, setModePilihBg] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [isModePreview, setModePreview] = React.useState(false);

  const handleOpenPilihBg = () => setModePilihBg(true);
  const handleClosePilihBg = () => setModePilihBg(false);
  const handleTogglePilihBg = () => setModePilihBg((isPilihBg) => !isPilihBg);
  const handleSelectPilihBg = () => {
    // logic pilih bg
    // ...
    // mock
    setImage("image");
    handleClosePilihBg();
  };
  const handleHapusBg = () => setImage(null);

  const handleOpenPreview = () => setModePreview(true);
  const handleClosePreview = () => setModePreview(false);
  const handleTogglePreview = () => setModePreview((isModePreview) => !isModePreview);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Dashboards" breadcrumbItems={[{ title: "Dashboard" }]} />

        {/* Konten */}
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
                  <Button
                    color="secondary"
                    className="ms-2 mw-50"
                    onClick={() => handleOpenPreview()}
                  >
                    Preview
                  </Button>

                  <Modal
                    isOpen={isModePreview}
                    size="xl"
                    autoFocus={true}
                    centered={true}
                    className="modalPreview"
                    tabIndex="-1"
                    toggle={() => handleTogglePreview()}
                  >
                    <ModalBody>
                      <div className="ratio ratio-16x9">
                        <div
                          className="d-flex justify-content-center align-items-center "
                          style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                        >
                          Preview
                        </div>
                      </div>
                      <div className="mt-4 mb-2 text-center">
                        <Button color="primary" onClick={() => handleClosePreview()}>
                          Tutup
                        </Button>
                      </div>
                    </ModalBody>
                  </Modal>
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
                    {image ? (
                      <div className="text-center">
                        <Button color="primary" onClick={() => handleOpenPilihBg()}>
                          Ganti Background
                        </Button>
                        <Button
                          color="link"
                          className="link-danger ms-2"
                          onClick={() => handleHapusBg()}
                        >
                          <i className="bx bx-trash font-size-18 align-middle" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Button color="primary" onClick={() => handleOpenPilihBg()}>
                          <i className="bx bx-image-add font-size-18 align-middle" /> Pilih
                          Background
                        </Button>
                        <p className="mt-3 mb-0">PNG/JPEG, Ukuran 1280 x 908 pixel</p>
                      </div>
                    )}
                  </div>
                </div>

                <Modal
                  isOpen={isModePilihBg}
                  size="xl"
                  autoFocus={true}
                  centered={true}
                  className="modalPilihBg"
                  tabIndex="-1"
                  toggle={() => handleTogglePilihBg()}
                >
                  <ModalBody>
                    <div
                      style={{
                        position: "relative",
                        overflowX: count > 4 ? "scroll" : "hidden",
                        display: "grid",
                        gridTemplateColumns: "repeat(5, minmax(200px,300px))",
                        gap: 40,
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 10,
                          height: 200,
                          width: 200,
                          borderRadius: 10,
                          backgroundColor: "silver",
                          opacity: 0.4,
                          cursor: "pointer",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <i className="bx bx-image-add fs-1 align-middle" />
                      </div>
                      <div
                        style={{
                          marginBottom: 10,
                          height: 200,
                          width: 200,
                          borderRadius: 10,
                          backgroundColor: "silver",
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        style={{
                          marginBottom: 10,
                          height: 200,
                          width: 200,
                          borderRadius: 10,
                          backgroundColor: "silver",
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        style={{
                          marginBottom: 10,
                          height: 200,
                          width: 200,
                          borderRadius: 10,
                          backgroundColor: "silver",
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        style={{
                          marginBottom: 10,
                          height: 200,
                          width: 200,
                          borderRadius: 10,
                          backgroundColor: "silver",
                          opacity: 0.2,
                        }}
                      ></div>
                      <div
                        style={{
                          position: "absolute",
                          width: 150,
                          height: "100%",
                          top: 0,
                          bottom: 0,
                          right: 0,
                          background: "linear-gradient(to right, rgba(255,255,255,0), #ffffff)",
                        }}
                      ></div>
                    </div>

                    <div className="float-end mt-3">
                      <Button color="primary" onClick={() => handleSelectPilihBg()}>
                        Pilih
                      </Button>
                      <Button
                        color="secondary"
                        className="ms-2"
                        onClick={() => handleClosePilihBg()}
                      >
                        Batal
                      </Button>
                    </div>
                  </ModalBody>
                </Modal>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
