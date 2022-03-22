import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { Row, Col, Modal, ModalBody } from "reactstrap";
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

import { setHours, setMinutes, getMinutes, getHours } from "date-fns";

export function StepInfoUmum({ eventData, updateEventData, validationErrors }) {
  const [shouldShowAddExtraInfo, setShowAddExtraInfo] = React.useState(false);
  const [keyExtraInfoEdited, setKeyExtraInfoEdited] = React.useState(null);
  const [keyExtraInfoRemoved, setKeyExtraInfoRemoved] = React.useState(null);
  const [filePDF, setFilePDF] = React.useState(null);

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

  const handleHandbookChange = (value) => {
    updateEventData({ handbook: value });
  };

  const handleAddInformation = (value) => {
    updateEventData({
      type: "ADD_EXTRA_INFO",
      value: {
        title: value.title,
        description: value.description,
      },
    });
  };

  const handleEditInformation = (value) => {
    updateEventData({
      type: "EDIT_EXTRA_INFO",
      key: value.key,
      value: {
        title: value.title,
        description: value.description,
      },
    });
  };

  const handleRemoveInformation = (targetInfo) => {
    updateEventData({ type: "REMOVE_EXTRA_INFO", key: targetInfo.key });
    setKeyExtraInfoRemoved(null);
  };

  return (
    <FormSheet>
      <h3 className="mb-3">
        Banner Event<span style={{ color: "var(--ma-red)" }}>*</span>
      </h3>
      <PosterImagePicker
        image={eventData.bannerImage}
        onChange={handlePickBannerChange}
        onRemove={handleRemoveBannerImage}
        errors={validationErrors?.bannerImage}
      />

      <hr />
      <h3 className="mt-4 mb-3">Detail Event</h3>

      <Row>
        <Col md={12} className="mt-2">
          <FieldInputText
            required
            name="eventName"
            placeholder="Masukkan nama event"
            value={eventData.eventName}
            onChange={(value) => handleFieldChange("eventName", value)}
            errors={validationErrors?.eventName}
          >
            Nama Event
          </FieldInputText>
        </Col>

        <Col md={12} className="mt-2">
          <FieldTextArea
            name="description"
            placeholder="Masukkan deskripsi singkat"
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
            placeholder="Nama tempat acara"
            value={eventData.location}
            onChange={(value) => handleFieldChange("location", value)}
            errors={validationErrors?.location}
          >
            Lokasi
          </FieldInputText>

          <div className="mt-3">
            <FieldSelectRadio
              name="locationType"
              options={[
                { label: "Indoor", value: "Indoor" },
                { label: "Outdoor", value: "Outdoor" },
                { label: "Keduanya", value: "Both" },
              ]}
              value={
                eventData?.locationType
                  ? { label: eventData.locationType, value: eventData.locationType }
                  : undefined
              }
              onChange={handleLocationTypeChange}
              errors={validationErrors?.locationType}
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
            errors={validationErrors?.city}
          >
            Kota
          </FieldSelectCity>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <Row>
            <Col sm={8}>
              <FieldInputDate
                placeholder="DD/MM/YYYY"
                name="registrationDateStart"
                required
                minDate={new Date()}
                value={eventData.registrationDateStart}
                onChange={(value) =>
                  updateEventData({ type: "REGISTRATION_START", payload: value })
                }
                errors={validationErrors?.registrationDateStart}
              >
                Mulai Pendaftaran
              </FieldInputDate>
            </Col>

            <Col sm={4}>
              <FieldInputTime
                placeholder="00:00"
                name="registrationTimeStart"
                required
                minTime={setHours(setMinutes(eventData.registrationDateStart, 0), 0)}
                maxTime={setHours(setMinutes(eventData.registrationDateStart, 59), 23)}
                value={eventData.registrationDateStart}
                onChange={(value) =>
                  updateEventData({ type: "REGISTRATION_START", payload: value })
                }
                errors={validationErrors?.registrationDateStart}
              >
                Jam Buka
              </FieldInputTime>
            </Col>
          </Row>
        </Col>

        <Col lg="6">
          <Row>
            <Col sm={8}>
              <FieldInputDate
                placeholder="DD/MM/YYYY"
                name="registrationDateEnd"
                required
                minDate={eventData.registrationDateStart || new Date()}
                value={eventData.registrationDateEnd}
                onChange={(value) => updateEventData({ type: "REGISTRATION_END", payload: value })}
                errors={validationErrors?.registrationDateEnd}
              >
                Tutup Pendaftaran
              </FieldInputDate>
            </Col>

            <Col sm={4}>
              <FieldInputTime
                placeholder="00:00"
                name="registrationTimeEnd"
                required
                minTime={
                  setHours(setMinutes(eventData.registrationDateEnd, 0), 0) >
                  eventData.registrationDateStart
                    ? setHours(setMinutes(eventData.registrationDateEnd, 0), 0)
                    : setHours(
                        setMinutes(
                          eventData.registrationDateStart,
                          getMinutes(eventData.registrationDateStart)
                        ),
                        getHours(eventData.registrationDateStart)
                      )
                }
                maxTime={setHours(setMinutes(eventData.registrationDateEnd, 59), 23)}
                value={eventData.registrationDateEnd}
                onChange={(value) => updateEventData({ type: "REGISTRATION_END", payload: value })}
                errors={validationErrors?.registrationDateEnd}
              >
                Jam Tutup
              </FieldInputTime>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg="6">
          <Row>
            <Col sm={8}>
              <FieldInputDate
                placeholder="DD/MM/YYYY"
                name="eventDateStart"
                required
                minDate={
                  eventData.registrationDateEnd || eventData.registrationDateStart || new Date()
                }
                value={eventData.eventDateStart}
                onChange={(value) => updateEventData({ type: "EVENT_START", payload: value })}
                errors={validationErrors?.eventDateStart}
              >
                Mulai Lomba
              </FieldInputDate>
            </Col>

            <Col sm={4}>
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
                errors={validationErrors?.eventDateStart}
              >
                Jam Mulai
              </FieldInputTime>
            </Col>
          </Row>
        </Col>

        <Col lg="6">
          <Row>
            <Col sm={8}>
              <FieldInputDate
                placeholder="DD/MM/YYYY"
                name="eventDateEnd"
                required
                minDate={
                  eventData.eventDateStart ||
                  eventData.registrationDateEnd ||
                  eventData.registrationDateStart ||
                  new Date()
                }
                value={eventData.eventDateEnd}
                onChange={(value) => updateEventData({ type: "EVENT_END", payload: value })}
                errors={validationErrors?.eventDateEnd}
              >
                Akhir Lomba
              </FieldInputDate>
            </Col>

            <Col sm={4}>
              <FieldInputTime
                placeholder="00:00"
                name="eventTimeEnd"
                required
                minTime={
                  setHours(setMinutes(eventData.eventDateEnd, 0), 0) > eventData.eventDateStart
                    ? setHours(setMinutes(eventData.eventDateEnd, 0), 0)
                    : setHours(
                        setMinutes(eventData.eventDateStart, getMinutes(eventData.eventDateStart)),
                        getHours(eventData.eventDateStart)
                      )
                }
                maxTime={setHours(setMinutes(eventData.eventDateEnd, 59), 23)}
                value={eventData.eventDateEnd}
                onChange={(value) => updateEventData({ type: "EVENT_END", payload: value })}
                errors={validationErrors?.eventDateEnd}
              >
                Jam Akhir
              </FieldInputTime>
            </Col>
          </Row>
        </Col>
      </Row>

      <hr />
      <h3 className="mt-4 mb-3">Informasi Event</h3>

      <ButtonOutlineBlue corner="8" style={{ width: "100%" }} onClick={handleModalAddInfoShow}>
        + Tambah Informasi
      </ButtonOutlineBlue>

      <div
        className="mt-3"
        style={{
          display: "block",
          position: "relative",
          border: "1px solid #0F53BB",
          borderRadius: "8px",
        }}
      >
        <input
          accept="application/pdf"
          type="file"
          id="file"
          style={{ opacity: "0", position: "absolute", width: "100%", cursor: "pointer" }}
          onChange={(e) => {
            setFilePDF(e.target.files[0]);
            handleHandbookChange(e.target.files[0]);
          }}
        />
        <div
          style={{
            textAlign: "center",
            color: "#0F53BB",
          }}
          className="pt-2"
        >
          <label htmlFor="file">
            {filePDF ? filePDF?.name : <span className="bx bx-upload"> Upload THB</span>}
          </label>
        </div>
      </div>

      <ModalExtraInfoEditor
        showEditor={shouldShowAddExtraInfo}
        onSave={handleAddInformation}
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
                showEditor={keyExtraInfoEdited === info.key}
                infoData={info}
                onSave={handleEditInformation}
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
    </FormSheet>
  );
}

