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
    const newCategory = { ...formData.eventCategories[index] };
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
      <Col lg={12}>
        {formData.eventCategories.map((eventCategory, index) => (
          <Row key={index} id={"row" + index}>
            <Col lg={12} style={styles.categoryBox}>
              <Label>Kategori Kelas</Label>
              <Row>
                <Col lg={4}>
                  <SelectInput
                    name={`eventCategories.${index}.ageCategory`}
                    onChange={handleChange}
                    options={dummyConstants.eventAgeCategories}
                    value={eventCategory.ageCategory}
                  />
                </Col>
                <Col lg={4}>
                  <DateInput
                    name={`eventCategories.${index}.maxDateOfBirth`}
                    onChange={handleChange}
                    value={eventCategory.maxDateOfBirth}
                  />
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      handleCopyRow(index);
                    }}
                    icon="copy"
                    type="primary"
                  />{" "}
                  {formData.eventCategories.length > 1 && (
                    <Button
                      onClick={(e) => {
                        handleRemoveRow(e, index);
                      }}
                      icon="trash"
                      type="danger"
                    />
                  )}
                </Col>
              </Row>
              <Label>Kategori Lomba</Label>
              <Row style={{paddingLeft: 10, paddingRight: 10}}>
                <Col style={{ border: "dashed 1px #dedede", padding: 10 }}>
                  {eventCategory.competitionCategories.map(
                    (competitionCategory, competitionCategoryIndex) => {
                      return (
                        <Row key={competitionCategory.id}>
                          <Col lg={4}>
                            <SelectInput
                              options={
                                dummyConstants.eventCompetitionCategories
                              }
                              name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.competitionCategory`}
                              onChange={handleChange}
                              value={competitionCategory.competitionCategory}
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
                          <Col lg={4}>
                            <div>
                              <Button
                                type="primary"
                                onClick={() => {
                                  handleChange({
                                    key: `eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.isOpenTeamCategoryModal`,
                                    value: true,
                                  });
                                }}
                                label={
                                  competitionCategory.teamCategories?.length > 0
                                    ? "Rincian Kuota"
                                    : "Tambah Kuota"
                                }
                                trailingIcon={
                                  competitionCategory.teamCategories?.length > 0
                                    ? "pencil"
                                    : "plus"
                                }
                                outline
                              />
                              <ModalTeamCategories
                                isOpen={
                                  competitionCategory.isOpenTeamCategoryModal
                                }
                                toggle={() => {
                                  handleChange({
                                    key: `eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.isOpenTeamCategoryModal`,
                                    value: false,
                                  });
                                }}
                                options={formData.teamCategories || []}
                                name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.teamCategories`}
                                onSaveChange={handleChange}
                              />{" "}
                              <Button
                                onClick={() => {
                                  handleAddCompetitionCategory(index);
                                }}
                                icon="copy"
                                outline
                              />{" "}
                              {eventCategory.competitionCategories.length >
                                1 && (
                                <Button
                                  onClick={() => {
                                    handleRemoveCompetitionCategory(
                                      index,
                                      competitionCategoryIndex
                                    );
                                  }}
                                  icon="trash"
                                  type="danger"
                                  outline
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                      );
                    }
                  )}
                </Col>
              </Row>
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
