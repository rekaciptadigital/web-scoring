import * as React from "react";
import styled from "styled-components";

import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

import imgSuccess from "assets/images/myachery/update-category.png";

function AlertSuccess({
  isSuccess = false,
  onConfirm,
  buttonLabel = "Kembali",
  prompt,
  description,
}) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirm = () => {
    setAlertOpen(false);
    onConfirm?.();
  };

  React.useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setAlertOpen(true);
  }, [isSuccess]);

  return (
    <SweetAlert
      show={isAlertOpen}
      title=""
      custom
      btnSize="md"
      onConfirm={handleConfirm}
      style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
      customButtons={
        <span className="d-flex justify-content-center" style={{ gap: "0.5rem", width: "100%" }}>
          <ButtonBlue block onClick={handleConfirm}>
            {buttonLabel}
          </ButtonBlue>
        </span>
      }
    >
      <IllustationAlertPrompt />
      {prompt && <h4>{prompt} </h4>}
      {description && <p className="text-muted">{description}</p>}
    </SweetAlert>
  );
}

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${imgSuccess});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export { AlertSuccess };
