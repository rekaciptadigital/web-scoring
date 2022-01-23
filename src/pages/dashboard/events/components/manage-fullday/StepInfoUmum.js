import * as React from "react";
import styled from "styled-components";
import { EventsService } from "services";

import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, Modal, ModalBody } from "reactstrap";
import { LoadingScreen } from "components";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import FormSheet from "../FormSheet";
import PosterImagePicker from "../PosterImagePicker";
import {
  FieldInputText,
  FieldTextArea,
  FieldSelectCity,
  FieldSelectRadio,
  FieldInputDate,
  FieldInputTime,
} from "../form-fields";

import { setHours, setMinutes } from "date-fns";

export function StepInfoUmum({ eventId, savingStatus, onSaveSuccess, eventData, updateEventData }) {
  const [shouldShowAddExtraInfo, setShowAddExtraInfo] = React.useState(false);
  const [keyExtraInfoEdited, setKeyExtraInfoEdited] = React.useState(null);
  const [keyExtraInfoRemoved, setKeyExtraInfoRemoved] = React.useState(null);
  const [removingStatus, setRemovingStatus] = React.useState({ status: "idle", errors: null });

  const isLoading = savingStatus.status === "loading";
  const isRemovingInfo = removingStatus.status === "loading";

  const handleModalAddInfoShow = () => setShowAddExtraInfo(true);
  const handleModalAddInfoClose = () => setShowAddExtraInfo(false);

  const handleModalEditInfoOpen = (key) => setKeyExtraInfoEdited(key);
  const handleModalEditInfoClose = () => setKeyExtraInfoEdited(null);

  const handlePickBannerChange = (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }

    const imageRawData = ev.target.files[0];
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    updateEventData({
      bannerImage: {
        preview: imagePreviewUrl,
        raw: imageRawData,
      },
    });
  };

  const handleRemoveBannerImage = () => {
    updateEventData({ bannerImage: undefined });
  };

  const handleFieldChange = (field, value) => {
    updateEventData({ [field]: value });
  };

  const handleLocationTypeChange = (radioValue) => {
    const { value } = radioValue;
    updateEventData({ locationType: value });
  };

  const handleCityChange = (selectValue) => {
    updateEventData({ city: selectValue });
  };

  const handleRemoveInformation = async (targetInfo) => {
    setRemovingStatus((state) => ({ ...state, status: "loading", errors: null }));
    setKeyExtraInfoRemoved(null);
    const result = await EventsService.deleteMoreInfos({ id: targetInfo.id });
    if (result.success) {
      setRemovingStatus((state) => ({ ...state, status: "success" }));
      onSaveSuccess?.();
    } else {
      setRemovingStatus((state) => ({ ...state, status: "error", errors: result.errors }));
    }
  };

  return (
    <FormSheet>
      <h3 className="mb-3">Banner Event</h3>
      <PosterImagePicker
        image={eventData.bannerImage}
        onChange={handlePickBannerChange}
        onRemove={handleRemoveBannerImage}
      />

      <hr />
      <h3 className="mt-4 mb-3">Detail Event</h3>

      <Row>
        <Col md={12} className="mt-2">
          <FieldInputText
            required
            name="eventName"
            placeholder="Nama Event"
            value={eventData.eventName}
            onChange={(value) => handleFieldChange("eventName", value)}
          >
            Nama Event
          </FieldInputText>
        </Col>

        <Col md={12} className="mt-2">
          <FieldTextArea
            name="description"
            placeholder="Deskripsi"
            value={eventData.description}
            onChange={(value) => handleFieldChange("description", value)}
          >
            Deskripsi <span className="">&#40;Opsional&#41;</span>
          </FieldTextArea>
        </Col>
      </Row>

      <hr />
      <h3 className="mt-4 mb-3">Waktu dan Tempat</h3>

      <Row>
        <Col md={6} className="mt-2">
          <FieldInputText
            required
            name="location"
            placeholder="Lokasi"
            value={eventData.location}
            onChange={(value) => handleFieldChange("location", value)}
          >
            Lokasi
          </FieldInputText>

          <div className="mt-3">
            <FieldSelectRadio
              name="locationType"
              options={[
                { label: "Indoor", value: "Indoor" },
                { label: "Outdoor", value: "Outdoor" },
                { label: "Both", value: "Both" },
              ]}
              value={
                eventData?.locationType
                  ? { label: eventData.locationType, value: eventData.locationType }
                  : undefined
              }
              onChange={handleLocationTypeChange}
            />
          </div>
        </Col>

        <Col md={6} className="mt-2">
          <FieldSelectCity
            name="city"
            required
            placeholder="Kota"
            value={eventData?.city || null}
            onChange={handleCityChange}
          >
            Kota
          </FieldSelectCity>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <FieldInputDate
            placeholder="DD/MM/YYYY"
            name="registrationDateStart"
            required
            value={eventData.registrationDateStart}
            onChange={(value) => updateEventData({ type: "REGISTRATION_START", payload: value })}
          >
            Mulai Pendaftaran
          </FieldInputDate>
        </Col>

        <Col md={2}>
          <FieldInputTime
            placeholder="00:00"
            name="registrationTimeStart"
            required
            minTime={setHours(setMinutes(eventData.registrationDateStart, 0), 0)}
            maxTime={setHours(setMinutes(eventData.registrationDateStart, 59), 23)}
            value={eventData.registrationDateStart}
            onChange={(value) => updateEventData({ type: "REGISTRATION_START", payload: value })}
          >
            Jam Buka
          </FieldInputTime>
        </Col>

        <Col md={4}>
          <FieldInputDate
            placeholder="DD/MM/YYYY"
            name="registrationDateEnd"
            required
            minDate={eventData.registrationDateStart}
            value={eventData.registrationDateEnd}
            onChange={(value) => updateEventData({ type: "REGISTRATION_END", payload: value })}
          >
            Tutup Pendaftaran
          </FieldInputDate>
        </Col>

        <Col md={2}>
          <FieldInputTime
            placeholder="00:00"
            name="registrationTimeEnd"
            required
            minTime={
              setHours(setMinutes(eventData.registrationDateEnd, 0), 0) >
              eventData.registrationDateStart
                ? setHours(setMinutes(eventData.registrationDateEnd, 0), 0)
                : eventData.registrationDateStart
            }
            maxTime={setHours(setMinutes(eventData.registrationDateEnd, 59), 23)}
            value={eventData.registrationDateEnd}
            onChange={(value) => updateEventData({ type: "REGISTRATION_END", payload: value })}
          >
            Jam Tutup
          </FieldInputTime>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <FieldInputDate
            placeholder="DD/MM/YYYY"
            name="eventDateStart"
            required
            minDate={eventData.registrationDateEnd || eventData.registrationDateStart}
            value={eventData.eventDateStart}
            onChange={(value) => updateEventData({ type: "EVENT_START", payload: value })}
          >
            Mulai Lomba
          </FieldInputDate>
        </Col>

        <Col md={2}>
          <FieldInputTime
            placeholder="00:00"
            name="eventTimeStart"
            required
            minTime={setHours(
              setMinutes(eventData.eventDateStart || eventData.registrationDateEnd, 0),
              0
            )}
            maxTime={setHours(
              setMinutes(eventData.eventDateStart || eventData.registrationDateEnd, 59),
              23
            )}
            value={eventData.eventDateStart}
            onChange={(value) => updateEventData({ type: "EVENT_START", payload: value })}
          >
            Jam Mulai
          </FieldInputTime>
        </Col>

        <Col md={4}>
          <FieldInputDate
            placeholder="DD/MM/YYYY"
            name="eventDateEnd"
            required
            minDate={
              eventData.eventDateStart ||
              eventData.registrationDateEnd ||
              eventData.registrationDateStart
            }
            value={eventData.eventDateEnd}
            onChange={(value) => updateEventData({ type: "EVENT_END", payload: value })}
          >
            Akhir Lomba
          </FieldInputDate>
        </Col>

        <Col md={2}>
          <FieldInputTime
            placeholder="00:00"
            name="eventTimeEnd"
            required
            minTime={
              setHours(setMinutes(eventData.eventDateEnd, 0), 0) > eventData.eventDateStart
                ? setHours(setMinutes(eventData.eventDateEnd, 0), 0)
                : eventData.eventDateStart
            }
            maxTime={setHours(setMinutes(eventData.eventDateEnd, 59), 23)}
            value={eventData.eventDateEnd}
            onChange={(value) => updateEventData({ type: "EVENT_END", payload: value })}
          >
            Jam Akhir
          </FieldInputTime>
        </Col>
      </Row>

      <hr />
      <h3 className="mt-4 mb-3">Informasi Event</h3>

      <ButtonOutlineBlue corner="8" style={{ width: "100%" }} onClick={handleModalAddInfoShow}>
        + Tambah Informasi
      </ButtonOutlineBlue>

      <ModalExtraInfoEditor
        eventId={eventId}
        showEditor={shouldShowAddExtraInfo}
        onSaveSuccess={onSaveSuccess}
        onClose={handleModalAddInfoClose}
      />

      <div>
        {eventData.extraInfos?.map((info) => (
          <ExtraInfoItem key={info.key} className="mt-4">
            <div className="info-body">
              <div className="info-body-content">
                <h5>{info.title || "Judul tidak tersedia"}</h5>
                <p className="mb-0">{info.description || "Konten tidak tersedia"}</p>
              </div>

              <div>
                <a className="info-button-edit" onClick={() => handleModalEditInfoOpen(info.key)}>
                  &#10097;
                </a>
              </div>

              <ModalExtraInfoEditor
                eventId={eventId}
                showEditor={keyExtraInfoEdited === info.key}
                infoData={info}
                onSaveSuccess={onSaveSuccess}
                onClose={handleModalEditInfoClose}
              />
            </div>

            <div>
              <Button
                style={{ color: "var(--ma-red)" }}
                onClick={() => setKeyExtraInfoRemoved(info.key)}
              >
                <i className="bx bx-trash font-size-18 align-middle" />
              </Button>

              <AlertDeleteInfo
                showAlert={keyExtraInfoRemoved === info.key}
                onConfirm={() => handleRemoveInformation(info)}
                onCancel={() => setKeyExtraInfoRemoved(null)}
              />
            </div>
          </ExtraInfoItem>
        ))}
      </div>

      <LoadingScreen loading={isLoading || isRemovingInfo} />
    </FormSheet>
  );
}

