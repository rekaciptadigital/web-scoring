import * as React from "react";
import styled from "styled-components";

import qrPreviewSvg from "assets/images/editor-qr-preview.svg";

export default function QrCodeField({ preview }) {
  return (
    <QrCodeContainer className="qr-code-container" preview={preview}>
      <div className="qr-code-centering">
        <div className="qr-code-image" />
      </div>
    </QrCodeContainer>
  );
}

const QrCodeContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 120px;

  .qr-code-centering {
    margin: 0 auto;
    width: 30mm;
    height: 30mm;
    background-color: white;
  }

  .qr-code-image {
    width: 30mm;
    height: 30mm;
    ${(props) => (!props.preview ? "opacity: 0.25;" : "")}
    ${(props) => (!props.preview ? "border: solid 1px #000000;" : "")}
    background-image: url(${qrPreviewSvg});
    background-size: cover;
  }
`;
