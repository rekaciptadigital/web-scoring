import * as React from "react";
import { useParams } from "react-router-dom";
import { useDownloadIdCard } from "../hooks/download-id-card";

import { ButtonOutlineBlue } from "components/ma";
import { toast } from "./processing-toast";

function ButtonDownloadIDCard() {
  const { event_id } = useParams();
  const eventId = event_id;
  const { download } = useDownloadIdCard(eventId);
  return (
    <ButtonOutlineBlue
      onClick={() => {
        toast.loading("Sedang menyiapkan dokumen ID card...");
        download({
          onSuccess() {
            toast.dismiss();
            toast.success("ID card siap diunduh");
          },
          onError() {
            toast.dismiss();
            toast.error("Gagal mengunduh ID card");
          },
        });
      }}
    >
      Unduh ID Card
    </ButtonOutlineBlue>
  );
}

export { ButtonDownloadIDCard };
