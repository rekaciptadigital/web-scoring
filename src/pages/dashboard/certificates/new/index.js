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
} from "../utils";
import { prepareSaveData } from "./utils";
import { DEJAVU_SANS } from "../utils/font-family-list";
import { certificateFields } from "constants/index";

import MetaTags from "react-meta-tags";
import { Container, Col, Row, Card, Button as BSButton, Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import Select from "react-select";
import { BreadcrumbDashboard } from "pages/dashboard/events/components/breadcrumb";
import { ProcessingBlocker } from "./processing-blocker";
import { AlertPromptSave } from "./alert-prompt-save";

import EditorBgImagePicker from "../components/EditorBgImagePicker";
import EditorCanvasHTML from "../components/EditorCanvasHTML";
import FontBoldToggle from "../components/FontBoldToggle";
import ColorPickerContainer from "../components/ColorPickerContainer";
import PreviewCanvas from "../components/preview/PreviewCanvas";

const { LABEL_MEMBER_NAME, LABEL_CATEGORY_NAME } = certificateFields;

function CertificateNew() {
  const event_id = new URLSearchParams(useLocation().search).get("event_id");
  const eventId = parseInt(event_id);

  const isMounted = React.useRef(null);
  const abortControllerRef = React.useRef(null);

  React.useEffect(() => {
    isMounted.current = true;
    abortControllerRef.current = new AbortController();
    return () => {
      isMounted.current = false;
      abortControllerRef.current.abort();
    };
  }, []);

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

  React.useEffect(() => {
    setStatus("loading");

    const getCertificateData = async () => {
      const queryString = { event_id, type_certificate: currentCertificateType };
      const result = await CertificateService.getForEditor(
        queryString,
        abortControllerRef.current.signal
      );
      const defaultEditorData = getDefaultEditorData();

      // Batalkan update state ketika komponen udah di-unmount.
      // Menghindari memory leak ketika belum selesai loading tapi user pindah halamanan.
      // Data sertifikat makan memory besar.
      if (!isMounted.current) {
        return;
      }

      setStatus("done");
      setEditorClean();
      setCurrentObject(null);

      if (result.success) {
        // Kalau belum ada data template tapi dapatnya objek kosongan
        // Dikenali dari gak ada `certificateId`-nya
        if (!result.data?.id) {
          setEditorData({ ...defaultEditorData, typeCertificate: currentCertificateType });
        } else {
          // Data editor dari data sertifikat yang sudah ada di server
          const parsedEditorData = result.data.editorData ? JSON.parse(result.data.editorData) : "";
          const editorData = {
            ...defaultEditorData,
            typeCertificate: currentCertificateType,
            certificateId: result.data.id,
            backgroundUrl: result.data.backgroundUrl,
            fields: parsedEditorData.fields || defaultEditorData.fields,
          };
          setEditorData(editorData);
        }
      } else {
        // Kalau belum ada data template tapi dilempar error
        setEditorData({ ...defaultEditorData, typeCertificate: currentCertificateType });
      }
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

const getDefaultEditorData = () => ({
  paperSize: "A4",
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
      name: LABEL_CATEGORY_NAME,
      x: 640,
      y: 370,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
  ],
});

export default CertificateNew;
