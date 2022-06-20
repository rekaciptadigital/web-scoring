import * as React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useContainerOffsetWidth } from "../../hooks/container-offset-width";
import { useEditor } from "../../contexts/editor-data";

import { DisplayObject } from "./components/display-object";

import { datetime } from "utils";

import avatarMan from "assets/images/users/avatar-man.png";

function PreviewCanvas({ eventDetail }) {
  const containerDiv = React.useRef(null);
  const offsetWidth = useContainerOffsetWidth(containerDiv);
  const { getPaperDimensions, getBgImage, visibleFields } = useEditor();
  const { width, height } = getPaperDimensions();
  const bgImage = getBgImage();

  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);

  const textByName = {
    player_name: "Widodo Muhammad Mahfuzon",
    location_and_date: _getLocationDate(eventDetail),
    category: "Umum - 70m - Individu Putra",
    club_member: "My Archery Club",
    status_event: "Peserta",
    photoProfile: userProfile?.avatar || avatarMan,
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
    return "-";
  }
  return `${eventDetail.publicInformation.eventCity.nameCity.toLowerCase?.()}, ${datetime.formatFullDateLabel(
    eventDetail.publicInformation.eventStart
  )}`;
}

export { PreviewCanvas };
