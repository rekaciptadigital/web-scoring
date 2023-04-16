import * as React from "react";
import styled from "styled-components";
import { useSubmitExtraInfo } from "../hooks/submit-extra-info";

import { Modal, ModalBody } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
  AlertSubmitError,
} from "components/ma";
import PosterImagePicker from "../../components/PosterImagePicker";
import {
  FieldInputText,
  FieldTextArea,
  FieldSelectCity,
  FieldSelectRadio,
} from "../../components/form-fields";
import { toast } from "../components/processing-toast";
import { EventLogoUploader } from "../components/event-logo-uploader";

import Switch from "react-switch";

function ScreenPublicInfos({
  eventDetail,
  fetchEventDetail,
  form,
  isPreparing,
}) {
  const { data, updateField } = form;

  const handlePickBannerChange = (ev) => {
    if (!ev.target.files?.[0]) {
      return;
    }
    const imageRawData = ev.target.files[0];
    const imagePreviewUrl = URL.createObjectURL(imageRawData);
    updateField("poster", { preview: imagePreviewUrl, raw: imageRawData });
  };

  if (isPreparing) {
    return <CardSheet>Sedang menyiapkan data...</CardSheet>;
  }

  return (
    <div>
      <CardSheet>
        {data ? (
          <React.Fragment>
            <h3>
              Banner Event<span style={{ color: "var(--ma-red)" }}>*</span>
            </h3>

            <PosterImagePicker
              image={data.poster}
              onChange={handlePickBannerChange}
            />

            <hr />
            <h3 className="mb-3">Detail Event</h3>
            <EarlyBirdActivationBar>
              <div>Aktifkan Event Private</div>
              <ToggleSwitch
                checked={data.isPrivate ? 1 : 0}
                onChange={(val) => updateField("isPrivate", val ? 1 : 0)}
              />
            </EarlyBirdActivationBar>

            <HelpDesk className="mt-2 mb-4">
              Event private tidak akan ditampilkan di landing page myarchery
            </HelpDesk>

            <MediaObject>
              <EventLogoUploader
                eventDetail={eventDetail}
                previewImage={data.logoImage?.preview}
                onChange={(image) => updateField("logoImage", image)}
                onSuccess={fetchEventDetail}
              />

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
            </MediaObject>

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
                    style={{
                      visibility: "hidden",
                      position: "absolute",
                      left: -2000,
                    }}
                    onChange={(ev) => {
                      if (!ev.target.files?.[0]) return;
                      updateField("handbook", { raw: ev.target.files[0] });
                    }}
                  />
                </label>
              </div>

              <div>
                <ExtraInfos
                  eventId={eventDetail?.id}
                  form={form}
                  onSaveSuccess={fetchEventDetail}
                />
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

const MediaObject = styled.div`
  display: flex;
  justify-content: flex-start;

  > *:nth-child(1) {
    flex-shrink: 0;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const VerticalSpaceBetween = styled.div`
  > * + * {
    margin-top: 1rem;
  }
`;

const EarlyBirdActivationBar = styled.div`
  min-height: 3rem;
  padding: 0.5rem;
  padding-left: 1.25rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HelpDesk = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  margin-bottom: 20px;
`;

/* ========================================== */

function ToggleSwitch({ checked, onChange, disabled }) {
  const handleToggling = (event) => {
    onChange?.(event);
  };

  return (
    <Switch
      disabled={disabled}
      checked={Boolean(checked)}
      onChange={handleToggling}
      offColor="#eeeeee"
      onColor="#B4C6E2"
      onHandleColor="#0d47a1"
      height={16}
      width={40}
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    />
  );
}

/* ========================================== */

function ExtraInfos({ eventId, form, onSaveSuccess }) {
  const { data, addExtraInfoItem, updateExtraInfoItem, removeExtraInfoItem } =
    form;

  const [shouldShowAddExtraInfo, setShowAddExtraInfo] = React.useState(false);
  const [keyExtraInfoEdited, setKeyExtraInfoEdited] = React.useState(null);
  const [keyExtraInfoRemoved, setKeyExtraInfoRemoved] = React.useState(null);

  const { add, update, remove } = useSubmitExtraInfo(eventId);

  const handleModalAddInfoShow = () => setShowAddExtraInfo(true);
  const handleModalAddInfoClose = () => setShowAddExtraInfo(false);

  const handleModalEditInfoOpen = (key) => setKeyExtraInfoEdited(key);
  const handleModalEditInfoClose = () => setKeyExtraInfoEdited(null);

  const handleSaveAdd = async (item) => {
    if (!eventId) {
      addExtraInfoItem(item);
    } else {
      toast.loading("Menyimpan informasi event...");
      await new Promise((resolve, reject) => {
        add.submit(item, {
          onSuccess: () => {
            onSaveSuccess?.();
            toast.dismiss();
            toast.success("Informasi event tersimpan");
            resolve();
          },
          onError: () => {
            toast.dismiss();
            toast.error("Gagal menyimpan informasi event");
            reject();
          },
        });
      });
    }
  };

  const handleSaveUpdate = async (item) => {
    if (!eventId) {
      updateExtraInfoItem(item);
    } else {
      toast.loading("Menyimpan perbaruan informasi event...");
      await new Promise((resolve, reject) => {
        update.submit(item, {
          onSuccess: () => {
            onSaveSuccess?.();
            toast.dismiss();
            toast.success("Informasi event diperbarui");
            resolve();
          },
          onError: () => {
            toast.dismiss();
            toast.error("Gagal memperbarui informasi event");
            reject();
          },
        });
      });
    }
  };

  const handleRemoveInformation = (targetInfo) => {
    if (!eventId) {
      removeExtraInfoItem(targetInfo.key);
      setKeyExtraInfoRemoved(null);
    } else {
      toast.loading("Menghapus informasi event...");
      remove.submit(targetInfo.id, {
        onSuccess: () => {
          onSaveSuccess?.();
          toast.dismiss();
          toast.success("Informasi event tersimpan");
        },
        onError: () => {
          toast.dismiss();
          toast.error("Gagal menyimpan informasi event");
        },
      });
    }
  };

  return (
    <React.Fragment>
      <ButtonOutlineBlue
        corner="8"
        style={{ width: "100%" }}
        onClick={handleModalAddInfoShow}
      >
        + Tambah Informasi
      </ButtonOutlineBlue>

      <ModalExtraInfoEditor
        showEditor={shouldShowAddExtraInfo}
        onSave={handleSaveAdd}
        onClose={handleModalAddInfoClose}
      />

      <div>
        {data?.extraInfos?.map((info) => (
          <ExtraInfoItem key={info.key} className="mt-4">
            <div className="info-body">
              <div className="info-body-content">
                <h5>{info.title || "Judul tidak tersedia"}</h5>
                <p className="mb-0">
                  {info.description || "Konten tidak tersedia"}
                </p>
              </div>

              <div>
                <a
                  className="info-button-edit"
                  onClick={() => handleModalEditInfoOpen(info.key)}
                >
                  &#10097;
                </a>
              </div>

              <ModalExtraInfoEditor
                showEditor={keyExtraInfoEdited === info.key}
                infoData={info}
                onSave={handleSaveUpdate}
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

      <AlertSubmitError isError={add.isError} errors={add.errors} />
      <AlertSubmitError isError={update.isError} errors={update.errors} />
      <AlertSubmitError isError={remove.isError} errors={remove.errors} />
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
  const [description, setDescription] = React.useState(
    infoData?.description || ""
  );

  const initialTitle = React.useRef(title);
  const initialDescription = React.useRef(description);

  const shouldSubmitAllowed = () => {
    const isRequiredAll = title && description;
    const isEdited =
      title !== initialTitle.current ||
      description !== initialDescription.current;
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

    try {
      await onSave?.({
        key: infoData?.key,
        title: title,
        description: description,
      });
      handleCloseModal();
    } catch (err) {
      // supaya gak close modal kalau gagal simpan
      // bisa ulang klik simpan tampa kehilangan data
      console.error("Gagal menyimpan info");
    }
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

        <div
          className="mt-4 d-flex justify-content-end"
          style={{ gap: "0.5rem" }}
        >
          <Button
            style={{ color: "var(--ma-blue)" }}
            onClick={handleCloseModal}
          >
            Batal
          </Button>
          <ButtonBlue
            onClick={handleClickSave}
            disabled={!shouldSubmitAllowed()}
          >
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
        <i
          className="bx bx-trash font-size-18 align-middle"
          style={{ color: "var(--ma-red)" }}
        />
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
