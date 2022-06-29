import * as React from "react";
import styled from "styled-components";
import { useDownloadMemberBudrests } from "../hooks/download-member-budrest";

import { ButtonOutlineBlue, AlertSubmitError } from "components/ma";
import { toast } from "pages/dashboard/events/new/components/processing-toast";

import IconDownload from "components/ma/icons/mono/download";
import IconLoading from "./icon-loading";

function ButtonDownloadReport() {
  const { isLoading, download, isError, errors } = useDownloadMemberBudrests();

  if (isLoading) {
    return (
      <ButtonOutlineBlue>
        <SpinningLoader>
          <IconLoading size="16" />
        </SpinningLoader>{" "}
        <span>Unduh Laporan</span>
      </ButtonOutlineBlue>
    );
  }

  return (
    <React.Fragment>
      <AlertSubmitError isError={isError} errors={errors} />
      <ButtonOutlineBlue
        onClick={() => {
          toast.loading("Sedang menyiapkan unduhan...");
          download({
            onSuccess() {
              toast.dismiss();
              toast.success("Unduhan dimulai");
            },
            onError() {
              toast.dismiss();
              toast.error("Gagal memulai unduhan. Silakan coba lagi.");
            },
          });
        }}
      >
        <span>
          <IconDownload size="16" />
        </span>{" "}
        <span>Unduh Laporan</span>
      </ButtonOutlineBlue>
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

export { ButtonDownloadReport };
