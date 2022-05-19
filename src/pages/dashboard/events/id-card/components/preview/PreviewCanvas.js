import * as React from "react";
import styled from "styled-components";

import PreviewFieldText from "./PreviewFieldText";
import QrCodeField from "../QrCodeField";
import ImageField from "../imageField";


export default function PreviewCanvas({ data }) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);
  const [offsetWidth, setOffsetWidth] = React.useState(null);

  const getBackgroundImage = () => backgroundPreviewUrl || backgroundUrl || "";

  React.useEffect(() => {
    containerDiv.current && setOffsetWidth(containerDiv.current.offsetWidth);
  }, []);

  return (
    <PreviewCanvasContainer ref={containerDiv} ratio={908 / 1280}>
      <PreviewImage
        width={1280}
        height={908}
        backgroundImage={getBackgroundImage()}
        scale={offsetWidth ? offsetWidth / 1280 : 1}
      >
        {fields?.length ? (
          fields.map((field) => {
            return <PreviewFieldText key={field.name} name={field.name} data={field} />;
          })
        ) : (
          <div>Ada error pada data editor</div>
        )}

        <ImageField dataEditor={data?.photoProfileField} preview />
        <QrCodeField dataEditor={data?.qrFields} preview />
      </PreviewImage>

      <PreviewBlocker />
    </PreviewCanvasContainer>
  );
}

function PreviewImage({ children, width, height, backgroundImage, scale }) {
  const variableStyles = {
    "--cert-pre-width": width ? width + "px" : undefined,
    "--cert-pre-height": height ? height + "px" : undefined,
    "--cert-pre-background-image": backgroundImage ? `url(${backgroundImage})` : "",
    "--cert-pre-scale": scale,
  };
  return <PreviewImageWrapper style={variableStyles}>{children}</PreviewImageWrapper>;
}

const PreviewCanvasContainer = styled.div`
  position: relative;
  height: 0;
  padding-bottom: ${({ ratio }) => 100 * ratio}%;
  overflow: hidden;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: var(--cert-pre-width, 100%);
  height: var(--cert-pre-height, 100%);
  background-color: white;
  background-image: var(--cert-pre-background-image, none);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transform: scale(var(--cert-pre-scale, 1));
  transform-origin: top left;
`;

const PreviewBlocker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;
