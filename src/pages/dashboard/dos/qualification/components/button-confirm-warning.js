import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import illustrationAlert from "assets/images/events/alert-publication.svg";

function ButtonConfirmWarning({
  children,
  disabled,
  customButton,
  messagePrompt,
  buttonConfirmLabel,
}) {
  const [showAlert, setShowAlert] = React.useState(false);

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleConfirm = () => {
    setShowAlert(false);
  };

  const CustomButtomComp = customButton || Button;

  const buttonTriggerProps = {
    onClick: () => setShowAlert(true),
    disabled: disabled,
  };

  return (
    <React.Fragment>
      <CustomButtomComp {...buttonTriggerProps}>{children}</CustomButtomComp>
      <SweetAlert
        show={showAlert}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
        customButtons={
          <span className="d-flex justify-content-center" style={{ gap: "0.5rem", width: "100%" }}>
            <ButtonBlue onClick={handleConfirm}>{buttonConfirmLabel || "Konfirmasi"}</ButtonBlue>
          </span>
        }
      >
        <IllustationAlertPrompt />
        {messagePrompt && <h4>{messagePrompt}</h4>}
      </SweetAlert>
    </React.Fragment>
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

export { ButtonConfirmWarning };
