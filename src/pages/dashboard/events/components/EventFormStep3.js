import { Button, DateInput, SelectInput, TextInput } from "components";
import React, { useState } from "react";
import { Col, Label, Row } from "reactstrap";
import stringUtil from "utils/stringUtil";
import { dummyConstants } from "../../../../constants";
import ModalDistances from "./ModalDistances";
import ModalTeamCategories from "./ModalTeamCategories";
import styles from "./style";

export const EventFormStep3 = ({ onFormFieldChange, formData }) => {
  const [categories, setCategories] = useState([
    {
      id: stringUtil.createRandom(),
      competitionCategories: [
        {
          id: stringUtil.createRandom(),
        },
      ],
    },
  ]);
  const [isOpenTeamCategoryModal, setIsOpenTeamCategoryModal] = useState(false);
  const [isOpenDistanceModal, setIsOpenDistanceModal] = useState(false);

  function toggleTeamCategoryModal() {
    setIsOpenTeamCategoryModal(!isOpenTeamCategoryModal);
  }

  function toggleDistanceModal() {
    setIsOpenDistanceModal(!isOpenDistanceModal);
  }

  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  function handleAddRow() {
    const newCategory = {
      id: stringUtil.createRandom(),
      competitionCategories: [
        {
          id: stringUtil.createRandom(),
        },
      ],
    };
    let categoryList = [...categories];
    categoryList.push(newCategory);
    setCategories(categoryList);
  }

  function handleRemoveRow(e, index) {
    if (index !== undefined && index !== null) {
      const newItems = [...categories];
      newItems.splice(index, 1);
      setCategories(newItems);

      handleChange({
        key: `eventCategories.${index}`,
        value: undefined,
      });
    }
  }

  function handleAddCompetitionCategory(categoryIndex) {
    const modifiedCategories = [...categories];
    modifiedCategories[categoryIndex].competitionCategories.push({
      id: stringUtil.createRandom(),
    });
    setCategories(modifiedCategories);
  }

  function handleRemoveCompetitionCategory(
    categoryIndex,
    competitionCategoryIndex
  ) {
    const modifiedCategories = [...categories];
    modifiedCategories[categoryIndex].competitionCategories.splice(
      competitionCategoryIndex,
      1
    );
    setCategories(modifiedCategories);
    handleChange({
      key: `eventCategories.${categoryIndex}.competitionCategories.${competitionCategoryIndex}`,
      value: undefined,
    });
  }

  return (
    <Row>
      <Col xs={12}>
        {categories.map((item, index) => (
          <Row style={styles.categoryBox} key={index} id={"row" + index}>
            <Label>Kategori Kelas</Label>
            <div className="row">
              <Col lg={3}>
                <SelectInput
                  name={`eventCategories.${index}.ageCategories`}
                  onChange={handleChange}
                  options={dummyConstants.eventAgeCategories}
                  value={formData.eventCategories[index]?.ageCategories}
                />
              </Col>
              <Col lg={3}>
                <DateInput
                  name={`eventCategories.${index}.maxDateOfBirth`}
                  onChange={handleChange}
                  value={formData.eventCategories[index]?.maxDateOfBirth}
                />
              </Col>
              {formData.eventCategories[index]?.teamCategories?.length > 0 && (
                <Col lg={3}>
                  <SelectInput
                    name={`eventCategories.${index}.selectedTeamCategories`}
                    onChange={handleChange}
                    options={formData.eventCategories[index]?.teamCategories}
                  />
                </Col>
              )}
              <Col lg={2}>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      toggleTeamCategoryModal();
                    }}
                    label="Tambah Info"
                    trailingIcon="plus"
                  />
                  <ModalTeamCategories
                    isOpen={isOpenTeamCategoryModal}
                    toggle={() => {
                      toggleTeamCategoryModal();
                    }}
                    options={formData.teamCategories || []}
                    name={`eventCategories.${index}.teamCategories`}
                    onSaveChange={handleChange}
                  />
                </div>
              </Col>
              {index > 0 && (
                <Col>
                  <button
                    type="button"
                    className="btn btn-danger "
                    onClick={e => {
                      handleRemoveRow(e, index);
                    }}
                  >
                    <i className="bx bx-trash font-size-16 align-middle"></i>{" "}
                  </button>
                </Col>
              )}
            </div>
            <Label>Kategori Lomba</Label>
            {item.competitionCategories.map(
              (competitionCategory, competitionCategoryIndex) => {
                return (
                  <Row key={competitionCategory.id}>
                    <Col lg={3}>
                      <SelectInput
                        options={dummyConstants.eventCompetitionCategories}
                        name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.name`}
                        onChange={handleChange}
                        value={
                          formData.eventCategories?.[index]
                            ?.competitionCategories?.[competitionCategoryIndex]
                            ?.name
                        }
                      />
                    </Col>
                    <Col lg={4}>
                      <TextInput
                        readOnly
                        accessoryRight={
                          <Button
                            icon="plus"
                            onClick={() => toggleDistanceModal()}
                          />
                        }
                        value={
                          formData.eventCategories?.[index]
                            ?.competitionCategories?.[competitionCategoryIndex]
                            ?.distances || ""
                        }
                      />
                      <ModalDistances
                        isOpen={isOpenDistanceModal}
                        name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.distances`}
                        toggle={() => {
                          toggleDistanceModal();
                        }}
                        onSaveChange={handleChange}
                      />
                    </Col>
                    <Col lg={3}>
                      <Button
                        onClick={() => {
                          handleAddCompetitionCategory(index);
                        }}
                        icon="copy"
                      />{" "}
                      {competitionCategoryIndex > 0 && (
                        <Button
                          onClick={() => {
                            handleRemoveCompetitionCategory(
                              index,
                              competitionCategoryIndex
                            );
                          }}
                          icon="trash"
                          type="danger"
                        />
                      )}
                    </Col>
                  </Row>
                );
              }
            )}
          </Row>
        ))}
        <input
          data-repeater-create
          type="button"
          className="btn btn-success mt-3 mt-lg-0"
          value="Add"
          onClick={() => handleAddRow()}
        />
      </Col>
    </Row>
  );
};
