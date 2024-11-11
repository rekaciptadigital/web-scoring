import * as React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import SweetAlert from "react-bootstrap-sweetalert";
import { ButtonBlue } from "components/ma";

import imgSuccess from "assets/images/myachery/update-category.png";

function AlertSuccess({ isSuccess = false, onConfirm }) {
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
            Masuk
          </ButtonBlue>
        </span>
      }
    >
      <IllustationAlertPrompt />
      <h4>Berhasil</h4>
      <p className="text-muted">Selamat! Akun Anda telah berhasil dibuat</p>
    </SweetAlert>
  );
}

AlertSuccess.propTypes = {
  isSuccess: PropTypes.bool,
  onConfirm: PropTypes.func,
};

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
