import React from "react";
import { selectConstants } from "constants/index";

import { Col, Row } from "reactstrap";
import {
  CheckboxInput,
  CheckboxWithCurrencyInput,
  CurrencyInput,
  // SwitchInput,
} from "components";

export const EventFormStep2 = ({ onFormFieldChange, formData }) => {
  const handleChange = ({ key, value }) => {
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <>
      <Row>
        <Col lg={12}>
          <CheckboxWithCurrencyInput
            inline
            label="Biaya Registrasi Pertandingan yang Tersedia"
            name="registrationFees"
            onChange={handleChange}
            options={selectConstants.eventAvailableRegistrationFee}
            value={formData.registrationFees}
            textInputName="price"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Kategori Regu yang Dipertandingkan"
            name="teamCategories"
            onChange={handleChange}
            options={selectConstants.teamCategories}
            inline
            value={formData.teamCategories}
          />
        </Col>
      </Row>
      {/* <Row>
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
      </Row> */}
      {/* {formData.isFlatRegistrationFee && ( */}
      <Row>
        {formData.registrationFees?.map((registrationFee, index) => (
          <Col lg={6} key={registrationFee.id}>
            <Row>
              <h5>{registrationFee.label}</h5>
              {registrationFee.categoryPrices?.map((categoryPrice, categoryPriceIndex) => (
                <Col lg={6} key={categoryPriceIndex}>
                  <CurrencyInput
                    // disabled={formData.isFlatRegistrationFee}
                    horizontal
                    label={categoryPrice.label}
                    name={`registrationFees.${index}.categoryPrices.${categoryPriceIndex}.price`}
                    onChange={handleChange}
                    value={categoryPrice.price}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        ))}
      </Row>
    </>
  );
};
