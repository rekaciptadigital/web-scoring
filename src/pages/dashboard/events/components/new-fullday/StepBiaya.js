import * as React from "react";
import { eventCategories } from "constants/index";

import Switch from "react-switch";
import { Row, Col } from "reactstrap";
import FormSheet from "../FormSheet";
import { FieldInputPrice, FieldInputDate } from "../form-fields";

const { TEAM_CATEGORIES } = eventCategories;

export function StepBiaya({ eventData, updateEventData, validationErrors }) {
  const handleRegistrationFeeChange = (value) => {
    updateEventData({ registrationFee: value });
  };

  const handleRegistrationFeeEarlyChange = (value) => {
    updateEventData({ earlyBirdRegistrationFee: value });
  };

  const handleToggleFlatFeeChange = () => {
    updateEventData({ type: "TOGGLE_FIELD", field: "isFlatRegistrationFee" });
  };

  const handleRegisterEarlyBirdDate = (value) => {
    updateEventData({ dateEarlyBird: value });
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

  const handleVarietyFeesEarlyChange = (teamCategory, value) => {
    updateEventData({
      type: "UPDATE_EARLYBIRD_REGISTRATION_FEES",
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

  const computeFeeEarlyAmountByTeamCategory = (teamCategory) => {
    const byTeamCategory = (early_bird) => early_bird.teamCategory === teamCategory;
    const feeData = eventData.earlyBirdRegistrationFees.find(byTeamCategory);
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
            errors={validationErrors?.registrationFee}
          >
            Biaya Registrasi
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputDate
            name="date-early"
            value={eventData?.dateEarlyBird || ""}
            onChange={(value) => handleRegisterEarlyBirdDate(value)}
            small={true}
          >
            Tanggal Tutup Early Bird
          </FieldInputDate>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="type-normal-early"
            value={eventData?.earlyBirdRegistrationFee || ""}
            onChange={handleRegistrationFeeEarlyChange}
            disabled={!eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird}
          >
            Early Bird
          </FieldInputPrice>
        </Col>

        <Col
          md={3}
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
      <snap>Harga Normal</snap>
        <Col md={3}>
          <FieldInputPrice
            name="normal-individual"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL)}
            onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL}`]}
          >
            Individual
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-male-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MALE)}
            onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_MALE, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_MALE}`]}
          >
            Beregu Putra
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-female-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_FEMALE)}
            onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_FEMALE, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_FEMALE}`]}
          >
            Beregu Putri
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-mixed-team"
            disabled={eventData.isFlatRegistrationFee}
            value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MIXED)}
            onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_MIXED, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_MIXED}`]}
          >
            Beregu Campuran
          </FieldInputPrice>
        </Col>
      </Row>

      <Row className="mt-3">
        <snap>Harga Early Bird</snap>
        <Col md={3}>
          <FieldInputPrice
            name="normal-individual"
            disabled={eventData.isFlatRegistrationFee || !eventData.dateEarlyBird}
            value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL)}
            onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL}`]}
          >
            Individual
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-male-team"
            disabled={eventData.isFlatRegistrationFee || !eventData.dateEarlyBird}
            value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MALE)}
            onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_MALE, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_MALE}`]}
          >
            Beregu Putra
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-female-team"
            disabled={eventData.isFlatRegistrationFee || !eventData.dateEarlyBird}
            value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_FEMALE)}
            onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_FEMALE, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_FEMALE}`]}
          >
            Beregu Putri
          </FieldInputPrice>
        </Col>

        <Col md={3}>
          <FieldInputPrice
            name="normal-mixed-team"
            disabled={eventData.isFlatRegistrationFee || !eventData.dateEarlyBird}
            value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MIXED)}
            onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_MIXED, value)}
            errors={validationErrors?.[`registrationFee-${TEAM_CATEGORIES.TEAM_MIXED}`]}
          >
            Beregu Campuran
          </FieldInputPrice>
        </Col>
      </Row>
    </FormSheet>
  );
}
