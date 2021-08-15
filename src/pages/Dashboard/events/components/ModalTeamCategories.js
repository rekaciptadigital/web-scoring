import { selectConstants } from "../../../../constants";
import React from "react";
import { Modal } from "reactstrap";
import { TextInput } from "components";

const ModalTeamCategories = ({ isOpen, toggle }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        toggle();
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0" id="myModalLabel">
          Kategori Regu
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
        <table className="table">
          <thead>
            <tr>
              <th>Kategori Regu</th>
              <th>Kuota</th>
            </tr>
          </thead>
          <tbody>
            {selectConstants.teamCategories.map(category => {
              return (
                <tr key={category.id}>
                  <td>{category.label}</td>
                  <td><TextInput /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

export default ModalTeamCategories;
