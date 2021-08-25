import { CheckboxInput, CurrencyInput, SwitchInput } from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { selectConstants } from "../../../../constants";

export const EventFormStep2 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            inline
            label="Biaya Registrasi pertandingan yang tersedia"
            name="registrationFee"
            onChange={handleChange}
            options={selectConstants.eventAvailableRegistrationFee}
            value={formData.registrationFee}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Kategori regu yang dipertandingkan"
            name="teamCategories"
            onChange={handleChange}
            options={selectConstants.teamCategories}
            inline
            value={formData.teamCategories}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <SwitchInput
            label="Apakah Harga setiap kategori sama?"
            name="isFlatRegistrationFee"
            onChange={handleChange}
            options={selectConstants.confirmation}
            inline
            value={formData.isFlatRegistrationFee}
          />
        </Col>
      </Row>
      <Row>
        {formData.registrationFee?.map((registrationFee, index) => (
          <Col lg={3} key={registrationFee.id}>
            <CurrencyInput
              disabled={!formData.isFlatRegistrationFee}
              horizontal
              label={registrationFee.label}
              name={`registrationFee.${index}.price`}
              onChange={handleChange}
              value={formData.registrationFee[index]?.price}
            />
          </Col>
        ))}
      </Row>
      <Row>
        {formData.registrationFee?.map((registrationFee, index) => (
          <Col lg={6} key={registrationFee.id}>
            <Row>
              <h5>{registrationFee.label}</h5>
              {registrationFee.categoryPrice?.map(
                (teamCategory, teamCategoryIndex) => (
                  <Col lg={6} key={teamCategoryIndex}>
                    <CurrencyInput
                      disabled={formData.isFlatRegistrationFee}
                      horizontal
                      label={teamCategory.label}
                      name={`registrationFee.${index}.categoryPrice.${teamCategoryIndex}.price`}
                      onChange={handleChange}
                      value={
                        formData.registrationFee?.[index]?.categoryPrice?.[
                          teamCategoryIndex
                        ]?.price
                      }
                    />
                  </Col>
                )
              )}
            </Row>
          </Col>
        ))}
      </Row>
    </>
  );
};
