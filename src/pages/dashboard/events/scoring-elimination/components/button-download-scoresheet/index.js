import * as React from "react";
import styled from "styled-components";
import { useDownloadScoresheet } from "../../hooks/download-scoresheet";

import { ButtonOutlineBlue, AlertSubmitError } from "components/ma";
import { toast } from "../processing-toast";

import IconFile from "components/ma/icons/mono/file";
import IconLoading from "./icon-loading";

function ButtonDownloadScoresheet({ title = "Unduh scoresheet", disabled, scoring, categoryId }) {
  const { downloadScoresheet, isLoading, isError, errors } = useDownloadScoresheet({
    categoryId: categoryId,
    eliminationId: scoring.elimination_id,
    round: scoring.round,
    match: scoring.match,
  });

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
    <React.Fragment>
      <ButtonOutlineBlue
        title={title}
        flexible
        disabled={disabled}
        onClick={() => {
          toast.loading("Sedang menyiapkan scoresheet...");
          downloadScoresheet({
            onSuccess() {
              toast.dismiss();
              toast.success("Scoresheet siap diunduh");
            },
            onError() {
              toast.dismiss();
            },
          });
        }}
      >
        <IconFile size="16" />
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

export { ButtonDownloadScoresheet };
