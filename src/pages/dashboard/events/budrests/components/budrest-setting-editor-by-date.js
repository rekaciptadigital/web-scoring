import * as React from "react";
import styled from "styled-components";
import { useParams, useHistory, Link } from "react-router-dom";
import { useFormBudrestSettings } from "../hooks/form-budrest-settings";

import { ButtonOutlineBlue, ButtonGhostBlue } from "components/ma";
import { FieldInputDateSmall, FieldInputTextSmall } from "../../components/form-fields";
import { DisplayTextSmall } from "./display-text-small";

import { formatServerDate } from "../../new/utils/datetime";

function BudrestSettingEditorByDate({ settingsByDate }) {
  const history = useHistory();
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const {
    data: formSettings,
    updateField,
    updateFieldStart,
    updateFieldEnd,
  } = useFormBudrestSettings(settingsByDate);

  const dateString = formatServerDate(settingsByDate.date);

  return (
    <DayGroup>
      <VerticalSpacedBox>
        <SpacedHeader>
          <SpacedHeaderLeft>
            <FieldInputDateSmall label="Bertanding Tanggal" disabled value={settingsByDate.date} />
          </SpacedHeaderLeft>

          <HorizontalSpacedButtonGroups>
            {Boolean(settingsByDate.isSettingApplied) && (
              <ButtonGhostBlue as={Link} to={getDetailUrl(eventId, dateString)}>
                Ubah Bantalan Peserta
              </ButtonGhostBlue>
            )}

            {settingsByDate.isSettingApplied ? (
              <ButtonOutlineBlue disabled>Terapkan</ButtonOutlineBlue>
            ) : (
              <ButtonOutlineBlue
                onClick={() => {
                  const detailUrl = getDetailUrl(eventId, dateString);
                  history.push(detailUrl);
                }}
              >
                Terapkan
              </ButtonOutlineBlue>
            )}
          </HorizontalSpacedButtonGroups>
        </SpacedHeader>

        <DetailList>
          <VerticalSpacedBox>
            {formSettings.map((setting) => (
              <DetailItem key={setting.key}>
                <DetailInput>
                  <div title={setting.categoryDetailLabel}>
                    <DisplayTextSmall label="Kategori" displayValue={setting.categoryDetailLabel} />
                  </div>

                  <BudrestInputGroup>
                    <FieldInputTextSmall
                      placeholder="0"
                      disabled={settingsByDate.isSettingApplied}
                      value={setting.start}
                      onChange={(ev) => updateFieldStart(setting.key, ev.target.value)}
                    >
                      Awal Bantalan
                    </FieldInputTextSmall>

                    <FieldInputTextSmall
                      placeholder="0"
                      disabled={settingsByDate.isSettingApplied}
                      value={setting.end}
                      onChange={(ev) => updateFieldEnd(setting.key, ev.target.value)}
                    >
                      Akhir Bantalan
                    </FieldInputTextSmall>

                    <FieldInputTextSmall
                      placeholder="0"
                      disabled={settingsByDate.isSettingApplied}
                      value={setting.targetFace}
                      onChange={(ev) => updateField(setting.key, "targetFace", ev.target.value)}
                    >
                      Target Face
                    </FieldInputTextSmall>

                    <DisplayTextSmall noBorder displayValue={setting.totalParticipant}>
                      Total Peserta
                    </DisplayTextSmall>
                  </BudrestInputGroup>
                </DetailInput>
              </DetailItem>
            ))}
          </VerticalSpacedBox>
        </DetailList>
      </VerticalSpacedBox>
    </DayGroup>
  );
}

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const DayGroup = styled.div`
  padding: 1rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;
`;

const SpacedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const SpacedHeaderLeft = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    max-width: 10rem;
    flex: 1;
  }
`;

const HorizontalSpacedButtonGroups = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const DetailList = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.25rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const DetailInput = styled.div`
  display: flex;
  gap: 1rem;

  > *:nth-child(1) {
    max-width: 20rem;
    flex: 1;
  }

  > *:nth-child(2) {
    width: 0;
    flex: 1;
  }
`;

const BudrestInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > * {
    max-width: 6.375rem;
    flex: 1;
  }
`;

/* ===================================== */
// utils

function getDetailUrl(eventId, dateString) {
  if (!eventId) {
    return "#";
  }
  if (!dateString) {
    return `/dashboard/event/${eventId}/budrests/detail`;
  }
  return `/dashboard/event/${eventId}/budrests/detail?date=${dateString}`;
}

export { BudrestSettingEditorByDate };
