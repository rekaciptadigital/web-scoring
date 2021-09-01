import { NumberInput } from "components";
import React, { useEffect, useState } from "react";
import { Input, Modal } from "reactstrap";

const ModalTeamCategories = ({
  isOpen,
  toggle,
  options,
  onSaveChange,
  name,
}) => {
  const [teamCategories, setTeamCategories] = useState([]);

  useEffect(() => {
    const newTeamCategories = options.map((option) => {
      const newOption = { ...option };
      if (!newOption.checked) newOption.checked = false;

      return newOption;
    });
    setTeamCategories(newTeamCategories);
  }, [options]);

  const handleCheck = (e, index, category) => {
    const checked = e.target.checked;
    const newTeamCategories = [...teamCategories];
    const newCategory = category;
    if (checked) {
      newCategory.checked = true;
      newTeamCategories[index] = newCategory;
    } else {
      newCategory.checked = false;
      newTeamCategories[index] = newCategory;
    }
    setTeamCategories(newTeamCategories);
  };

  const handleChange = (e, index, category) => {
    const newTeamCategories = [...teamCategories];
    const newCategory = category;
    newCategory.checked = true;
    newCategory.quota = e.value;
    newTeamCategories[index] = newCategory;
    setTeamCategories(newTeamCategories);
  };

  const handleSave = () => {
    const selectedTeamCategories = _.filter(teamCategories, ["checked", true]);
    if (onSaveChange) {
      onSaveChange({ key: name, value: selectedTeamCategories });
    }
    toggle();
  };

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
              <th colSpan={2}>Kategori Regu</th>
              <th>Kuota</th>
            </tr>
          </thead>
          <tbody>
            {teamCategories.map((category, categoryIndex) => {
              return (
                <tr key={`${name}${category.id}`}>
                  <td>
                    <Input
                      type="checkbox"
                      className="form-check-Input"
                      id={`${name}${category.id}`}
                      onChange={(e) => handleCheck(e, categoryIndex, category)}
                      checked={category.checked}
                    />
                  </td>
                  <td>{category.label}</td>
                  <td>
                    <NumberInput
                      onChange={(e) => handleChange(e, categoryIndex, category)}
                      value={category.quota || ""}
                    />
                  </td>
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
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            handleSave();
          }}
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
};

export default ModalTeamCategories;
