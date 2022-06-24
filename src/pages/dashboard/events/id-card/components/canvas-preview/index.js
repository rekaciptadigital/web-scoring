import * as React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useContainerOffsetWidth } from "../../hooks/container-offset-width";
import { useEditor } from "../../contexts/editor-data";

import { DisplayObject } from "./components/display-object";

import { idCardFields } from "constants/index";
import { datetime } from "utils";

import avatarMan from "assets/images/users/avatar-man.png";

const {
  LABEL_PLAYER_NAME,
  LABEL_GENDER,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_BUDREST,
  LABEL_STATUS_EVENT,
  LABEL_AVATAR,
} = idCardFields;

function PreviewCanvas({ eventDetail }) {
  const containerDiv = React.useRef(null);
  const offsetWidth = useContainerOffsetWidth(containerDiv);
  const { getPaperDimensions, getBgImage, visibleFields } = useEditor();
  const { width, height } = getPaperDimensions();
  const bgImage = getBgImage();

  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);

  const textByName = {
    [LABEL_PLAYER_NAME]: "Widodo Mahfudz Muhammad Akhiar",
    [LABEL_GENDER]: "Putra",
    [LABEL_LOCATION_AND_DATE]: _getLocationDate(eventDetail),
    [LABEL_CATEGORY]: "Umum - 70m - Individu Putra",
    [LABEL_BUDREST]: "14A",
    [LABEL_CLUB_MEMBER]: "My Archery Club",
    [LABEL_STATUS_EVENT]: "Peserta",
    [LABEL_AVATAR]: userProfile?.avatar || avatarMan,
  };

  return (
    <CanvasAreaContainer
      ref={containerDiv}
      style={{ "--preview-canvas-area-ratio": `${100 * (height / width)}%` }}
    >
      <CanvasBackground
        style={{
          "--preview-canvas-actual-width": `${width}px`,
          "--preview-canvas-actual-height": `${height}px`,
          "--preview-canvas-scale": _getCanvasScale(offsetWidth, width),
          "--preview-canvas-bg-image": bgImage && `url("${bgImage}")`,
        }}
      >
        {visibleFields.map((field) => (
          <DisplayObject key={field.name} field={field} exampleValue={textByName[field.name]} />
        ))}
      </CanvasBackground>
    </CanvasAreaContainer>
  );
}

const CanvasAreaContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: var(--preview-canvas-area-ratio, 100%);
  overflow: hidden;
`;

const CanvasBackground = styled.div`
  width: var(--preview-canvas-actual-width);
  height: var(--preview-canvas-actual-height);
  transform: scale(var(--preview-canvas-scale, 1));
  transform-origin: top left;

  background-color: white;
  background-image: var(--preview-canvas-bg-image);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

function _getCanvasScale(offsetWidth, actualPaperPixels) {
  if (!offsetWidth) {
    return 1;
  }
  return offsetWidth / actualPaperPixels;
}

function _getLocationDate(eventDetail) {
  if (!eventDetail) {
    return `Jakarta, ${datetime.formatFullDateLabel(new Date())}`;
  }
  return `${eventDetail.publicInformation.eventCity.nameCity.toLowerCase?.()}, ${datetime.formatFullDateLabel(
    eventDetail.publicInformation.eventStart
  )}`;
}

export { PreviewCanvas };
