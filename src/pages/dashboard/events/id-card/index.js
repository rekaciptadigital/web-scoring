import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { IdCardService } from "services";
import {
  optionsFontSize,
  optionsFontFamily,
  getSelectedFontFamily,
} from './utils/index';
import { prepareSaveData } from "./utils";
import { DEJAVU_SANS } from "../../certificates/utils/font-family-list";
import { idCardFields } from "constants/index";

import MetaTags from "react-meta-tags";
import { Container, Col, Row, Card, Button as BSButton, Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import Select from "react-select";
import { ProcessingBlocker } from "../../certificates/new/processing-blocker";
import { AlertPromptSave } from "../../certificates/new/alert-prompt-save";

import EditorBgImagePicker from "./components/EditorBgImagePicker";
import EditorCanvasHTML from "./components/EditorCanvasHTML";
import FontBoldToggle from "./components/FontBoldToggle";
import ColorPickerContainer from "./components/ColorPickerContainer";
import PreviewCanvas from "./components/preview/PreviewCanvas";
import { SubNavbar } from "../components/submenus-settings";

const { LABEL_PLAYER_NAME, LABEL_LOCATION_AND_DATE, LABEL_CATEGORY, LABEL_CLUB_MEMBER, LABEL_STATUS_EVENT, LABEL_PHOTO_PROFILE } = idCardFields;

function PageEventIdCard() {
  const { event_id } = useParams();

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
//   const [isEditorDirty, setEditorAsDirty] = React.useState(false);

  const targetCertificateType = React.useRef(1);
  const [needSavingConfirmation, setNeedSavingConfirmation] = React.useState(false);

  const [isModePreview, setModePreview] = React.useState(false);

  const isSaving = status === "saving";
  const isLoading = status === "loading";

//   const setEditorClean = () => setEditorAsDirty(false);
//   const setEditorDirty = () => setEditorAsDirty(true);

  const image = {
    preview: editorData?.backgroundPreviewUrl || editorData?.backgroundUrl || null,
    raw: editorData?.backgroundFileRaw || null,
  };

  React.useEffect(() => {
    setStatus("loading");

    const getCertificateData = async () => {
      const queryString = { event_id: event_id };
      const result = await IdCardService.getForEditor(
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
        // Kalau belum ada data template tapi dapatnya objek kosongan
        if (!result.data.id) {
          setEditorData({
            ...defaultEditorData,
          });
        } else {
          // Data editor dari data sertifikat yang sudah ada di server
          const parsedEditorData = result.data.editorData ? JSON.parse(result.data.editorData) : "";
          setEditorData({
            ...defaultEditorData,
            event_id: event_id,
            backgroundUrl: result.data.background,
            fields: parsedEditorData.fields || defaultEditorData.fields,
            qrFields: parsedEditorData.qrFields || defaultEditorData.qrFields,
            photoProfileField: parsedEditorData.photoProfileField || defaultEditorData.photoProfileField,
          });
        }
      } else {
        // Kalau belum ada data template tapi dilempar error
        setEditorData({
          ...defaultEditorData,
        });
      }

      setStatus("done");
    //   setEditorClean();
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
        qrFields: currentObject.name == editorData.qrFields.name ? currentObject : editorData.qrFields,
        photoProfileField: currentObject.name == editorData.photoProfileField.name ? currentObject : editorData.photoProfileField,
      };
    });
  }, [currentObject]);

//   const handleTipeSertifikatChange = async (ev) => {
//     if (parseInt(ev.value) === parseInt(editorData.typeCertificate)) {
//       return;
//     }

