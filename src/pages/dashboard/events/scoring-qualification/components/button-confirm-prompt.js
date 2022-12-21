import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import illustrationAlert from "assets/images/events/alert-publication.svg";

function ButtonConfirmPrompt({ disabled, title, onConfirm, onCancel }) {
  const [showAlertFirst, setShowAlertFirst] = React.useState(false);
  const [showAlertSecond, setShowAlertSecond] = React.useState(false);

  const handleCancel = () => {
    setShowAlertFirst(false);
    setShowAlertSecond(false);
    onCancel?.();
  };

  const goNextPrompt = () => {
    setShowAlertSecond(false);
    setShowAlertFirst(true);
  };

  const hitConfig = () => {
    onConfirm?.();
  };

  const handleConfirm = async () => {
    setShowAlertFirst(false);
    hitConfig();
  };

  const LABEL_BUTTON_CANCEL = "Batalkan";
  const LABEL_BUTTON_CONFIRM = "Iya, Tentukan Eliminasi";

  const TEXT_PROMPT_SECOND = "Yakin data yang diinput sudah benar?";
  const TEXT_DESCRIPTION_SECOND =
    "Jumlah peserta dan data yang telah ditentukan tidak dapat diubah kembali. Pemeringkatan eliminasi dapat dilihat dalam bentuk bagan.";

  const TEXT_PROMPT_FIRST =
    "Anda tidak dapat merubah data setelah menentukan pemeringkatan eliminasi";
  const TEXT_DESCRIPTION_FIRST =
    "Pemeringkatan eliminasi dapat dilihat dalam bentuk bagan.";

  return (
    <React.Fragment>
      <ButtonBlue
        title={title}
        onClick={() => setShowAlertFirst(true)}
        disabled={disabled}
        flexible
      >
        Lanjut ke Eliminasi
      </ButtonBlue>

      <Alert
        show={showAlertSecond}
        onCancel={handleCancel}
        onConfirm={goNextPrompt}
        labelButtonCancel={LABEL_BUTTON_CANCEL}
        labelButtonConfirm={LABEL_BUTTON_CONFIRM}
        textPrompt={TEXT_PROMPT_FIRST}
        textDescription={TEXT_DESCRIPTION_FIRST}
      />

      <Alert
        show={showAlertFirst}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        labelButtonCancel={LABEL_BUTTON_CANCEL}
        labelButtonConfirm={LABEL_BUTTON_CONFIRM}
        textPrompt={TEXT_PROMPT_SECOND}
        textDescription={TEXT_DESCRIPTION_SECOND}
      />
    </React.Fragment>
  );
}

function Alert({
  show,
  onConfirm,
  onCancel,
  labelButtonCancel,
  labelButtonConfirm,
  textPrompt,
  textDescription,
}) {
  return (
    <SweetAlert
      title=""
      show={show}
      custom
      btnSize="md"
      onCancel={onCancel}
      onConfirm={onConfirm}
      style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
      customButtons={
        <span
          className="d-flex justify-content-center"
          style={{ gap: "0.5rem", width: "100%" }}
        >
          <Button onClick={onCancel}>{labelButtonCancel}</Button>
          <ButtonBlue onClick={onConfirm}>{labelButtonConfirm}</ButtonBlue>
        </span>
      }
    >
      <IllustationAlertPrompt />
      <h4>{textPrompt}</h4>
      <p className="text-muted">{textDescription}</p>
    </SweetAlert>
  );
}

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationAlert});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export { ButtonConfirmPrompt };
