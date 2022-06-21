import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";

import { EditorProvider, useEditor } from "./contexts/editor-data";

import { Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import {
  SpinnerDotBlock,
  NoticeBarInfo,
  ButtonOutlineBlue,
  ButtonBlue,
  AlertSubmitError,
} from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { ProcessingToast } from "./components/processing-toast";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { CanvasArea } from "./components/canvas-area";
import { PreviewCanvas } from "./components/canvas-preview";
import { SelectPaperSize } from "./components/select-paper-size";
import { SelectPaperOrientation } from "./components/select-paper-orientation";
import { SelectVisibleData } from "./components/select-visible-data";
import { SelectFontFamily } from "./components/select-font-family";
import { SelectFontSize } from "./components/select-font-size";

import IconImage from "components/ma/icons/mono/image";
import IconX from "components/ma/icons/mono/x";

function PageEventIdCard() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const propsContentWrapper = {
    pageTitle: "Editor ID Card",
    navbar: <SubNavbar eventId={eventId} />,
  };

  return (
    <React.Fragment>
      <ProcessingToast />

      <ContentLayoutWrapper {...propsContentWrapper}>
        <EditorProvider>
          <CardSheet>
            <SavingBlocker />

            <EditorLayout>
              <EditorHeader />
              <EditorBody>
                <div>
                  <EditorScreen />
                </div>

                <div>
                  <ControlPanel />
                </div>
              </EditorBody>
            </EditorLayout>
          </CardSheet>
        </EditorProvider>
      </ContentLayoutWrapper>
    </React.Fragment>
  );
}

function SavingBlocker() {
  const { isSaving, isFetching } = useEditor();
  if (!isSaving) {
    return null;
  }
  return (
    <SavingBlockerWrapper>
      <SpinnerDotBlock>
        {isFetching && <LoadingText className="text-white">Memperbarui data...</LoadingText>}
      </SpinnerDotBlock>
    </SavingBlockerWrapper>
  );
}

function EditorHeader() {
  const {
    isDirty,
    saveEditor,
    isErrorFetching,
    errorsFetching,
    isErrorSubmiting,
    errorsSubmiting,
  } = useEditor();
  return (
    <EditorHeaderBar>
      <div>
        <NoticeBarInfo>
          Geser keterangan yang ada di dalam ID Card sesuai yang Anda inginkan
        </NoticeBarInfo>
      </div>

      <ActionButtons>
        <ButtonPreview />
        <ButtonBlue disabled={!isDirty} onClick={() => saveEditor()}>
          Simpan
        </ButtonBlue>
        <AlertSubmitError isError={isErrorFetching} errors={errorsFetching} />
        <AlertSubmitError isError={isErrorSubmiting} errors={errorsSubmiting} />
      </ActionButtons>
    </EditorHeaderBar>
  );
}

