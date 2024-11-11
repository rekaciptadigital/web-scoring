import * as React from "react";
import PropTypes from "prop-types";

import SweetAlert from "react-bootstrap-sweetalert";
import { Button, ButtonBlue } from "components/ma";

function AlertPromptSave({
  children,
  shouldConfirm,
  onConfirm,
  onClose,
  labelCancel = "Batal",
  labelConfirm = "Konfirmasi",
}) {
  const [isAlertOpen, setAlertOpen] = React.useState(false);

  const handleConfirm = async () => {
    await onConfirm?.();
    setAlertOpen(false);
  };

  const handleCancel = () => {
    setAlertOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    if (!shouldConfirm) {
      return;
    }
    setAlertOpen(true);
  }, [shouldConfirm]);

  return (
    <SweetAlert
      show={isAlertOpen}
      title=""
      custom
      btnSize="md"
      style={{ padding: "30px 40px", width: "520px" }}
      onConfirm={handleConfirm}
      customButtons={
        <span className="d-flex justify-content-center" style={{ gap: "0.5rem" }}>
          <Button style={{ minWidth: 120 }} onClick={handleCancel}>
            {labelCancel}
          </Button>
          <ButtonBlue style={{ minWidth: 120 }} onClick={handleConfirm}>
            {labelConfirm}
          </ButtonBlue>
        </span>
      }
    >
      <div>
        <p>{children}</p>
      </div>
    </SweetAlert>
  );
}

AlertPromptSave.propTypes = {
  children: PropTypes.node.isRequired,
  shouldConfirm: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  labelCancel: PropTypes.string,
  labelConfirm: PropTypes.string
};

export { AlertPromptSave };
