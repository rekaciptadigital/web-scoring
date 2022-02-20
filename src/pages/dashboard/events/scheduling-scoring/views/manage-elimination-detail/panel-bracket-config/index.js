import * as React from "react";
import styled from "styled-components";

import Switch from "react-switch";
import { ButtonBlue } from "components/ma";
import { FieldInputDateSmall, FieldInputTextSmall, FieldSelectBudRest } from "../../components/";

function PanelBracketConfig() {
  return (
    <BracketConfigPanel>
      <SpacedBoxesStacked>
        <div>
          <h6>Bantalan</h6>

          <SpacedBoxesLined>
            <FieldInputTextSmall>Mulai</FieldInputTextSmall>
            <FieldInputTextSmall>Akhir</FieldInputTextSmall>
            <FieldSelectBudRest placeholder="Target face">Target Face</FieldSelectBudRest>
          </SpacedBoxesLined>
        </div>

        <div>
          <h6>Sesi</h6>

          <SpacedBoxesStacked>
            <FieldToggleVariant>Jam beda tiap sesi</FieldToggleVariant>

            <FieldInputDateSmall placeholder="Atur jam" value={null}>
              Sesi
            </FieldInputDateSmall>
          </SpacedBoxesStacked>
        </div>
      </SpacedBoxesStacked>

      <div>
        <ButtonBlueBlock>Simpan</ButtonBlueBlock>
      </div>
    </BracketConfigPanel>
  );
}

function FieldToggleVariant({ children }) {
  return (
    <StyledFieldToggleVariant>
      <span>{children}</span>
      <Switch
        checked={false}
        onChange={() => {}}
        offColor="#eeeeee"
        onColor="#B4C6E2"
        onHandleColor="#0d47a1"
        height={16}
        width={36}
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      />
    </StyledFieldToggleVariant>
  );
}

const SpacedBoxesLined = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1 0 0%;
  }
`;

const BracketConfigPanel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  > * > * > *:first-child {
    font-weight: 600;
  }
`;

const StyledFieldToggleVariant = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  text-align: right;
`;

const ButtonBlueBlock = styled(ButtonBlue)`
  width: 100%;
`;

const SpacedBoxesStacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1 0 0%;
  }
`;

export { PanelBracketConfig };