function ButtonPreview() {
  const { event_id } = useParams();
  const { data, isPortrait } = useEditor();
  const { data: eventDetail } = useEventDetail(event_id);
  const [isOpen, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <ButtonOutlineBlue onClick={() => setOpen(true)}>Pratinjau</ButtonOutlineBlue>
      {isOpen && (
        <Modal
          isOpen
          size="lg"
          autoFocus
          centered
          className="modalPreview"
          tabIndex="-1"
          toggle={() => setOpen((open) => !open)}
          unmountOnClose
        >
          <ModalBody>
            <PreviewContainer>
              <ModalHeaderBar>
                <div></div>
                <div>
                  <EditorCloseButton flexible onClick={() => setOpen(false)}>
                    <IconX size="16" />
                  </EditorCloseButton>
                </div>
              </ModalHeaderBar>

              <PreviewCanvasContainer
                style={{
                  "--preview-canvas-container-padding": isPortrait
                    ? "0.25rem 12rem"
                    : "0.25rem 7rem",
                }}
              >
                <PreviewCanvas
                  key={`${data.paperSize}-${data.paperOrientation}`}
                  eventDetail={eventDetail}
                />
              </PreviewCanvasContainer>

              <PreviewCaption>
                Ukuran: {data?.paperSize?.toUpperCase?.()}
                {false && "(21 cm x 29,7 cm)"}
              </PreviewCaption>
            </PreviewContainer>
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
}

function ControlPanel() {
  const {
    data,
    getBgImage,
    setBgImage,
    activeObject: activeObjectName,
    setFieldTextFontFamily,
    setFieldTextFontSize,
    setFieldTextColor,
    toggleFieldTextBold,
  } = useEditor();
  const bgImage = getBgImage();
  const currentField = data?.fields?.[activeObjectName];
  const fontFamily = currentField?.fontFamily;
  const fontSize = currentField?.fontSize;
  const color = currentField?.color;
  const isBold = currentField?.isBold;

  return (
    <ControlPanelWrapper key={activeObjectName}>
      <div>
        <ControlGroupLabel>Latar</ControlGroupLabel>
        <BackgroundImagePicker image={bgImage} onChange={(rawData) => setBgImage(rawData)} />
        <InstructionText>
          Unggah gambar sesuai ukuran kertas cetak dengan besar file maks 5MB, format PNG/JPEG
        </InstructionText>
      </div>

      <div>
        <ControlGroupLabel>Ukuran Cetak</ControlGroupLabel>
        <SelectPaperSize />
      </div>

      <div>
        <ControlGroupLabel>Orientasi</ControlGroupLabel>
        <SelectPaperOrientation />
      </div>

      <div>
        <ControlGroupLabel>Data</ControlGroupLabel>
        <SelectVisibleData />
      </div>

      <div>
        <ControlGroupLabel>Teks</ControlGroupLabel>
        {!activeObjectName ? (
          <InstructionText>Belum ada teks terseleksi</InstructionText>
        ) : currentField.type !== "text" ? (
          <InstructionText>Objek bukan teks</InstructionText>
        ) : (
          <EditorTextControls key={activeObjectName}>
            <SelectFontFamily
              fontFamily={fontFamily}
              onChange={(value) => setFieldTextFontFamily(activeObjectName, value)}
            />
            <SelectFontSize
              fontSize={fontSize}
              onChange={(value) => setFieldTextFontSize(activeObjectName, value)}
            />
            <FontColorPicker
              color={color}
              onChange={(color) => setFieldTextColor(activeObjectName, color)}
            />
            <FontBoldToggle
              isBold={isBold}
              onChange={() => toggleFieldTextBold(activeObjectName)}
            />
          </EditorTextControls>
        )}
      </div>
    </ControlPanelWrapper>
  );
}

function BackgroundImagePicker({ image, onChange }) {
  return (
    <BGImagePickerWrapper style={{ "--picker-choosen-image": `url("${image}")` }}>
      <TopLayer htmlFor="background-image-picker">
        <LabelsContainer>
          <span>
            <IconImage />
          </span>
          <span>Unggah Latar</span>
        </LabelsContainer>
      </TopLayer>
      <HiddenImageInput
        id="background-image-picker"
        type="file"
        onChange={(ev) => {
          if (!ev.target.files?.[0]) {
            return;
          }
          onChange?.(ev.target.files[0]);
        }}
      />
    </BGImagePickerWrapper>
  );
}

function FontColorPicker({ color, onChange }) {
  return (
    <ColorPickerContainer color={color}>
      <CompactPicker color={color} onChange={(color) => onChange?.(color.hex)} />
    </ColorPickerContainer>
  );
}

function ColorPickerContainer({ children, color = "#495057" }) {
  const [isShowPicker, setShowPicker] = React.useState(false);

  React.useEffect(() => {
    isShowPicker && setShowPicker(false);
  }, [color]);

  return (
    <ColorPickerWrapper>
      <ControlButtonContainer title="Warna teks" onClick={() => setShowPicker((show) => !show)}>
        <ControlButtonLabel
          style={{
            "--label-bold": 700,
            "--label-color": color,
            "--label-bg-color": color === "#ffffff" ? "var(--ma-gray-200)" : undefined,
          }}
        >
          A
        </ControlButtonLabel>
      </ControlButtonContainer>

      {isShowPicker && (
        <FloatingPickerContainer>
          <div onClick={() => setShowPicker(false)} />
          {children}
        </FloatingPickerContainer>
      )}
    </ColorPickerWrapper>
  );
}

function FontBoldToggle({ isBold = false, onChange }) {
  return (
    <ControlButtonContainer
      title="Bold"
      onClick={onChange}
      style={{ "--label-pressed-bg-color": isBold ? "var(--ma-primary-blue-50)" : undefined }}
    >
      <ControlButtonLabel
        style={{
          "--label-bold": isBold ? "700" : undefined,
          "--label-color": isBold ? "#000000" : undefined,
        }}
      >
        B
      </ControlButtonLabel>
      <div />
    </ControlButtonContainer>
  );
}

function EditorScreen() {
  const { isLoading, data, isPortrait } = useEditor();

  if (isLoading) {
    return (
      <EditorCanvas>
        <LoadingCanvas>
          <SpinnerDotBlock>
            <LoadingText>Menyiapkan editor...</LoadingText>
          </SpinnerDotBlock>
        </LoadingCanvas>
      </EditorCanvas>
    );
  }

  return (
    <EditorCanvas
      style={{ "--canvas-container-padding": isPortrait ? "0.25rem 10rem" : "0.25rem 5rem" }}
    >
      <CanvasArea key={`${data.paperSize}-${data.paperOrientation}`} />
    </EditorCanvas>
  );
}

/* ========================== */
// styles

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const SavingBlockerWrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
`;

const LoadingText = styled.span`
  font-weight: 600;

  &.text-white {
    color: #ffffff;
  }
`;

const EditorLayout = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const EditorHeaderBar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 4fr);
  gap: 1.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.5rem;
`;

const EditorBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 4fr);
  gap: 1.25rem;
`;

const ControlPanelWrapper = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const ControlGroupLabel = styled.p`
  padding: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const InstructionText = styled.p`
  margin: 0;
  margin-top: 0.375rem;
  color: var(--ma-gray-500);
  text-align: center;
`;

const BGImagePickerWrapper = styled.div`
  background-color: var(--ma-primary-blue-50);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  background-image: var(--picker-choosen-image);
`;

const TopLayer = styled.label`
  margin: 0;
  cursor: pointer;
  min-height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
`;

const HiddenImageInput = styled.input`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: -9999px;
  left: -9999px;
`;

const LabelsContainer = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: var(--ma-blue);
`;

const EditorTextControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButtonContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 5px;
  width: 2.625rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(204, 204, 204);
  background-color: #ffffff;
  text-align: center;
  cursor: pointer;

  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:hover {
    border-color: rgb(179, 179, 179);
  }

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

const ControlButtonLabel = styled.h5`
  margin: 0;
  color: var(--label-color);
  font-weight: var(--label-bold);
  background-color: var(--label-bg-color);
`;

const ColorPickerWrapper = styled.div`
  position: relative;

  > * {
    height: 100%;
  }
`;

const FloatingPickerContainer = styled.div`
  position: absolute;

  > * {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const EditorCanvas = styled.div`
  height: 37.5rem;
  background-color: var(--ma-gray-500);
  padding: var(--canvas-container-padding);

  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    box-shadow: 0 5px 20px rgba(18, 38, 63, 0.07);
  }
`;

const LoadingCanvas = styled.div`
  min-width: 18rem;
  min-height: 18rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const PreviewContainer = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const PreviewCanvasContainer = styled.div`
  height: 37.5rem;
  background-color: var(--ma-gray-50);
  padding: var(--preview-canvas-container-padding);

  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    box-shadow: 0 5px 20px rgba(18, 38, 63, 0.07);
  }
`;

const PreviewCaption = styled.p`
  margin-bottom: 0;
  text-align: center;
`;

const ModalHeaderBar = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const EditorCloseButton = styled.button`
  padding: 0.375rem 0.625rem;
  border: none;
  background-color: transparent;
  color: var(--ma-blue);

  transition: all 0.15s;

  &:hover {
    box-shadow: 0 0 0 1px var(--ma-gray-200);
  }
`;

export default PageEventIdCard;
