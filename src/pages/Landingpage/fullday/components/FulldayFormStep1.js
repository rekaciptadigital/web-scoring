import {
    SwitchInput,
    TextInput,
    SelectInput,
    RadioButtonInput,
    DateInput,
  } from "components";
  import React from "react";
  import { Col, Row, Label } from "reactstrap";
  import { selectConstants } from "constants/index";
  import { dummyConstants } from "constants/index";

  export const FulldayFormStep1 = ({ onFormFieldChange, formData }) => {
    const handleChange = ({ key, value }) => {
      if (onFormFieldChange) onFormFieldChange(key, value);
    };
  
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
          </Row>
        </Col>
      
    );
  };
  