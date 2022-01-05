import * as React from "react";
import Switch from "react-switch";

import { Row, Col } from "reactstrap";
import FormSheet from "../FormSheet";
import { FieldInputPrice } from "../form-fields";

export function StepBiaya({ eventData, updateEventData }) {
  const handleRegistrationFeeChange = (value) => {
    updateEventData({ registrationFee: value });
  };

  const handleToggleFlatFeeChange = () => {
    updateEventData({ type: "TOGGLE_FIELD", field: "isFlatRegistrationFee" });
  };

  const handleVarietyFeesChange = (teamCategory, value) => {
    updateEventData({
      type: "UPDATE_REGISTRATION_FEES",
      value: {
        teamCategory,
        amount: value,
      },
    });
  };

  const computeFeeAmountByTeamCategory = (teamCategory) => {
    const byTeamCategory = (fee) => fee.teamCategory === teamCategory;
    const feeData = eventData.registrationFees.find(byTeamCategory);
    return feeData?.amount || "";
  };

  return (
    <FormSheet>
      <Row>
        <Col md={3}>
          <FieldInputPrice
            name="type-normal"
            value={eventData?.registrationFee || ""}
            onChange={handleRegistrationFeeChange}
            disabled={!eventData.isFlatRegistrationFee}
          >
            Biaya Registrasi
          </FieldInputPrice>
        </Col>

        <Col
          md={4}
          className="d-flex align-items-center"
          style={{ gap: "1rem", fontSize: 12, paddingTop: 24 }}
        >
          <div>Harga jenis regu berbeda</div>
          <div>
            <Switch
              checked={!eventData.isFlatRegistrationFee}
              onChange={handleToggleFlatFeeChange}
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
          <FieldInputPrice
            name="normal-individual"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory("individual")}
            onChange={(value) => handleVarietyFeesChange("individual", value)}
          >
            Individual
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-male-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory("maleTeam")}
            onChange={(value) => handleVarietyFeesChange("maleTeam", value)}
          >
            Male Team
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-female-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory("femaleTeam")}
            onChange={(value) => handleVarietyFeesChange("femaleTeam", value)}
          >
            Female Team
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-mixed-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory("mixedTeam")}
            onChange={(value) => handleVarietyFeesChange("mixedTeam", value)}
          >
            Mixed Team
          </FieldInputPrice>
        </Col>
      </Row>
    </FormSheet>
  );
}