function ModalExtraInfoEditor({ showEditor, ...props }) {
  if (!showEditor) {
    return null;
  }
  return <ExtraInfoEditor {...props} />;
}

function ExtraInfoEditor({ infoData, onSave, onClose }) {
  const [title, setTitle] = React.useState(infoData?.title || "");
  const [description, setDescription] = React.useState(infoData?.description || "");

  const initialTitle = React.useRef(title);
  const initialDescription = React.useRef(description);

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

  const handleClickSave = () => {
    if (!shouldSubmitAllowed()) {
      return;
    }
    onSave?.({
      key: infoData?.key,
      title: title,
      description: description,
    });
    handleCloseModal();
  };

  return (
    <Modal isOpen size="lg">
      <ModalBody>
        <h4>{infoData ? "Ubah Informasi" : "Tambah Informasi"}</h4>

        <div className="mt-4">
          <FieldInputText
            name="info-title"
            placeholder="Hadiah, Aturan Lomba, Peserta, dan lain sebagainya"
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
            placeholder="Masukkan deskripsi"
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
        <div className="d-flex flex-column w-100" style={{ gap: "0.5rem" }}>
          <Button style={{ color: "var(--ma-red)" }} onClick={onConfirm}>
            Hapus
          </Button>
          <ButtonBlue onClick={onCancel}>Batalkan</ButtonBlue>
        </div>
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
