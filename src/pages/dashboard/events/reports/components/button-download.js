import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue, AlertSubmitError } from "components/ma";

import IconFile from "components/ma/icons/mono/download";
import IconLoading from "./icon-loading";

function ButtonDownload({
  title = "Unduh dokumen",
  disabled,
  onDownload,
  isLoading,
  isError,
  errors,
}) {
  if (isLoading) {
    return (
      <ButtonOutlineBlue flexible>
        <SpinningLoader>
          <IconLoading size="16" />
        </SpinningLoader>{" "}
        <span>Unduh Dokumen</span>
      </ButtonOutlineBlue>
    );
  }

  return (
    <React.Fragment>
      <ButtonOutlineBlue
        title={title}
        flexible
        disabled={disabled}
        onClick={() => {
          if (!onDownload) {
            alert("Set handler `onDownload` dulu");
          } else {
            onDownload();
          }
        }}
      >
        <IconFile size="16" /> <span>Unduh Dokumen</span>
      </ButtonOutlineBlue>
      <AlertSubmitError isError={isError} errors={errors} />
    </React.Fragment>
  );
}

const SpinningLoader = styled.span`
  display: inline-block;
  animation: spin-loading 0.7s infinite linear;

  @keyframes spin-loading {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
`;

export { ButtonDownload };
