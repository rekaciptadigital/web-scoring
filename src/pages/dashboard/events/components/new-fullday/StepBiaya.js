import * as React from "react";
import Switch from "react-switch";

import { Row, Col } from "reactstrap";
import FormSheet from "../FormSheet";
import { FieldInputPrice } from "../form-fields";

export function StepBiaya() {
  const [variativePricesToggle, setVariativePricesToggle] = React.useState(false);
  return (
    <FormSheet>
      <Row>
        <Col md={3}>
          <FieldInputPrice name="type-normal">Biaya Registrasi</FieldInputPrice>
        </Col>

        <Col
          md={4}
          className="d-flex align-items-center"
          style={{ gap: "1rem", fontSize: 12, paddingTop: 24 }}
        >
          <div>Harga jenis regu berbeda</div>
          <div>
            <Switch
              checked={variativePricesToggle}
              onChange={(next) => setVariativePricesToggle(next)}
              offColor="#eeeeee"
              onColor="#B4C6E2"
              onHandleColor="#0d47a1"
              height={20}
              width={48}
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            />
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={3}>
          <FieldInputPrice name="normal-individual" disabled={!variativePricesToggle}>
            Individual
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-male-team" disabled={!variativePricesToggle}>
            Male Team
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-female-team" disabled={!variativePricesToggle}>
            Female Team
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice name="normal-mixed-team" disabled={!variativePricesToggle}>
            Mixed Team
          </FieldInputPrice>
        </Col>
      </Row>
    </FormSheet>
  );
}
