import * as React from "react";
import styled from "styled-components";

import qrPreviewSvg from "assets/images/editor-qr-preview.svg";

export default function QrCodeField({ preview }) {
  return (
    <QrCodeContainer className="qr-code-container" preview={preview}>
      <div className="qr-code-image" />
    </QrCodeContainer>
  );
}

const QrCodeContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  min-width: 30mm;
  min-height: 30mm;
  padding: 10px;
  background-color: white;

  .qr-code-image {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    min-width: 30mm;
    min-height: 30mm;
    ${(props) => (!props.preview ? "opacity: 0.25;" : "")}
    ${(props) => (!props.preview ? "border: solid 1px #000000;" : "")}
    background-image: url(${qrPreviewSvg});
    background-size: cover;
  }
`;
