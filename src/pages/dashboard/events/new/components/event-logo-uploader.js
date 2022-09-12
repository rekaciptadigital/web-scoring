import * as React from "react";
import styled from "styled-components";
import { useSubmitEventLogo } from "../hooks/submit-event-logo";

import { AlertSubmitError } from "components/ma";
import { AsyncPhotoUploader } from "components/ma/async-photo-uploader";
import { toast } from "./processing-toast";

function EventLogoUploader({ eventDetail, onSuccess }) {
  const { submit, isLoading, isError, errors } = useSubmitEventLogo(eventDetail?.id);

  return (
    <MediaObjectWrapper>
      <UploaderWrapper>
        <AsyncPhotoUploader
          title="Upload foto profil"
          imageSrc={eventDetail?.publicInformation.eventLogo}
          isLoading={isLoading}
          onSubmit={(base64) =>
            submit(base64, {
              onSuccess: () => {
                toast.success("Logo event berhasil diperbarui");
                onSuccess?.();
              },
              onError: () => {
                toast.error("Gagal memperbarui logo event ");
              },
            })
          }
        />
      </UploaderWrapper>

      <UploadInstruction>
        Unggah foto Anda dengan ukuran 4x3, min. besar file 500kb, format PNG/JPEG untuk keperluan
        scoresheet, bagan, laporan, dan ID Card.
      </UploadInstruction>

      <AlertSubmitError isError={isError} errors={errors} />
    </MediaObjectWrapper>
  );
}

/* ================================= */
// utils

const MediaObjectWrapper = styled.div`
  margin-right: 1rem;
  width: 11.25rem;
`;

const UploaderWrapper = styled.div`
  width: 10rem;
  margin: 0 auto;
`;

const UploadInstruction = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-500);
  font-size: 0.875em;
`;

export { EventLogoUploader };
