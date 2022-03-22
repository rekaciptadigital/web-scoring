import * as React from "react";
import { eventCategories } from "constants/index";

import Switch from "react-switch";
import { Row, Col } from "reactstrap";
import { LoadingScreen } from "components";
import FormSheet from "../FormSheet";
import { FieldInputPrice, FieldInputDate } from "../form-fields";

const { TEAM_CATEGORIES } = eventCategories;

export function StepBiaya({
  editIsAllowed,
  savingStatus,
  eventData,
  updateEventData,
  validationErrors = {},
  isFormDirty,
  setFormDirty,
}) {
  const isLoading = savingStatus.status === "loading";

  const handleRegistrationFeeChange = (value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({ registrationFee: value });
  };

  const handleRegistrationFeeEarlyChange = (value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({ earlyBirdRegistrationFee: value });
  };

  const handleRegisterEarlyBirdDate = (value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({ dateEarlyBird: value });
  };

  const handleToggleFlatFeeChange = () => {
    !isFormDirty && setFormDirty(true);
    updateEventData({ type: "TOGGLE_FIELD", field: "isFlatRegistrationFee" });
  };

  const handleVarietyFeesChange = (teamCategory, value) => {
    !isFormDirty && setFormDirty(true);
    updateEventData({
      type: "UPDATE_REGISTRATION_FEES",
      value: {
        teamCategory,
        amount: value,
      },
    });
  };

  const handleVarietyFeesEarlyChange = (teamCategory, value) => {
    !isFormDirty && setFormDirty(true);
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
            disabled={!editIsAllowed || !eventData.isFlatRegistrationFee}
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
            disabled={
              !editIsAllowed || !eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
            }
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
              disabled={!editIsAllowed}
            />
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <snap>Harga Normal</snap>
        {eventData?.registrationFeesID[TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-individual"
              disabled={!editIsAllowed || eventData.isFlatRegistrationFee}
              value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE)}
              onChange={(value) =>
                handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE, value)
              }
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE}`]}
            >
              Individual Putra
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.registrationFeesID[TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-individual"
              disabled={!editIsAllowed || eventData.isFlatRegistrationFee}
              value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE)}
              onChange={(value) =>
                handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE, value)
              }
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE}`]}
            >
              Individual Putri
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.registrationFeesID[TEAM_CATEGORIES.TEAM_MALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-male-team"
              disabled={!editIsAllowed || eventData.isFlatRegistrationFee}
              value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MALE)}
              onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_MALE, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_MALE}`]}
            >
              Beregu Putra
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.registrationFeesID[TEAM_CATEGORIES.TEAM_FEMALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-female-team"
              disabled={!editIsAllowed || eventData.isFlatRegistrationFee}
              value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_FEMALE)}
              onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_FEMALE, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_FEMALE}`]}
            >
              Beregu Putri
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.registrationFeesID[TEAM_CATEGORIES.TEAM_MIXED] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-mixed-team"
              disabled={!editIsAllowed || eventData.isFlatRegistrationFee}
              value={computeFeeAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MIXED)}
              onChange={(value) => handleVarietyFeesChange(TEAM_CATEGORIES.TEAM_MIXED, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_MIXED}`]}
            >
              Beregu Campuran
            </FieldInputPrice>
          </Col>
        ) : null}
      </Row>

      <Row className="mt-3">
        <snap>Harga Early Bird</snap>
        {eventData?.earlyRegistrationFeesID[TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-individual"
              disabled={
                !editIsAllowed || eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
              }
              value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE)}
              onChange={(value) =>
                handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE, value)
              }
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL_MALE}`]}
            >
              Individual Putra
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.earlyRegistrationFeesID[TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-individual"
              disabled={
                !editIsAllowed || eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
              }
              value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE)}
              onChange={(value) =>
                handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE, value)
              }
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_INDIVIDUAL_FEMALE}`]}
            >
              Individual Putri
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.earlyRegistrationFeesID[TEAM_CATEGORIES.TEAM_MALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-male-team"
              disabled={
                !editIsAllowed || eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
              }
              value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MALE)}
              onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_MALE, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_MALE}`]}
            >
              Beregu Putra
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.earlyRegistrationFeesID[TEAM_CATEGORIES.TEAM_FEMALE] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-female-team"
              disabled={
                !editIsAllowed || eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
              }
              value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_FEMALE)}
              onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_FEMALE, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_FEMALE}`]}
            >
              Beregu Putri
            </FieldInputPrice>
          </Col>
        ) : null}
        {eventData?.earlyRegistrationFeesID[TEAM_CATEGORIES.TEAM_MIXED] ? (
          <Col md={3}>
            <FieldInputPrice
              name="normal-mixed-team"
              disabled={
                !editIsAllowed || eventData.isFlatRegistrationFee || !eventData?.dateEarlyBird
              }
              value={computeFeeEarlyAmountByTeamCategory(TEAM_CATEGORIES.TEAM_MIXED)}
              onChange={(value) => handleVarietyFeesEarlyChange(TEAM_CATEGORIES.TEAM_MIXED, value)}
              errors={validationErrors[`registrationFee-${TEAM_CATEGORIES.TEAM_MIXED}`]}
            >
              Beregu Campuran
            </FieldInputPrice>
          </Col>
        ) : null}
      </Row>

      <LoadingScreen loading={isLoading} />
    </FormSheet>
  );
}