//     if (!isEditorDirty) {
//       setCurrentCertificateType(ev.value);
//     } else {
//       setNeedSavingConfirmation(true);
//       targetCertificateType.current = ev.value;
//     }
//   };

  /**
   * Ke-trigger ketika seleksi objek teks & juga ketika geser posisinya.
   */
  const handleEditorChange = (data) => {
    setCurrentObject((currentData) => {
      return ({
      ...currentData,
      ...data,
    })});
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
    // setEditorDirty();
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
    // setEditorDirty();
  };

  const handleClickSave = async () => {
    setStatus("saving");
    const queryString = { event_id, type_certificate: currentCertificateType };
    const data = await prepareSaveData(editorData, queryString);

    const result = await IdCardService.save(data);
    if (result.data) {
      const editorDataSaved = JSON.parse(result.data.editorData);
      setEditorData((editorData) => ({
        ...editorData,
        ...editorDataSaved,
        event_id: event_id,
      }));
    //   setEditorClean();
    }

    setStatus("done");
  };

  const handleOpenPreview = () => setModePreview(true);
  const handleClosePreview = () => setModePreview(false);
  const handleTogglePreview = () => setModePreview((isModePreview) => !isModePreview);
  console.log(currentObject?.name);
  return (
    <React.Fragment>
        <SubNavbar eventId={event_id} />
        
        <MetaTags>
                <title>Dashboard | Id Card</title>
        </MetaTags>

      <Container fluid>
       
        {/* Konten */}
        <Row>
          <Col lg="12">
            <Row>
              <Col lg="8">
                <h1>ID Card</h1>
                <p>
                Geser keterangan yang ada di dalam ID Card sesuai yang Anda inginkan
                </p>
              </Col>

              <Col lg="4">
                <EditorActionButtons>

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

                  {isSaving && <div className="indicator-message">Saving ID Card...</div>}
                  {isLoading && <div className="indicator-message">Loading ID Card...</div>}
                </EditorActionButtons>
              </Col>
            </Row>

            <Row>
              <Col lg="6">
                <Card>
                  {editorData ? (
                    <React.Fragment>
                      <EditorCanvasHTML
                        key={currentCertificateType}
                        data={editorData}
                        onChange={(data) => handleEditorChange(data)}
                        currentObject={currentObject}
                        onSelect={(target) => setCurrentObject(target)}
                        // setEditorDirty={setEditorDirty}
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

              <Col lg="6">
                <Row>

                <div className="ratio ratio-21x9">
                  <EditorBgImagePicker
                    image={image}
                    onSelectImage={(imageData) => handleSelectBg(imageData)}
                    onRemoveImage={() => handleHapusBg()}
                    />
                  {(isSaving || isLoading) && <ProcessingBlocker />}
                </div>
                </Row>


                <Row>
                {currentObject?.name && (
                  
                    <div className="mt-3">
                    <div>
                      <label>Font family:</label>
                      <Select
                        options={optionsFontFamily}
                        placeholder="Font Family"
                        value={getSelectedFontFamily(optionsFontFamily, currentObject)}
                        onChange={(ev) => handleFontFamilyChange(ev)}
                        />
                    </div>

                    <EditorSection>
                    <Col lg="2">
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
                    </Col>

                    <Col lg="1">
                    <ButtonEditor>
                      <div>
                        <ColorPickerContainer color={currentObject?.color}>
                          <CompactPicker
                            color={currentObject?.color}
                            onChange={(color) => handleFontColorChange(color)}
                            />
                        </ColorPickerContainer>
                      </div>
                    </ButtonEditor>
                    </Col>

                        <Col lg="1">
                    <ButtonEditor>
                      <div>
                        <FontBoldToggle
                          bold={currentObject?.fontWeight}
                          onChange={() => handleFontBoldChange()}
                          />
                      </div>
                    </ButtonEditor>
                    </Col>
                    </EditorSection>
                  </div>
                )}
                
                </Row>
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

            const result = await IdCardService.save(data);
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
        ID Card belum disimpan. Apakah ingin disimpan?
      </AlertPromptSave>
    </React.Fragment>
  );
}

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

const EditorSection = styled.div`
  display: flex;
`;

const ButtonEditor = styled.div`
    margin-top: 2.5rem !important;
    margin-left: 1rem;
`;




const defaultEditorData = {
  paperSize: "A4", // || [1280, 908] || letter
  backgroundUrl: null,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  photoProfileField: {
    name: 'photoProfile',
    x: 30,
    y: 250,
  },
  qrFields: {
    name: 'qrCode',
    x: 0,
    y: 650,
  },
  fields: [
    {
      name: LABEL_PLAYER_NAME,
      x: 150,
      y: 50,
      fontFamily: DEJAVU_SANS,
      fontSize: 45,
    },
    {
      name: LABEL_LOCATION_AND_DATE,
      x: 850,
      y: 100,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_CATEGORY,
      x: 850,
      y: 150,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_CLUB_MEMBER,
      x: 640,
      y: 200,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_STATUS_EVENT,
      x: 640,
      y: 250,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_PHOTO_PROFILE,
      x: 40,
      y: 50,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
  ],
};

export default PageEventIdCard;
