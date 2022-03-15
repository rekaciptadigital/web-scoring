import * as React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { CertificateService } from "services";
import {
  optionsFontSize,
  optionsFontFamily,
  optionsTypeCertificate,
  getCurrentTypeCertificate,
  getSelectedFontFamily,
  renderTemplateString,
  convertBase64,
} from "../utils";
import { DEJAVU_SANS } from "../utils/font-family-list";
import { certificateFields } from "constants/index";

import MetaTags from "react-meta-tags";
import { Container, Col, Row, Card, Button as BSButton, Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";
import { BreadcrumbDashboard } from "pages/dashboard/events/components/breadcrumb";

import EditorBgImagePicker from "../components/EditorBgImagePicker";
import EditorCanvasHTML from "../components/EditorCanvasHTML";
import FontBoldToggle from "../components/FontBoldToggle";
import ColorPickerContainer from "../components/ColorPickerContainer";
import PreviewCanvas from "../components/preview/PreviewCanvas";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME, LABEL_RANK } = certificateFields;

const defaultEditorData = {
  paperSize: "A4", // || [1280, 908] || letter
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  fields: [
    {
      name: LABEL_MEMBER_NAME,
      x: 640,
      y: 280,
      fontFamily: DEJAVU_SANS,
      fontSize: 60,
    },
    {
      name: LABEL_RANK,
      x: 640,
      y: 370,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_CATEGORY_NAME,
      x: 640,
      y: 430,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
  ],
};

export default function CertificateNew() {
  const isMounted = React.useRef(null);
  const abortControllerRef = React.useRef(null);
  const [currentCertificateType, setCurrentCertificateType] = React.useState(1);
  const [status, setStatus] = React.useState("idle");
  const [editorData, setEditorData] = React.useState(null);
  const [currentObject, setCurrentObject] = React.useState(null);
  const [isEditorDirty, setEditorAsDirty] = React.useState(false);

  const targetCertificateType = React.useRef(1);
  const [needSavingConfirmation, setNeedSavingConfirmation] = React.useState(false);

  const [isModePreview, setModePreview] = React.useState(false);

  const isSaving = status === "saving";
  const isLoading = status === "loading";

  const setEditorClean = () => setEditorAsDirty(false);
  const setEditorDirty = () => setEditorAsDirty(true);

  const image = {
    preview: editorData?.backgroundPreviewUrl || editorData?.backgroundUrl || null,
    raw: editorData?.backgroundFileRaw || null,
  };

  const event_id = new URLSearchParams(useLocation().search).get("event_id");
  const eventId = parseInt(event_id);

  React.useEffect(() => {
    isMounted.current = true;
    abortControllerRef.current = new AbortController();
    return () => {
      isMounted.current = false;
      abortControllerRef.current.abort();
    };
  }, []);

  React.useEffect(() => {
    setStatus("loading");

    const getCertificateData = async () => {
      const queryString = { event_id, type_certificate: currentCertificateType };
      const result = await CertificateService.getForEditor(
        queryString,
        abortControllerRef.current.signal
      );

      // Batalkan update state ketika komponen udah di-unmount.
      // Menghindari memory leak ketika belum selesai loading tapi user pindah halamanan.
      // Data sertifikat makan memory besar.
      if (!isMounted.current) {
        return;
      }

      if (result.success) {
        // Data editor dari data sertifikat yang sudah ada di server
        const parsedEditorData = result.data.editorData ? JSON.parse(result.data.editorData) : "";
        setEditorData({
          ...defaultEditorData,
          typeCertificate: currentCertificateType,
          certificateId: result.data.id,
          backgroundUrl: result.data.backgroundUrl,
          fields: parsedEditorData.fields || defaultEditorData.fields,
        });
      } else {
        // Dari yang belum ada, dikenali dari gak ada `certificateId`-nya
        setEditorData({
          ...defaultEditorData,
          typeCertificate: currentCertificateType,
        });
      }
      setStatus("done");
      setEditorClean();
      setCurrentObject(null);
    };

    getCertificateData();
  }, [currentCertificateType]);

  React.useEffect(() => {
    if (!currentObject) {
      return;
    }
    setEditorData((editorData) => {
      const fieldsUpdated = editorData.fields.map((field) => {
        if (field.name === currentObject.name) {
          return currentObject;
        }
        return field;
      });

      return {
        ...editorData,
        fields: fieldsUpdated,
      };
    });
  }, [currentObject]);

  const handleTipeSertifikatChange = async (ev) => {
    if (parseInt(ev.value) === parseInt(editorData.typeCertificate)) {
      return;
    }

    if (!isEditorDirty) {
      setCurrentCertificateType(ev.value);
    } else {
      setNeedSavingConfirmation(true);
      targetCertificateType.current = ev.value;
    }
  };

  /**
   * Ke-trigger ketika seleksi objek teks & juga ketika geser posisinya.
   */
  const handleEditorChange = (data) => {
    setCurrentObject((currentData) => ({
      ...currentData,
      ...data,
    }));
  };

  const handleFontSizeChange = (ev) => {
    const { value } = ev;
    setCurrentObject((currentData) => ({
      ...currentData,
      fontSize: value,
    }));
  };

  const handleFontFamilyChange = (ev) => {
    const { value } = ev;
    setCurrentObject((currentData) => ({
      ...currentData,
      fontFamily: value,
    }));
  };

  const handleFontColorChange = (color) => {
    setCurrentObject((currentData) => ({
      ...currentData,
      color: color.hex,
    }));
  };

  const handleFontBoldChange = () => {
    setCurrentObject((currentData) => ({
      ...currentData,
      fontWeight: currentData.fontWeight ? undefined : "bold",
    }));
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
    setEditorDirty();
  };

  const handleHapusBg = () => {
    setEditorData((data) => {
      return {
        ...data,
        backgroundPreviewUrl: undefined,
        backgroundFileRaw: undefined,
        backgroundUrl: null,
      };
    });
    setEditorDirty();
  };

  const handleClickSave = async () => {
    setStatus("saving");
    const queryString = { event_id, type_certificate: currentCertificateType };
    const data = await prepareSaveData(editorData, queryString);

    const result = await CertificateService.save(data);
    if (result.data) {
      const editorDataSaved = JSON.parse(result.data.editorData);
      setEditorData((editorData) => ({
        ...editorData,
        ...editorDataSaved,
        certificateId: result.data.id,
      }));
      setEditorClean();
    }

    setStatus("done");
  };

  const handleOpenPreview = () => setModePreview(true);
  const handleClosePreview = () => setModePreview(false);
  const handleTogglePreview = () => setModePreview((isModePreview) => !isModePreview);

  return (
    <StyledPageWrapper>
      <MetaTags>
        <title>Editor Sertifikat | MyArchery.id</title>
      </MetaTags>

      <Container fluid>
        <BreadcrumbDashboard to={`/dashboard/event/${eventId}/home`}>Dashboard</BreadcrumbDashboard>

        {/* Konten */}
        <Row>
          <Col lg="12">
            <Row>
              <Col lg="8">
                <h1>Sertifikat Event</h1>
                <p>
                  Klik untuk mengubah jenis dan ukuran teks. Geser untuk mengatur komposisi
                  sertifikat.
                </p>
              </Col>

              <Col lg="4">
                <EditorActionButtons>
                  <div>
                    <Select
                      options={optionsTypeCertificate}
                      placeholder="Tipe Sertifikat"
                      value={getCurrentTypeCertificate(currentCertificateType)}
                      onChange={(ev) => handleTipeSertifikatChange(ev)}
                      isDisabled={isSaving || isLoading}
                    />
                  </div>

                  <div>
                    <BSButton
                      tag="a"
                      color="primary"
                      onClick={() => handleClickSave()}
                      disabled={isSaving || isLoading}
                    >
                      Simpan
                    </BSButton>
                  </div>

                  <div>
                    <BSButton
                      tag="a"
                      color="secondary"
                      outline
                      onClick={() => handleOpenPreview()}
                      disabled={isSaving || isLoading}
                    >
                      Pratinjau
                    </BSButton>

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
                        <PreviewCanvas data={editorData} />
                        <div className="mt-4 mb-2 text-center">
                          <BSButton color="primary" onClick={() => handleClosePreview()}>
                            Tutup
                          </BSButton>
                        </div>
                      </ModalBody>
                    </Modal>
                  </div>

                  {isSaving && <div className="indicator-message">Saving certificate...</div>}
                  {isLoading && <div className="indicator-message">Loading certificate...</div>}
                </EditorActionButtons>
              </Col>
            </Row>

            <Row>
              <Col lg="8">
                <Card>
                  {editorData ? (
                    <React.Fragment>
                      <EditorCanvasHTML
                        key={currentCertificateType}
                        data={editorData}
                        onChange={(data) => handleEditorChange(data)}
                        currentObject={currentObject}
                        onSelect={(target) => setCurrentObject(target)}
                        setEditorDirty={setEditorDirty}
                      />
                      {(isSaving || isLoading) && <ProcessingBlocker />}
                    </React.Fragment>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: 160 }}
                    >
                      Preparing editor...
                    </div>
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
                  {(isSaving || isLoading) && <ProcessingBlocker />}
                </div>

                {currentObject?.name && (
                  <div className="mt-5">
                    <div>
                      <label>Font family:</label>
                      <Select
                        options={optionsFontFamily}
                        placeholder="Font Family"
                        value={getSelectedFontFamily(optionsFontFamily, currentObject)}
                        onChange={(ev) => handleFontFamilyChange(ev)}
                      />
                    </div>

                    <div className="mt-2">
                      <label>Font size:</label>
                      <Select
                        options={optionsFontSize}
                        placeholder="font size"
                        value={{
                          value: currentObject?.fontSize,
                          label: currentObject?.fontSize,
                        }}
                        onChange={(ev) => handleFontSizeChange(ev)}
                      />
                    </div>

                    <div className="mt-2">
                      <label>Font color:</label>
                      <div>
                        <ColorPickerContainer color={currentObject?.color}>
                          <CompactPicker
                            color={currentObject?.color}
                            onChange={(color) => handleFontColorChange(color)}
                          />
                        </ColorPickerContainer>
                      </div>
                    </div>

                    <div className="mt-2">
                      <label>Bold?</label>
                      <div>
                        <FontBoldToggle
                          bold={currentObject?.fontWeight}
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

      <AlertPromptSave
        shouldConfirm={needSavingConfirmation}
        onConfirm={() => {
          setNeedSavingConfirmation(false);

          const submitSave = async () => {
            setStatus("saving");
            const queryString = { event_id, type_certificate: currentCertificateType };
            const data = await prepareSaveData(editorData, queryString);

            const result = await CertificateService.save(data);
            if (result.data) {
              setCurrentCertificateType(targetCertificateType.current);
            }
          };
          submitSave();
        }}
        onClose={() => {
          setNeedSavingConfirmation(false);
          setCurrentCertificateType(targetCertificateType.current);
        }}
        labelCancel="Lanjut tanpa simpan"
        labelConfirm="Simpan"
      >
        Sertifikat belum disimpan. Apakah ingin disimpan?
      </AlertPromptSave>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin: 4rem 0;
`;

const EditorActionButtons = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 10px;

  & > * {
    flex: 1 1 30%;

    :first-child {
      flex: 1 0 40%;
    }
  }

  & > * > a {
    display: block;
  }

  .indicator-message {
    position: absolute;
    bottom: -1.8em;
  }
`;

async function prepareSaveData(editorData, qs) {
  const dataCopy = { ...editorData };

  let imageBase64ForUpload = undefined;
  if (dataCopy.backgroundFileRaw) {
    imageBase64ForUpload = await convertBase64(dataCopy.backgroundFileRaw);
  }

  const certificateHtmlTemplate = renderTemplateString(dataCopy);
  const templateInBase64 = btoa(certificateHtmlTemplate);

  const payload = {
    event_id: parseInt(qs.event_id),
    type_certificate: dataCopy.typeCertificate,
    html_template: templateInBase64,
    background_img: imageBase64ForUpload,
    editor_data: JSON.stringify({
      ...dataCopy,
      backgroundFileRaw: undefined,
      backgroundPreviewUrl: undefined,
    }),
  };

  return payload;
}

function ProcessingBlocker() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        opacity: 0.5,
      }}
    />
  );
}

function AlertPromptSave({
  children,
  shouldConfirm,
  onConfirm,
  onClose,
  labelCancel = "Batal",
  labelConfirm = "Konfirmasi",
}) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm?.();
    setAlertOpen(false);
  };

  const handleCancel = () => {
    setAlertOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    if (!shouldConfirm) {
      return;
    }
    setAlertOpen(true);
  }, [shouldConfirm]);

  return (
    <React.Fragment>
      <SweetAlert
        show={isAlertOpen}
        title=""
        custom
        btnSize="md"
        style={{ padding: "30px 40px", width: "520px" }}
        onConfirm={handleConfirm}
        customButtons={
          <span className="d-flex justify-content-center" style={{ gap: "0.5rem" }}>
            <Button style={{ minWidth: 120 }} onClick={handleCancel}>
              {labelCancel}
            </Button>
            <ButtonBlue style={{ minWidth: 120 }} onClick={handleConfirm}>
              {labelConfirm}
            </ButtonBlue>
          </span>
        }
      >
        <div>
          <p>{children}</p>
        </div>
      </SweetAlert>
    </React.Fragment>
  );
}
