import * as React from "react";

import { Row, Col } from "reactstrap";
import FormSheet from "../FormSheet";
import { FieldInputPrice } from "../form-fields";

export function Step2() {
  return (
    <FormSheet>
      <Row>
        <Col md={3}>
          <FieldInputPrice name="type-normal">Normal</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="type-early-bird">Early Bird</FieldInputPrice>
        </Col>
      </Row>

      <h5 className="mt-4">Kategori regu yang dipertandingkan</h5>

      <h5 className="mt-3">Normal</h5>

      <Row>
        <Col md={3}>
          <FieldInputPrice name="normal-individual">Individual</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-mix-team">Mix Team</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-male-team">Male Team</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-female-team">Female Team</FieldInputPrice>
        </Col>
      </Row>

      <h5 className="mt-3">Early Bird</h5>

      <Row>
        <Col md={3}>
          <FieldInputPrice name="early-bird-individual">Individual</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="early-bird-mix-team">Mix Team</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="early-bird-male-team">Male Team</FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="early-bird-female-team">Female Team</FieldInputPrice>
        </Col>
      </Row>
    </FormSheet>
  );
}
