import { Button, DateInput, SelectInput, TextInput } from "components";
import { dummyConstants } from "constants/index";
import React from "react";
import { Col, Label, Row } from "reactstrap";
import { stringUtil } from "utils";
import styles from "../styles";
import ModalDistances from "./ModalDistances";
import ModalTeamCategories from "./ModalTeamCategories";

export const EventFormStep4 = ({ onFormFieldChange, formData }) => {
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
    let categoryList = [...formData.eventCategories];
    categoryList.push(newCategory);
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  function handleCopyRow(index) {
    const newCategory = {...formData.eventCategories[index]};
    let categoryList = [...formData.eventCategories];
    categoryList.splice(index + 1, 0, newCategory);
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  function handleRemoveRow(e, index) {
    if (index !== undefined && index !== null) {
      const categoryList = [...formData.eventCategories];
      categoryList.splice(index, 1);

      handleChange({
        key: "eventCategories",
        value: categoryList,
      });
    }
  }

  function handleAddCompetitionCategory(categoryIndex) {
    const categoryList = [...formData.eventCategories];
    categoryList[categoryIndex].competitionCategories.push({
      id: stringUtil.createRandom(),
    });
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  function handleRemoveCompetitionCategory(
    categoryIndex,
    competitionCategoryIndex
  ) {
    const categoryList = [...formData.eventCategories];
    categoryList[categoryIndex].competitionCategories.splice(
      competitionCategoryIndex,
      1
    );
    handleChange({
      key: "eventCategories",
      value: categoryList,
    });
  }

  return (
    <Row>
      <Col xs={12}>
        {formData.eventCategories.map((eventCategory, index) => (
          <Row style={styles.categoryBox} key={index} id={"row" + index}>
            <Col lg={10}>
              <Label>Kategori Kelas</Label>
              <div className="row">
                <Col lg={4}>
                  <SelectInput
                    name={`eventCategories.${index}.ageCategories`}
                    onChange={handleChange}
                    options={dummyConstants.eventAgeCategories}
                    value={eventCategory.ageCategories}
                  />
                </Col>
                <Col lg={4}>
                  <DateInput
                    name={`eventCategories.${index}.maxDateOfBirth`}
                    onChange={handleChange}
                    value={eventCategory.maxDateOfBirth}
                  />
                </Col>
                <Col lg={4}>
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleChange({
                          key: `eventCategories.${index}.isOpenTeamCategoryModal`,
                          value: true,
                        });
                      }}
                      label={
                        formData.eventCategories[index]?.teamCategories
                          ?.length > 0
                          ? `${formData.eventCategories[index]?.teamCategories?.length} jenis regu`
                          : "Tambah Info"
                      }
                      trailingIcon={
                        formData.eventCategories[index]?.teamCategories
                          ?.length <= 0 && "plus"
                      }
                    />
                    <ModalTeamCategories
                      isOpen={eventCategory.isOpenTeamCategoryModal}
                      toggle={() => {
                        handleChange({
                          key: `eventCategories.${index}.isOpenTeamCategoryModal`,
                          value: false,
                        });
                      }}
                      options={formData.teamCategories || []}
                      name={`eventCategories.${index}.teamCategories`}
                      onSaveChange={handleChange}
                    />
                  </div>
                </Col>
              </div>
              <Label>Kategori Lomba</Label>
              {eventCategory.competitionCategories.map(
                (competitionCategory, competitionCategoryIndex) => {
                  return (
                    <Row key={competitionCategory.id}>
                      <Col lg={4}>
                        <SelectInput
                          options={dummyConstants.eventCompetitionCategories}
                          name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.name`}
                          onChange={handleChange}
                          value={competitionCategory.name}
                        />
                      </Col>
                      <Col lg={4}>
                        <TextInput
                          readOnly
                          accessoryRight={
                            <Button
                              icon="plus"
                              onClick={() =>
                                handleChange({
                                  key: `eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.isOpenDistanceModal`,
                                  value: true,
                                })
                              }
                            />
                          }
                          value={competitionCategory.distances || ""}
                        />
                        <ModalDistances
                          isOpen={competitionCategory.isOpenDistanceModal}
                          name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.distances`}
                          toggle={() => {
                            handleChange({
                              key: `eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.isOpenDistanceModal`,
                              value: false,
                            });
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
                        {eventCategory.competitionCategories.length > 1 && (
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
            </Col>
            <Col>
              <Label>Aksi</Label>
              <div>
                <button
                  type="button"
                  className="btn btn-primary "
                  onClick={() => {
                    handleCopyRow(index);
                  }}
                >
                  <i className="bx bx-copy font-size-16 align-middle"></i>{" "}
                </button>{" "}
                {formData.eventCategories.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger "
                    onClick={(e) => {
                      handleRemoveRow(e, index);
                    }}
                  >
                    <i className="bx bx-trash font-size-16 align-middle"></i>{" "}
                  </button>
                )}
              </div>
            </Col>
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
