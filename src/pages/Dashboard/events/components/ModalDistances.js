import { CheckboxInput } from "components";
import React from "react";
import { Modal } from "reactstrap";
import { dummyConstants } from "../../../../constants";

const ModalDistances = ({ isOpen, toggle }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0" id="myModalLabel">
          Jarak
        </h5>
        <button
          type="button"
          onClick={() => {
            toggle();
          }}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <CheckboxInput label="Jarak" options={dummyConstants.eventDistances} inline />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          onClick={() => {
            toggle();
          }}
          className="btn btn-secondary "
          data-dismiss="modal"
        >
          Close
        </button>
        <button type="button" className="btn btn-primary ">
          Save changes
        </button>
      </div>
    </Modal>
  );
};

export default ModalDistances;
