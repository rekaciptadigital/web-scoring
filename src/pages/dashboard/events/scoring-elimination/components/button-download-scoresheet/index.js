import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue } from "components/ma";
import { toast } from "../processing-toast";

import IconFile from "components/ma/icons/mono/file";
import IconLoading from "./icon-loading";

function ButtonDownloadScoresheet({ title = "Unduh scoresheet", disabled }) {
  const [isLoading, setLoading] = React.useState(false);

  if (isLoading) {
    return (
      <ButtonOutlineBlue flexible>
        <SpinningLoader>
          <IconLoading size="16" />
        </SpinningLoader>
      </ButtonOutlineBlue>
    );
  }

  return (
    <ButtonOutlineBlue
      title={title}
      flexible
      disabled={disabled}
    >
      <IconFile size="16" />
    </ButtonOutlineBlue>
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

export { ButtonDownloadScoresheet };
