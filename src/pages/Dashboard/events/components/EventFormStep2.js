import { CheckboxInput, CurrencyInput, RadioInput } from "components";
import React from "react";
import { Col, Row } from "reactstrap";
import { selectConstants } from "../../../../constants";

export const EventFormStep2 = ({onFormFieldChange}) => {
  const handleChange = ({key, value}) => {
    console.log({key, value})
    if (onFormFieldChange) onFormFieldChange(key, value);
  };

  return (
    <>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Biaya Registrasi pertandingan yang tersedia"
            options={selectConstants.eventAvailableRegistrationFee}
            inline
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CheckboxInput
            label="Kategori regu yang dipertandingkan"
            options={selectConstants.teamCategories}
            inline
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <RadioInput
            name="isEachCategoryPriceSame"
            label="Apakah Harga setiap kategori sama?"
            options={selectConstants.confirmation}
            inline
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={3}>
          <CurrencyInput label="Early Bird" horizontal />
        </Col>
        <Col lg={3}>
          <CurrencyInput label="Normal" horizontal />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <h5>Early Bird</h5>
          <Row>
            <Col lg={6}>
              <CurrencyInput label="Individu" horizontal />
            </Col>
            <Col lg={6}>
              <CurrencyInput label="Female Team" horizontal />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CurrencyInput label="Mix Team" horizontal />
            </Col>
            <Col lg={6}>
              <CurrencyInput label="Male Team" horizontal />
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <h5>Normal</h5>
          <Row>
            <Col lg={6}>
              <CurrencyInput label="Individu" horizontal />
            </Col>
            <Col lg={6}>
              <CurrencyInput label="Female Team" horizontal />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <CurrencyInput label="Mix Team" horizontal />
            </Col>
            <Col lg={6}>
              <CurrencyInput label="Male Team" horizontal />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
