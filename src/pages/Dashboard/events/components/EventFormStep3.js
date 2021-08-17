import { Button, DateInput, SelectInput, TextInput } from "components";
import React, { useState } from "react";
import { Col, Label, Row } from "reactstrap";
import stringUtil from "utils/stringUtil";
import { dummyConstants } from "../../../../constants";
import ModalDistances from "./ModalDistances";
import ModalTeamCategories from "./ModalTeamCategories";
import styles from "./style";

export const EventFormStep3 = ({ onFormFieldChange }) => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      competitionCategories: [
        {
          id: 1,
        },
      ],
    },
  ]);
  const [modal_standard, setmodal_standard] = useState(false);
  const [modal_standard_v2, setmodal_standard_v2] = useState(false);

  function handleAddRow() {
    const newCategory = {
      id: stringUtil.createRandom(),
      competitionCategories: [
        {
          id: stringUtil.createRandom(),
        },
      ],
    };
    setCategories([...categories, newCategory]);
  }

  function handleRemoveRow(e, index) {
    if (typeof index != "undefined") {
      const newItems = categories.splice(index, 1);
      setCategories(newItems);
    }
  }

  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  function tog_standard_v2() {
    setmodal_standard_v2(!modal_standard_v2);
  }

  function handleAddCompetitionCategory(id) {
    const modifiedCategories = [...categories];
    const categoryIndex = _.findIndex(categories, ["id", id]);
    modifiedCategories[categoryIndex].competitionCategories.push({
      id: stringUtil.createRandom(),
    });
    setCategories(modifiedCategories);
  }
  //   function handleRemoveCompetitionCategory(id) {}

  const handleChange = ({ key, value }) => {
    console.log({ key, value });
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <Row>
      <Col xs={12}>
        {categories.map((item, idx) => (
          <div style={styles.categoryBox} key={idx} id={"row" + idx}>
            <Label>Kategori Kelas</Label>
            <div className="row">
              <Col lg={3}>
                <SelectInput
                  options={dummyConstants.eventAgeCategories}
                  onChange={handleChange}
                  name={`eventCategories.${idx}.ageCategories`}
                />
              </Col>
              <Col lg={3}>
                <DateInput name="maxDateOfBirth" onChange={handleChange} />
              </Col>
              <Col lg={3}>
                <SelectInput />
              </Col>
              <Col lg={2}>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      tog_standard();
                    }}
                    label="Tambah Info"
                    trailingIcon="plus"
                  />
                  <ModalTeamCategories
                    isOpen={modal_standard}
                    toggle={() => {
                      tog_standard();
                    }}
                  />
                </div>
              </Col>
              <Col>
                <button
                  type="button"
                  className="btn btn-danger "
                  onClick={e => {
                    handleRemoveRow(e, idx);
                  }}
                >
                  <i className="bx bx-trash font-size-16 align-middle"></i>{" "}
                </button>
              </Col>
            </div>
            <Label>Kategori Lomba</Label>
            {item.competitionCategories.map(competitionCategory => {
              return (
                <Row key={competitionCategory.id}>
                  <Col lg={3}>
                    <SelectInput
                      options={dummyConstants.eventCompetitionCategories}
                    />
                  </Col>
                  <Col lg={4}>
                    <TextInput
                      accessoryRight={
                        <Button icon="plus" onClick={() => tog_standard_v2()} />
                      }
                    />
                    <ModalDistances
                      isOpen={modal_standard_v2}
                      toggle={() => {
                        tog_standard_v2();
                      }}
                    />
                  </Col>
                  <Col lg={3}>
                    <Button
                      onClick={() => {
                        handleAddCompetitionCategory(item.id);
                      }}
                      icon="copy"
                    />{" "}
                    <Button icon="trash" type="danger" />
                  </Col>
                </Row>
              );
            })}
          </div>
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
