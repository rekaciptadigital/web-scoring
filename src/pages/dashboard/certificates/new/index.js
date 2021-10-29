import * as React from "react";
import {
  optionsFontSize,
  optionsFontFamily,
  getSelectedFontFamily,
  renderTemplateString,
  convertBase64,
} from "../utils";

import { Container, Col, Row, Card, Button, Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import Select from "react-select";

import { Breadcrumbs } from "components";
import EditorBgImagePicker from "../components/EditorBgImagePicker";
import EditorCanvasHTML from "../components/EditorCanvasHTML";

const initialEditorData = {
  paperSize: "A4", // || [1280, 908] || letter
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: null,
  backgroundImage: null, // base64, yang nanti diupload
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
  const [editorData, setEditorData] = React.useState(null);
  const [currentObject, setCurrentObject] = React.useState({ name: undefined });

  const [isModePreview, setModePreview] = React.useState(false);

  const image = {
    preview: editorData?.backgroundUrl || editorData?.backgroundPreviewUrl || null,
    raw: editorData?.backgroundFileRaw || null,
  };

  React.useEffect(() => {
    // TODO: pakai data yang di-fetch dari backend
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

  const handleFontColorChange = (color) => {
    setEditorData((data) => {
      const dataUpdated = { ...data };
      dataUpdated.fields[currentObject.name].color = color.hex;
      return dataUpdated;
    });
  };

  const handleFontBoldChange = () => {
    setEditorData((data) => {
      const dataUpdated = { ...data };
      const currentWeight = dataUpdated.fields[currentObject.name].fontWeight;
      dataUpdated.fields[currentObject.name].fontWeight = currentWeight ? undefined : "bold";
      return dataUpdated;
    });
  };

  const handleSelectBg = (imageData) => {
    if (!imageData) {
      return;
    }
    const imagePreviewUrl = URL.createObjectURL(imageData);
    setEditorData((data) => {
      return {
        ...data,
        backgroundPreviewUrl: imagePreviewUrl,
        backgroundFileRaw: imageData,
      };
    });
  };

  const handleHapusBg = () => {
    setEditorData((data) => {
      return {
        ...data,
        backgroundPreviewUrl: undefined,
        backgroundFileRaw: undefined,
        backgroundUrl: undefined,
      };
    });
  };

  const handleClickSave = async () => {
    const data = await prepareSaveData(editorData);
    console.log(data);
  };

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
                  <Button color="primary" className="ms-2 mw-50" onClick={() => handleClickSave()}>
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
                  {editorData ? (
                    <EditorCanvasHTML
                      data={editorData}
                      onChange={(data) => handleEditorChange(data)}
                      currentObject={currentObject}
                      onSelect={(target) => setCurrentObject(target)}
                    />
                  ) : (
                    <div>Loading data...</div>
                  )}
                </Card>
              </Col>

              <Col lg="4">
                <div className="ratio ratio-16x9">
                  <EditorBgImagePicker
                    image={image}
                    onSelectImage={(imageData) => handleSelectBg(imageData)}
                    onRemoveImage={() => handleHapusBg()}
                  />
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

                    <div className="mt-2">
                      <label>Font color:</label>
                      <div>
                        <ColorPickerContainer color={editorData.fields[currentObject?.name]?.color}>
                          <CompactPicker
                            color={editorData.fields[currentObject?.name]?.color}
                            onChange={(color) => handleFontColorChange(color)}
                          />
                        </ColorPickerContainer>
                      </div>
                    </div>

                    <div className="mt-2">
                      <label>Bold?</label>
                      <div>
                        <FontBoldToggle
                          bold={editorData.fields[currentObject?.name]?.fontWeight}
                          onChange={() => handleFontBoldChange()}
                        />
                      </div>
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

function ColorPickerContainer({ children, color = "#495057" }) {
  const [isShowPicker, setShowPicker] = React.useState(false);
  return (
    <React.Fragment>
      <div
        style={{
          padding: 5,
          width: 42,
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 0 0 1px rgb(204, 204, 204)",
          display: "inline-block",
          cursor: "pointer",
          textAlign: "center",
        }}
        onClick={() => setShowPicker((show) => !show)}
      >
        <h5
          style={{
            margin: 0,
            fontWeight: 700,
            color: color,
          }}
        >
          A
        </h5>
        <div />
      </div>

      {isShowPicker && (
        <div style={{ position: "absolute" }}>
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={() => setShowPicker(false)}
          />
          {children}
        </div>
      )}
    </React.Fragment>
  );
}

function FontBoldToggle({ onChange, bold = false }) {
  return (
    <div
      style={{
        padding: 5,
        width: 42,
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 0 0 1px rgb(204, 204, 204)",
        display: "inline-block",
        cursor: "pointer",
        textAlign: "center",
      }}
      onClick={() => onChange?.()}
    >
      <h5
        style={{
          margin: 0,
          fontWeight: bold ? "700" : undefined,
        }}
      >
        B
      </h5>
      <div />
    </div>
  );
}

// TODO: refaktor jadi service
async function prepareSaveData(editorData) {
  const dataCopy = { ...editorData };
  dataCopy.backgroundImage = await convertBase64(dataCopy.backgroundFileRaw);
  const certificateHtmlTemplate = renderTemplateString(dataCopy);

  const savedEditorData = {
    paperSize: dataCopy.paperSize,
    fields: dataCopy.fields,
  };

  const payload = {
    htmlTemplate: certificateHtmlTemplate,
    backgroundImage: dataCopy.backgroundImage || dataCopy.backgroundFileRaw || undefined,
    backgroundUrl: dataCopy.backgroundUrl || undefined,
    editorData: savedEditorData,
  };

  return payload;
}
