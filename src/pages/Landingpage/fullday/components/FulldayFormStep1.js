import {
    SwitchInput,
    TextInput,
    CheckboxInput,
    SelectInput
  } from "components";
  import React from "react";
  import { Col, Row, Label } from "reactstrap";
  import { selectConstants } from "constants/index";
import { dummyConstants } from "constants/index";
import CardTicket from "./cardTicket";
  
  export const FulldayFormStep1 = ({ onFormFieldChange, formData }) => {
    const handleChange = ({ key, value }) => {
      if (onFormFieldChange) onFormFieldChange(key, value);
    };
  
    return (
      <Row>
        <Col lg={8}>
          <Row>
            <Col lg={12}>
                <CheckboxInput
                    label="Daftar Sebagai?"
                    name="teamCategories"
                    onChange={handleChange}
                    options={selectConstants.fulldayAudience}
                    inline
                    value={formData.teamCategories}
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
            <Col lg={4}>
              <TextInput
                label="Nama Tim"
                name="teamName"
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
              <Col lg={4}>
           
            <TextInput
                label="Nama Tim"
                name="teamName"
                value={formData.city}
                onChange={handleChange}
              />
            </Col>
           
          </Row>
        </Col>
        <Col lg={4}>
          <CardTicket/>
        </Col>
      </Row>
    );
  };
  