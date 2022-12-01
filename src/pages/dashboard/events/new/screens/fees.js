import * as React from "react";
import styled from "styled-components";

import Switch from "react-switch";
import { FieldInputPrice, FieldInputDate, Checkbox } from "../../components/form-fields";

function ScreenFees({ form }) {
  let fee = false;
  const {
    data,
    updateField,
    toggleEarlyBird,
    toggleFeeIsFlat,
    updateRegistrationFee,
    updateEarlyBirdFee,
  } = form;
  return (
    <div>
      <CardSheet>
        <VerticalSpaceBetween>
          {/* nyalakan biaya payment gateway */}
          {fee ? <FieldToggleTeamPrices>
            <div>Bebankan biaya payment gateway pada peserta</div>
            <ToggleSwitch
              checked={data?.includePaymentGatewayFeeToUser}
              onChange={(val) => {updateField("includePaymentGatewayFeeToUser",val ? 1 : 0)}}
            />
          </FieldToggleTeamPrices> : null}
          <FourColumnsInputsGrid>
            <FieldInputPrice
              name="type-normal"
              disabled={!data?.isFlatFee}
              value={data?.registrationFee || ""}
              onChange={updateRegistrationFee}
            >
              Biaya Registrasi
            </FieldInputPrice>
          </FourColumnsInputsGrid>

          <EarlyBirdActivationBar>
            <div>Aktifkan biaya early bird</div>
            <ToggleSwitch
              disabled={!data?.registrationFee}
              checked={data?.isEarlyBird}
              onChange={toggleEarlyBird}
            />
          </EarlyBirdActivationBar>

          <FourColumnsInputsGrid>
            <FieldInputPrice
              name="type-normal-early"
              disabled={!data?.isEarlyBird || (data?.isEarlyBird && !data?.isFlatFee)}
              value={data?.earlyBirdFee || ""}
              onChange={updateEarlyBirdFee}
            >
              Early Bird
            </FieldInputPrice>

            <FieldInputDate
              small
              disabled={!data?.isEarlyBird}
              name="date-early"
              value={data?.earlyBirdEndDate || ""}
              onChange={(value) => updateField("earlyBirdEndDate", value)}
            >
              Berlaku Hingga Tanggal
            </FieldInputDate>
          </FourColumnsInputsGrid>

          <FieldToggleTeamPrices>
            <div>Harga jenis regu berbeda</div>
            <ToggleSwitch
              disabled={!data?.registrationFee}
              checked={!data?.isFlatFee}
              onChange={toggleFeeIsFlat}
            />
          </FieldToggleTeamPrices>

          {Boolean(data) &&
            (!data.registrationFee ? (
              <FreeEventTeamFees form={form} />
            ) : (
              <PaidEventTeamFees form={form} />
            ))}
        </VerticalSpaceBetween>
      </CardSheet>
    </div>
  );
}

function FreeEventTeamFees({ form }) {
  const { data, getTeamLabel, updateTeamFee, activateTeamFee, updateTeamEarlyBirdFee } = form;
  return (
    <React.Fragment>
      <div>
        <h6 className="fw-bold">Normal</h6>
        <TeamFeeInputsGrid>
          {data?.feesByTeam.map((feeItem) => (
            <div key={feeItem.team}>
              <Checkbox
                checked={feeItem.isActive}
                onChange={() => activateTeamFee("normal", feeItem.team)}
              />
              <FieldInputPrice
                name={`normal-${feeItem.team}`}
                disabled
                value={feeItem.amount}
                onChange={(value) => updateTeamFee(feeItem.team, value)}
              >
                {getTeamLabel(feeItem.team)}
              </FieldInputPrice>
            </div>
          ))}
        </TeamFeeInputsGrid>
      </div>

      <div>
        <h6 className="fw-bold">Early Bird</h6>
        <TeamFeeInputsGrid>
          {data?.earlyBirdByTeam.map((feeItem) => (
            <div key={feeItem.team}>
              <Checkbox
                disabled
                checked={feeItem.isActive}
                onChange={() => activateTeamFee("earlyBird", feeItem.team)}
              />
              <FieldInputPrice
                name={`early-bird-${feeItem.team}`}
                disabled
                value={feeItem.amount}
                onChange={(value) => updateTeamEarlyBirdFee(feeItem.team, value)}
              >
                {getTeamLabel(feeItem.team)}
              </FieldInputPrice>
            </div>
          ))}
        </TeamFeeInputsGrid>
      </div>
    </React.Fragment>
  );
}

function PaidEventTeamFees({ form }) {
  const { data, getTeamLabel, updateTeamFee, activateTeamFee, updateTeamEarlyBirdFee } = form;
  return (
    <React.Fragment>
      <div>
        <h6 className="fw-bold">Normal</h6>
        <TeamFeeInputsGrid>
          {data?.feesByTeam.map((feeItem) => (
            <div key={feeItem.team}>
              <Checkbox
                checked={feeItem.isActive}
                onChange={() => activateTeamFee("normal", feeItem.team)}
              />
              <FieldInputPrice
                name="normal-individual"
                disabled={!(!data?.isFlatFee && feeItem.isActive)}
                value={feeItem.amount}
                onChange={(value) => updateTeamFee(feeItem.team, value)}
              >
                {getTeamLabel(feeItem.team)}
              </FieldInputPrice>
            </div>
          ))}
        </TeamFeeInputsGrid>
      </div>

      <div>
        <h6 className="fw-bold">Early Bird</h6>
        <TeamFeeInputsGrid>
          {data?.earlyBirdByTeam.map((feeItem, index) => (
            <div key={feeItem.team}>
              <Checkbox
                disabled={!(data?.isEarlyBird && data?.feesByTeam[index].isActive)}
                checked={feeItem.isActive}
                onChange={() => activateTeamFee("earlyBird", feeItem.team)}
              />
              <FieldInputPrice
                name="early-bird-individual"
                disabled={
                  !(
                    data?.isEarlyBird &&
                    !data?.isFlatFee &&
                    data?.feesByTeam[index].isActive &&
                    feeItem.isActive
                  )
                }
                value={feeItem.amount}
                onChange={(value) => updateTeamEarlyBirdFee(feeItem.team, value)}
              >
                {getTeamLabel(feeItem.team)}
              </FieldInputPrice>
            </div>
          ))}
        </TeamFeeInputsGrid>
      </div>
    </React.Fragment>
  );
}

/* ============================ */

const CardSheet = styled.div`
  position: relative;
  margin-bottom: 24px;

  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpaceBetween = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const FourColumnsInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.75rem;
`;

const EarlyBirdActivationBar = styled.div`
  min-height: 3rem;
  padding: 0.5rem;
  padding-left: 1.25rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FieldToggleTeamPrices = styled.div`
  min-height: 3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const TeamFeeInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.75rem;
`;

/* ============================ */

function ToggleSwitch({ checked, onChange, disabled }) {
  const handleToggling = (event) => {
    onChange?.(event);
  };

  return (
    <Switch
      disabled={disabled}
      checked={Boolean(checked)}
      onChange={handleToggling}
      offColor="#eeeeee"
      onColor="#B4C6E2"
      onHandleColor="#0d47a1"
      height={16}
      width={40}
      handleDiameter={24}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
    />
  );
}

export { ScreenFees };
