import {
    SwitchInput,
    TextInput,
    SelectInput,
    RadioButtonInput,
    DateInput,
    Button
  } from "components";
  import React from "react";
  import { Col, Row, Label, } from "reactstrap";
  import { selectConstants } from "constants/index";
  import { dummyConstants } from "constants/index";
  import { stringUtil } from "utils";

  export const FulldayFormStep1 = ({ onFormFieldChange, formData }) => {
    const handleChange = ({ key, value }) => {
      if (onFormFieldChange) onFormFieldChange(key, value);
    };

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
        <Col lg={8}>
          <Row>
            <Col lg={12}>
                <label>Daftar Sebagai?</label>
                <RadioButtonInput
                    name="fulldayAudience"
                    onChange={handleChange}
                    options={selectConstants.fulldayAudience}
                    value={formData.fulldayAudience}
                />
            </Col>
            <Col lg={4}>
              <TextInput
                label="Email"
                name="email"
                value={formData.location}
                onChange={handleChange}
              />
            </Col>
            <Col lg={4}>
              <TextInput
                label="No. Telepon"
                name="phone"
                value={formData.city}
                onChange={handleChange}
              />
            </Col>
            <Col lg={4}>
              <TextInput
                label="Nama Klub (Opsional)"
                name="clubName"
                value={formData.city}
                onChange={handleChange}
              />
            </Col>
          
            <Col lg={12}>
                <SwitchInput
                label="Nama peserta sama dengan pemilik akun "
                name="isUserSamePlayer"
                onChange={handleChange}
                options={selectConstants.confirmation}
                inline
                value={formData.isFlatRegistrationFee}
                />
            </Col>

             {formData.fulldayAudience.id === "Tim" ? (
              <Col lg={4}>
                <TextInput
                  label="Nama Tim"
                  name="teamName"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Col>
            ) : (
              <>
                <Col lg={4}>
                  <TextInput
                    label="Nama Peserta"
                    name="teamName"
                    value={formData.city}
                    onChange={handleChange}
                    />
                </Col>

                <Col lg={4}>
                  <DateInput
                      label="Tanggal Lahir"
                      name="dateBirth"
                      value={formData.registrationStartDatetime}
                      onChange={handleChange}
                    />
                </Col>

                <Col lg={4}>
                  <label>Jenis Kelamin</label>
                  <RadioButtonInput
                      name="gender"
                      onChange={handleChange}
                      options={selectConstants.gender}
                      value={formData.gender}
                    />
                </Col>
              </>
            
            )}

            <Label>Kategori Lomba</Label>
              <Row >
                <SelectInput
                    options={
                    dummyConstants.eventCompetitionCategories
                    }
                    name="category"
                    onChange={handleChange}
                    value={formData.competitionCategory}
                />
              </Row>


              <Label className="mt-2">Nama Peserta (Tim)</Label>
              
              {formData.eventCategories.map((eventCategory, index) => (
              <Row key={index} >
                <Col style={{ border: "dashed 1px #dedede", padding: 10 }}>
                  {eventCategory.competitionCategories.map(
                    (competitionCategory, competitionCategoryIndex) => {
                      return (
                        <Row key={competitionCategory.id}>
                          <Col lg={4}>
                            
                              <TextInput
                                name={`eventCategories.${index}.competitionCategories.${competitionCategoryIndex}.competitionCategory`}
                                value={formData.city}
                                onChange={handleChange}
                              />
                          </Col>
                         
                          <Col lg={4}>
                            <div>
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
              ))};
          </Row>
        </Col>
      
    );
  };
  