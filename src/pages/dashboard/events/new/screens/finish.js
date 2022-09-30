import * as React from "react";
import styled from "styled-components";
import { useSubmitPublish } from "../hooks/submit-publish";
import { toast } from "../components/processing-toast";

import { ButtonBlue, AlertSubmitError, ButtonOutlineBlue, AlertConfirmAction } from "components/ma";
import { LoadingScreen } from "../components/loading-screen-portal";

import IconCheck from "components/ma/icons/fill/check";
import imageIllustration from "assets/images/events/create-event-event-ready.png";
import imgIllustration from "assets/images/Illustration.png";
import { AlertSuccess } from "pages/dashboard/class-categories/components/alert-success";
// import { AlertSuccess } from "pages/authentication/register/components/alert-registration-success";

function ScreenFinish({ eventDetail, fetchEventDetail }) {
  const {
    sendPublish,
    isLoading: isLoadingPublish,
    isError: isErrorPublish,
    errors: errorsPublish,
  } = useSubmitPublish(eventDetail);

  const isPublished = Boolean(eventDetail?.publicInformation.eventStatus);

  const [isConfirm, setConfirm] = React.useState(false);
  const [isSuccess, setSucces] = React.useState(false);

  return (
    <React.Fragment>
      <LoadingScreen loading={isLoadingPublish} />
      <AlertSubmitError isError={isErrorPublish} errors={errorsPublish} />
      <AlertSuccess
        isSuccess={isSuccess}
        buttonLabel="Kembali ke dashboard"
        prompt="Berhasil"
        description="Event telah menjadi draft"
      />
      <AlertConfirmAction
        shouldConfirm={isConfirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          sendPublish(0, {
            onSuccess() {
              fetchEventDetail();
              setSucces(true);
            },
          });
        }}
        labelConfirm="Ya, jadikan draft"
        labelCancel="Tidak, kembali"
      >
        <img src={imgIllustration} alt="gambar" width="250px" style={{ marginBottom: "30px" }} />
        <h5>Apakah anda yakin Event Ini Akan dijadikan Draft?</h5>
        <p>Event akan dijadikan draft, Anda masih dapat mempublikasikan event ini nanti</p>
      </AlertConfirmAction>

      <CardSheet>
        <Illustration />
        <CenteredContent>
          <VerticalSpacedBox>
            <div>
              <h2>Pengaturan Pertandingan berhasil disimpan</h2>
              <p>
                Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage Event.
                Buat lebih banyak event di Dashboard EO.
              </p>
            </div>

            <HorizontalSpacedButtonGroups>
              {isPublished ? (
                <React.Fragment>
                  <IconCheck />
                  <ButtonBlue disabled>Terpublikasi</ButtonBlue>
                  <ButtonOutlineBlue onClick={() => setConfirm(true)}>
                    Jadikan Draft
                  </ButtonOutlineBlue>
                </React.Fragment>
              ) : (
                <ButtonBlue
                  onClick={() => {
                    sendPublish(1, {
                      onSuccess() {
                        fetchEventDetail();
                        toast.success("Terpublikasi!");
                      },
                    });
                  }}
                >
                  Publikasi
                </ButtonBlue>
              )}
            </HorizontalSpacedButtonGroups>
          </VerticalSpacedBox>
        </CenteredContent>
      </CardSheet>
    </React.Fragment>
  );
}

const CardSheet = styled.div`
  margin-bottom: 24px;
  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const CenteredContent = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const Illustration = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 328px;
  background-image: url(${imageIllustration});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const HorizontalSpacedButtonGroups = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

export { ScreenFinish };
