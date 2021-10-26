import * as React from "react";
// TODO: untuk generate string HTML dari editor
// import ReactDOMServer from "react-dom/server";
import { optionsFontSize, optionsFontFamily, getSelectedFontFamily } from "../utils";

import { Container, Col, Row, Card, CardBody, Button, Modal, ModalBody } from "reactstrap";
import Select from "react-select";
import { Breadcrumbs } from "components";
import BgImageUploader from "../components/BgImageUploader";
import EditorCanvas from "../components/EditorCanvas";

// TODO: generate string HTML
// console.log(ReactDOMServer.renderToString(<EditorPreviewArea />));

const initialEditorData = {
  paperSize: "A4", // || [1280, 908] || letter
  fields: {
    member_name: {
      x: 640,
      y: 280,
      fontFamily: "'Poppins', sans-serif",
      fontSize: 60,
    },
    peringkat_name: {
      x: 640,
      y: 370,
      fontFamily: "'Poppins', sans-serif",
      fontSize: 36,
    },
    kategori_name: {
      x: 640,
      y: 430,
      fontFamily: "'Poppins', sans-serif",
      fontSize: 36,
    },
  },
};

export default function CertificateNew() {
  const [image, setImage] = React.useState(null);
  const [isModePreview, setModePreview] = React.useState(false);

  const [editorData, setEditorData] = React.useState(null);
  const [currentObject, setCurrentObject] = React.useState({ name: undefined });

  React.useEffect(() => {
    // Mock untuk data awal dari server
    setEditorData(initialEditorData);
  }, []);

  const handleEditorChange = (data) => {
    setEditorData((editorData) => {
      const editorDataUpdated = { ...editorData };
      const fieldData = editorDataUpdated.fields[currentObject.name];
      editorDataUpdated.fields[currentObject.name] = {
        ...fieldData,
        ...data,
      };
      return editorDataUpdated;
    });
  };

  const handleFontSizeChange = (ev) => {
    const { value } = ev;
    setEditorData((data) => {
      const dataUpdated = { ...data };
      dataUpdated.fields[currentObject.name].fontSize = value;
      return dataUpdated;
    });
  };

  const handleFontFamilyChange = (ev) => {
    const { value } = ev;
    setEditorData((data) => {
      const dataUpdated = { ...data };
      dataUpdated.fields[currentObject.name].fontFamily = value;
      return dataUpdated;
    });
  };

  const handleSelectBg = () => setImage("image nih");
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
                    size="lg"
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
                    {editorData ? (
                      <EditorCanvas
                        data={editorData}
                        onChange={(data) => handleEditorChange(data)}
                        currentObject={currentObject}
                        onSelect={(target) => setCurrentObject(target)}
                      />
                    ) : (
                      <div>Loading data...</div>
                    )}
                  </CardBody>
                </Card>
              </Col>

              <Col lg="4">
                <div className="ratio ratio-16x9">
                  <div className="d-flex justify-content-center align-items-center bg-secondary bg-opacity-10">
                    <BgImageUploader
                      image={image}
                      onSelectImage={() => handleSelectBg()}
                      onRemoveImage={() => handleHapusBg()}
                    />
                  </div>
                </div>

                {currentObject?.name && (
                  <div className="mt-5">
                    <div>
                      <label>Font family:</label>
                      <Select
                        options={optionsFontFamily}
                        placeholder="Font Family"
                        value={getSelectedFontFamily(
                          optionsFontFamily,
                          editorData.fields[currentObject?.name]
                        )}
                        onChange={(ev) => handleFontFamilyChange(ev)}
                      />
                    </div>

                    <div className="mt-2">
                      <label>Font size:</label>
                      <Select
                        options={optionsFontSize}
                        placeholder="font size"
                        value={{
                          value: editorData.fields[currentObject?.name]?.fontSize,
                          label: editorData.fields[currentObject?.name]?.fontSize,
                        }}
                        onChange={(ev) => handleFontSizeChange(ev)}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
