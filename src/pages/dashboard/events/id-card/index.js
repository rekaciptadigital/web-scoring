import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { EditorProvider, useEditor } from "./contexts/editor-data";

import { Modal, ModalBody } from "reactstrap";
import { CompactPicker } from "react-color";
import { NoticeBarInfo, ButtonOutlineBlue, ButtonBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
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
    pageTitle: "Skoring Eliminasi",
    navbar: <SubNavbar eventId={eventId} />,
  };

  return (
    <ContentLayoutWrapper {...propsContentWrapper}>
      <CardSheet>
        <EditorProvider>
          <Editor>
            <EditorHeaderBar>
              <div>
                <NoticeBarInfo>
                  Geser keterangan yang ada di dalam ID Card sesuai yang Anda inginkan
                </NoticeBarInfo>
              </div>

              <ActionButtons>
                <ButtonPreview />
                <ButtonBlue>Simpan</ButtonBlue>
              </ActionButtons>
            </EditorHeaderBar>

            <EditorBody>
              <div>
                <EditorScreen />
              </div>

              <ControlPanel>
                <div>
                  <ControlGroupLabel>Latar</ControlGroupLabel>
                  <BackgroundImagePicker />
                  <BackgroundImageInstruction>
                    Unggah gambar sesuai ukuran kertas cetak dengan besar file maks 5MB, format
                    PNG/JPEG
                  </BackgroundImageInstruction>
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

                  <EditorTextControls>
                    <SelectFontFamily />
                    <SelectFontSize />
                    <FontColorPicker />
                    <FontBoldToggle />
                  </EditorTextControls>
                </div>
              </ControlPanel>
            </EditorBody>
          </Editor>
        </EditorProvider>
      </CardSheet>
    </ContentLayoutWrapper>
  );
}

function ButtonPreview() {
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

              <div>
                <PreviewCanvas />
              </div>

              <PreviewCaption>Ukuran: {"A4 (21 cm x 29,7 cm)"}</PreviewCaption>
            </PreviewContainer>
          </ModalBody>
        </Modal>
      )}
    </React.Fragment>
  );
}

function BackgroundImagePicker() {
  const image = "";
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
      <HiddenImageInput id="background-image-picker" type="file" />
    </BGImagePickerWrapper>
  );
}

function FontColorPicker() {
  return (
    <ColorPickerContainer color={undefined}>
      <CompactPicker color={undefined} onChange={(color) => console.log(color)} />
    </ColorPickerContainer>
  );
}

function ColorPickerContainer({ children, color = "var(--ma-blue)" || "#495057" }) {
  const [isShowPicker, setShowPicker] = React.useState(false);
  return (
    <ColorPickerWrapper>
      <ControlButtonContainer title="Warna teks" onClick={() => setShowPicker((show) => !show)}>
        <ControlButtonLabel style={{ "--label-bold": 700, "--label-color": color }}>
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

function FontBoldToggle({ onChange }) {
  const [isBold, setBold] = React.useState(true);
  return (
    <ControlButtonContainer
      title="Bold"
      onClick={() => {
        setBold((bold) => !bold);
        onChange?.();
      }}
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
  const { data, isPortrait } = useEditor();
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

const Editor = styled.div`
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

const ControlPanel = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const ControlGroupLabel = styled.p`
  padding: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const BackgroundImageInstruction = styled.p`
  margin: 0;
  margin-top: 0.375rem;
  color: var(--ma-gray-500);
  text-align: center;
`;

const BGImagePickerWrapper = styled.div`
  background-color: var(--ma-primary-blue-50);
  background-repeat: no-repeat;
  background-position: center;
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

const PreviewContainer = styled.div`
  > * + * {
    margin-top: 1rem;
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