function ModalExtraInfoEditor({ showEditor, ...props }) {
  if (!showEditor) {
    return null;
  }
  return <ExtraInfoEditor {...props} />;
}

function ExtraInfoEditor({ eventId, infoData, onSaveSuccess, onClose }) {
  const [title, setTitle] = React.useState(infoData?.title || "");
  const [description, setDescription] = React.useState(infoData?.description || "");
  const [savingStatus, setSavingStatus] = React.useState({ status: "idle", errors: null });

  const initialTitle = React.useRef(title);
  const initialDescription = React.useRef(description);

  const isEditMode = Boolean(infoData);
  const isLoading = savingStatus.status === "loading";

  const shouldSubmitAllowed = () => {
    const isRequiredAll = title && description;
    const isEdited = title !== initialTitle.current || description !== initialDescription.current;
    return isRequiredAll && isEdited;
  };

  const handleCloseModal = () => {
    setTitle("");
    setDescription("");
    onClose?.();
  };

  const handleClickSave = async () => {
    if (!shouldSubmitAllowed()) {
      return;
    }

    if (isEditMode) {
      // UPDATE DATA
      setSavingStatus((state) => ({ ...state, status: "loading", errors: null }));

      const payload = {
        event_id: infoData.eventId,
        title: title,
        description: description,
      };

      const result = await EventsService.updateMoreInfos(payload, { id: infoData.id });
      if (result.success) {
        setSavingStatus((state) => ({ ...state, status: "success" }));
        onSaveSuccess?.();
        handleCloseModal();
      } else {
        setSavingStatus((state) => ({ ...state, status: "error", errors: result.errors }));
      }
    } else {
      // ADD NEW DATA
      setSavingStatus((state) => ({ ...state, status: "loading", errors: null }));

      const payload = {
        event_id: eventId,
        title: title,
        description: description,
      };

      const result = await EventsService.storeMoreInfos(payload, { id: eventId });
      if (result.success) {
        setSavingStatus((state) => ({ ...state, status: "success" }));
        onSaveSuccess?.();
        handleCloseModal();
      } else {
        setSavingStatus((state) => ({ ...state, status: "error", errors: result.errors }));
      }
    }
  };

  return (
    <Modal isOpen>
      <ModalBody>
        <h4>{isEditMode ? "Ubah Informasi" : "Tambahkan Informasi"}</h4>

        <div className="mt-4">
          <FieldInputText
            name="info-title"
            placeholder="Judul Infomasi"
            value={title}
            onChange={(value) => {
              setTitle(value);
            }}
          >
            Judul Informasi
          </FieldInputText>
        </div>

        <div className="mt-4">
          <FieldTextArea
            name="info-description"
            placeholder="Deskripsi"
            value={description}
            onChange={(value) => {
              setDescription(value);
            }}
          >
            Deskripsi
          </FieldTextArea>
        </div>

        <div className="mt-4 d-flex justify-content-end" style={{ gap: "0.5rem" }}>
          <Button style={{ color: "var(--ma-blue)" }} onClick={handleCloseModal}>
            Batal
          </Button>
          <ButtonBlue onClick={handleClickSave} disabled={!shouldSubmitAllowed()}>
            Simpan
          </ButtonBlue>
        </div>

        <LoadingScreen loading={isLoading} />
      </ModalBody>
    </Modal>
  );
}

function AlertDeleteInfo({ showAlert, onConfirm, onCancel }) {
  return (
    <SweetAlert
      show={showAlert}
      title={
        <i className="bx bx-trash font-size-18 align-middle" style={{ color: "var(--ma-red)" }} />
      }
      custom
      btnSize="md"
      showCancel
      onConfirm={onConfirm}
      onCancel={onCancel}
      style={{ padding: "30px 40px" }}
      customButtons={
        <span className="d-flex flex-column w-100" style={{ gap: "0.5rem" }}>
          <Button style={{ color: "var(--ma-red)" }} onClick={onConfirm}>
            Hapus
          </Button>
          <ButtonBlue onClick={onCancel}>Batalkan</ButtonBlue>
        </span>
      }
    >
      <p className="text-muted">Yakin akan hapus informasi ini?</p>
    </SweetAlert>
  );
}

const ExtraInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  .info-body {
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
    border-radius: 8;
    border: solid 1px var(--ma-gray-100);

    .info-body-content {
      flex-grow: 1;
      padding: 1.5rem;
    }

    .info-button-edit {
      padding: 1.5rem;
      color: var(--ma-blue);

      &::after {
        content: " ";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
  }
`;
