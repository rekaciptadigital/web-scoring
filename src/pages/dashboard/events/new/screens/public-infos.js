import * as React from "react";
import styled from "styled-components";

import { Modal, ModalBody } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue, ButtonOutlineBlue } from "components/ma";
import PosterImagePicker from "../../components/PosterImagePicker";
import {
  FieldInputText,
  FieldTextArea,
  FieldSelectCity,
  FieldSelectRadio,
  FieldInputDate,
  FieldInputTime,
} from "../../components/form-fields";

import { setHours, setMinutes, getMinutes, getHours } from "date-fns";

function ScreenPublicInfos({ form }) {
  const {
    data,
    updateField,
    updateRegistrationStart,
    updateRegistrationEnd,
    updateEventStart,
    updateEventEnd,
  } = form;

  const handlePickBannerChange = (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    updateField("poster", { preview: imagePreviewUrl, raw: imageRawData });
  };

  return (
    <div>
      <CardSheet>
        {data ? (
          <React.Fragment>
            <h3>
              Banner Event<span style={{ color: "var(--ma-red)" }}>*</span>
            </h3>

            <PosterImagePicker image={data.poster} onChange={handlePickBannerChange} />

            <hr />
            <h3>Detail Event</h3>
            <VerticalSpaceBetween>
              <FieldInputText
                required
                name="eventName"
                placeholder="Masukkan nama event"
                value={data.eventName}
                onChange={(value) => updateField("eventName", value)}
              >
                Nama Event
              </FieldInputText>

              <FieldTextArea
                name="description"
                placeholder="Masukkan deskripsi singkat"
                rows="8"
                value={data.description}
                onChange={(value) => updateField("description", value)}
              >
                Deskripsi <span className="">&#40;Opsional&#41;</span>
              </FieldTextArea>
            </VerticalSpaceBetween>

            <hr />
            <h3 className="mt-4 mb-3">Waktu dan Tempat</h3>
            <VerticalSpaceBetween>
              <SplitFields>
                <VerticalSpaceBetween>
                  <FieldInputText
                    required
                    name="location"
                    placeholder="Nama tempat acara"
                    value={data.location}
                    onChange={(value) => updateField("location", value)}
                  >
                    Lokasi
                  </FieldInputText>

                  <FieldSelectRadio
                    name="locationType"
                    options={[
                      { label: "Indoor", value: "Indoor" },
                      { label: "Outdoor", value: "Outdoor" },
                      { label: "Keduanya", value: "Both" },
                    ]}
                    value={
                      data.locationType
                        ? { label: data.locationType, value: data.locationType }
                        : undefined
                    }
                    onChange={(ev) => updateField("locationType", ev.value)}
                  />
                </VerticalSpaceBetween>

                <div>
                  <FieldSelectCity
                    name="city"
                    required
                    placeholder="Kota"
                    value={data.city || null}
                    onChange={(value) => updateField("city", value)}
                  >
                    Kota
                  </FieldSelectCity>
                </div>
              </SplitFields>

              <SplitFields>
                <PairedDateTimeFields>
                  <FieldInputDate
                    placeholder="DD/MM/YYYY"
                    name="registrationDateStart"
                    required
                    minDate={new Date()}
                    value={data.registrationDateStart}
                    onChange={updateRegistrationStart}
                  >
                    Mulai Pendaftaran
                  </FieldInputDate>

                  <FieldInputTime
                    placeholder="00:00"
                    name="registrationTimeStart"
                    required
                    minTime={setHours(setMinutes(data.registrationDateStart, 0), 0)}
                    maxTime={setHours(setMinutes(data.registrationDateStart, 59), 23)}
                    value={data.registrationDateStart}
                    onChange={updateRegistrationStart}
                  >
                    Jam Buka
                  </FieldInputTime>
                </PairedDateTimeFields>

                <PairedDateTimeFields>
                  <FieldInputDate
                    placeholder="DD/MM/YYYY"
                    name="registrationDateEnd"
                    required
                    minDate={data.registrationDateStart || new Date()}
                    value={data.registrationDateEnd}
                    onChange={updateRegistrationEnd}
                  >
                    Tutup Pendaftaran
                  </FieldInputDate>

                  <FieldInputTime
                    placeholder="00:00"
                    name="registrationTimeEnd"
                    required
                    minTime={
                      setHours(setMinutes(data.registrationDateEnd, 0), 0) >
                      data.registrationDateStart
                        ? setHours(setMinutes(data.registrationDateEnd, 0), 0)
                        : setHours(
                            setMinutes(
                              data.registrationDateStart,
                              getMinutes(data.registrationDateStart)
                            ),
                            getHours(data.registrationDateStart)
                          )
                    }
                    maxTime={setHours(setMinutes(data.registrationDateEnd, 59), 23)}
                    value={data.registrationDateEnd}
                    onChange={updateRegistrationEnd}
                  >
                    Jam Tutup
                  </FieldInputTime>
                </PairedDateTimeFields>
              </SplitFields>

              <SplitFields>
                <PairedDateTimeFields>
                  <FieldInputDate
                    placeholder="DD/MM/YYYY"
                    name="eventDateStart"
                    required
                    minDate={data.registrationDateEnd || data.registrationDateStart || new Date()}
                    value={data.eventDateStart}
                    onChange={updateEventStart}
                  >
                    Mulai Lomba
                  </FieldInputDate>

                  <FieldInputTime
                    placeholder="00:00"
                    name="eventTimeStart"
                    required
                    minTime={setHours(
                      setMinutes(data.eventDateStart || data.registrationDateEnd, 0),
                      0
                    )}
                    maxTime={setHours(
                      setMinutes(data.eventDateStart || data.registrationDateEnd, 59),
                      23
                    )}
                    value={data.eventDateStart}
                    onChange={updateEventStart}
                  >
                    Jam Mulai
                  </FieldInputTime>
                </PairedDateTimeFields>

                <PairedDateTimeFields>
                  <FieldInputDate
                    placeholder="DD/MM/YYYY"
                    name="eventDateEnd"
                    required
                    minDate={
                      data.eventDateStart ||
                      data.registrationDateEnd ||
                      data.registrationDateStart ||
                      new Date()
                    }
                    value={data.eventDateEnd}
                    onChange={updateEventEnd}
                  >
                    Akhir Lomba
                  </FieldInputDate>

                  <FieldInputTime
                    placeholder="00:00"
                    name="eventTimeEnd"
                    required
                    minTime={
                      setHours(setMinutes(data.eventDateEnd, 0), 0) > data.eventDateStart
                        ? setHours(setMinutes(data.eventDateEnd, 0), 0)
                        : setHours(
                            setMinutes(data.eventDateStart, getMinutes(data.eventDateStart)),
                            getHours(data.eventDateStart)
                          )
                    }
                    maxTime={setHours(setMinutes(data.eventDateEnd, 59), 23)}
                    value={data.eventDateEnd}
                    onChange={updateEventEnd}
                  >
                    Jam Akhir
                  </FieldInputTime>
                </PairedDateTimeFields>
              </SplitFields>
            </VerticalSpaceBetween>

            <hr />
            <h3>Informasi Event</h3>
            <VerticalSpaceBetween className="mt-4">
              <div>
                {/* TODO: ekstrak komponen upload file */}
                <label htmlFor="file" className="w-100">
                  <ButtonOutlineBlue as="span" corner="8" className="w-100">
                    {data.handbook?.raw?.name || (
                      <React.Fragment>
                        <span className="bx bx-upload"></span> Upload THB
                      </React.Fragment>
                    )}
                  </ButtonOutlineBlue>
                  <input
                    accept="application/pdf"
                    type="file"
                    id="file"
                    style={{ visibility: "hidden", position: "absolute", left: -2000 }}
                    onChange={(ev) => {
                      if (!ev.target.files?.[0]) return;
                      updateField("handbook", { raw: ev.target.files[0] });
                    }}
                  />
                </label>
              </div>

              <div>
                <ExtraInfos form={form} />
              </div>
            </VerticalSpaceBetween>
          </React.Fragment>
        ) : (
          <div>Menyiapkan form...</div>
        )}
      </CardSheet>
    </div>
  );
}

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const SplitFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const VerticalSpaceBetween = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const PairedDateTimeFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem 1rem;
`;

/* ========================================== */

function ExtraInfos({ form }) {
  const { data, addExtraInfoItem, updateExtraInfoItem, removeExtraInfoItem } = form;

  const [shouldShowAddExtraInfo, setShowAddExtraInfo] = React.useState(false);
  const [keyExtraInfoEdited, setKeyExtraInfoEdited] = React.useState(null);
  const [keyExtraInfoRemoved, setKeyExtraInfoRemoved] = React.useState(null);

  const handleModalAddInfoShow = () => setShowAddExtraInfo(true);
  const handleModalAddInfoClose = () => setShowAddExtraInfo(false);

  const handleModalEditInfoOpen = (key) => setKeyExtraInfoEdited(key);
  const handleModalEditInfoClose = () => setKeyExtraInfoEdited(null);

  const handleRemoveInformation = (targetInfo) => {
    removeExtraInfoItem(targetInfo.key);
    setKeyExtraInfoRemoved(null);
  };

  return (
    <React.Fragment>
      <ButtonOutlineBlue corner="8" style={{ width: "100%" }} onClick={handleModalAddInfoShow}>
        + Tambah Informasi
      </ButtonOutlineBlue>

      <ModalExtraInfoEditor
        showEditor={shouldShowAddExtraInfo}
        onSave={addExtraInfoItem}
        onClose={handleModalAddInfoClose}
      />

      <div>
        {data?.extraInfos?.map((info) => (
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
                onSave={updateExtraInfoItem}
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
    </React.Fragment>
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

export { ScreenPublicInfos };
