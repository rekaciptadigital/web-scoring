import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
// import { Button } from "components/ma";

// import IconDownload from "components/ma/icons/mono/download";
import IconMoreVertical from "components/ma/icons/fill/more-vertical";
import IconTrash from "components/ma/icons/mono/trash";
import IconEdit from "components/ma/icons/mono/eye";
import IconEyeStrip from "components/ma/icons/mono/eye-strip";
import { AlertConfirmAction, AlertSubmitError, ButtonBlue, LoadingScreen } from "components/ma";

import { useSubmitPublish } from "../events/new/hooks/submit-publish";

import imgIllustration from "assets/images/Illustration.png";
import { AlertSuccess } from "../class-categories/components/alert-success";
import { useDeleteEvent } from "./submit-event-remove";

function ButtonMoreMenu({ event, fetchEventDetail, getEvent }) {
  const [isOpen, setOpen] = React.useState(false);
  const [isConfirm, setConfirm] = React.useState(false);
  const [isConfirmDelete, setConfirmDelete] = React.useState(false);
  const [isSuccess, setSucces] = React.useState(false);
  const [isSuccessDelete, setSuccesDelete] = React.useState(false);
  const [isErrorEvent, setErrorEvent] = React.useState(true);
  
  const {
    sendPublish,
    isLoading: isLoadingPublish,
    isError: isErrorPublish,
    errors: errorsPublish,
  } = useSubmitPublish(event);

  const {
    deleteEvent,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    errors: errorsDelete,
  } = useDeleteEvent(event?.id);

  const handleDeleteEvent = () => {
    setSuccesDelete(false);
    getEvent();
  };

  return (
    <React.Fragment>
      <LoadingScreen loading={isLoadingPublish || isLoadingDelete} />
      {errorsPublish !== "harap lengkapi data event sebelum publish" ? (
        <AlertSubmitError isError={isErrorPublish} errors={errorsPublish} />
      ) : (
        <SweetAlert
          show={isErrorEvent}
          title=""
          custom
          btnSize="md"
          onConfirm={() => setErrorEvent(false)}
          style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
          customButtons={
            <span
              className="d-flex justify-content-center"
              style={{ gap: "0.5rem", width: "100%" }}
            >
              <ButtonBlue block onClick={() => setErrorEvent(false)}>
                Kembali
              </ButtonBlue>
            </span>
          }
        >
          <img src={imgIllustration} alt="gambar" width="250px" style={{ marginBottom: "30px" }} />
          <h4>Event Tidak Dapat Dipublikasi</h4>
          <p className="text-muted">Anda harus melengkapi data-data yang tersedia sebelum mempublikasikan event</p>
        </SweetAlert>
      )}
      <AlertSubmitError isError={isErrorDelete} errors={errorsDelete} />
      <AlertConfirmAction
        shouldConfirm={isConfirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setErrorEvent(true);
          sendPublish(event?.publicInformation.eventStatus ? 0 : 1, {
            onSuccess() {
              setSucces(true);
              fetchEventDetail();
            },
          });
        }}
        labelConfirm={
          event?.publicInformation.eventStatus ? "Ya, jadikan draft" : "Ya, publikasikan event"
        }
        labelCancel="Tidak, kembali"
        width="800px"
      >
        <img src={imgIllustration} alt="gambar" width="250px" style={{ marginBottom: "30px" }} />
        <h5>
          Apakah anda yakin Event Ini Akan
          {event?.publicInformation.eventStatus ? " dijadikan Draft?" : " dipublikasikan?"}
        </h5>
        <p>
          Event akan
          {event?.publicInformation.eventStatus
            ? "dijadikan draft, Anda masih dapat mempublikasikan event ini nanti"
            : "dipublikasikan"}
        </p>
      </AlertConfirmAction>

      <AlertConfirmAction
        shouldConfirm={isConfirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteEvent({
            onSuccess() {
              setSuccesDelete(true);
            },
          });
        }}
        labelConfirm="Ya, hapus event"
        labelCancel="Tidak, kembali"
      >
        <img src={imgIllustration} alt="gambar" width="250px" style={{ marginBottom: "30px" }} />
        <h5>Apakah Anda yakin Akan Menghapus Event ?</h5>
        <p>Draft event akan terhapus. Anda dapat membuat event baru dengan klik tombol “+”.</p>
      </AlertConfirmAction>

      <AlertSuccess
        isSuccess={isSuccess}
        buttonLabel="Kembali ke dashboard"
        prompt="Berhasil"
        description={
          event?.publicInformation.eventStatus
            ? "Event telah dipublikasi"
            : "Event telah menjadi draft"
        }
        onConfirm={() => setSucces(false)}
      />

      <AlertSuccess
        isSuccess={isSuccessDelete}
        buttonLabel="Kembali ke dashboard"
        prompt="Berhasil"
        description="Event telah dihapus"
        onConfirm={handleDeleteEvent}
      />

      <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
        <DropdownToggle tag="div">
          <IconMoreVertical />
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem onClick={() => setConfirm(true)}>
            <ItemActionWrapper>
              <span>
                {event?.publicInformation.eventStatus ? "Jadikan draft" : "Publikasi Event"}
              </span>
              <span>
                {event?.publicInformation.eventStatus ? (
                  <IconEyeStrip size="16" />
                ) : (
                  <IconEdit size="16" />
                )}
              </span>
            </ItemActionWrapper>
          </DropdownItem>
          <DropdownItem
            disabled={event?.publicInformation.eventStatus ? true : false}
            onClick={() => setConfirmDelete(true)}
          >
            <ItemActionWrapper>
              <span>Hapus Event</span>
              <span>
                <IconTrash size="16" disabled />
              </span>
            </ItemActionWrapper>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
}

const ItemActionWrapper = styled.div`
  min-width: 10rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }
  > *:nth-child(2) {
    flex-shrink: 0;
    color: var(--ma-blue);
  }
`;

export { ButtonMoreMenu };
