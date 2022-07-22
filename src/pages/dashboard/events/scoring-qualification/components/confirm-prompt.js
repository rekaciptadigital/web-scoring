import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

import illustrationAlert from "assets/images/events/alert-publication.svg";

function ConfirmPrompt({
  shouldPrompt,
  renderButton,
  reverseButtons,
  buttonConfirmLabel,
  onConfirm,
  buttonCancelLabel,
  onCancel,
  messagePrompt,
  messageDescription,
}) {
  const [showAlert, setShowAlert] = React.useState(false);

  const handleCancel = () => {
    setShowAlert(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    setShowAlert(false);
    onConfirm?.();
  };

  const handlers = {
    handlePrompt: () => {
      if (shouldPrompt) {
        setShowAlert(true);
      } else {
        handleConfirm();
      }
    },
  };

  return (
    <React.Fragment>
      {renderButton ? (
        renderButton(handlers)
      ) : (
        <span>Render button dengan prop render function yang disediakan</span>
      )}
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
            {reverseButtons ? (
              <React.Fragment>
                <Button onClick={handleConfirm}>{buttonConfirmLabel || "Konfirmasi"}</Button>
                <ButtonBlue onClick={handleCancel}>{buttonCancelLabel || "Batal"}</ButtonBlue>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button onClick={handleCancel}>{buttonCancelLabel || "Batal"}</Button>
                <ButtonBlue onClick={handleConfirm}>
                  {buttonConfirmLabel || "Konfirmasi"}
                </ButtonBlue>
              </React.Fragment>
            )}
          </span>
        }
      >
        <IllustationAlertPrompt />
        {messagePrompt && <h4>{messagePrompt}</h4>}
        {messageDescription && <p className="text-muted">{messageDescription}</p>}
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

export { ConfirmPrompt };
