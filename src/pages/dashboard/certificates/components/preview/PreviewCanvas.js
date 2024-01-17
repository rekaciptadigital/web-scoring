import * as React from "react";
import styled from "styled-components";
import PreviewFieldText from "./PreviewFieldText";
//import QrCodeField from "../QrCodeField";

// landscape
const A4_WIDTH = 1287;
const A4_HEIGHT = 910;

export default function PreviewCanvas({ data }) {
  const { backgroundUrl, backgroundPreviewUrl, fields } = data;
  const containerDiv = React.useRef(null);
  const [offsetWidth, setOffsetWidth] = React.useState(null);

  const getBackgroundImage = () => backgroundPreviewUrl || backgroundUrl || "";

  React.useLayoutEffect(() => {
    containerDiv.current && setOffsetWidth(containerDiv.current.offsetWidth);
  }, []);

  return (
    <PreviewCanvasContainer ref={containerDiv} ratio={A4_HEIGHT / A4_WIDTH}>
      <PreviewImage
        width={A4_WIDTH}
        height={A4_HEIGHT}
        backgroundImage={getBackgroundImage()}
        scale={offsetWidth ? offsetWidth / A4_WIDTH : 1}
      >
        {fields?.length ? (
          fields.map((field) => (
            <PreviewFieldText key={field.name} name={field.name} data={field} />
          ))
        ) : (
          <div>Ada error pada data editor</div>
        )}

        {/* <QrCodeField preview /> */}
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
