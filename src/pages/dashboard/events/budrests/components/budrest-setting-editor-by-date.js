import * as React from "react";
import styled from "styled-components";
import { useParams, useHistory, Link } from "react-router-dom";
import { useFormBudrestSettings } from "../hooks/form-budrest-settings";
import { useSubmitBudrestSettings } from "../hooks/submit-budrest-settings";

import { ButtonBlue, ButtonOutlineBlue, AlertSubmitError } from "components/ma";
import { LoadingScreen } from "../../new/components/loading-screen-portal";
import { FieldInputDateSmall, FieldInputTextSmall } from "../../components/form-fields";
import { DisplayTextSmall } from "./display-text-small";
import { ButtonConfirmPrompt } from "./button-confirm-prompt";

import { formatServerDate } from "../../new/utils/datetime";

function BudrestSettingEditorByDate({ settingsByDate }) {
  const history = useHistory();
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const {
    data: formSettings,
    updateFieldStart,
    updateFieldEnd,
    updateFieldTargetFace,
  } = useFormBudrestSettings(settingsByDate);

  const dateString = formatServerDate(settingsByDate.date);

  const {
    submit,
    isLoading: isSubmiting,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitBudrestSettings(formSettings, eventId);

  return (
    <React.Fragment>
      <LoadingScreen loading={isSubmiting} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />

      <DayGroup>
        <VerticalSpacedBox>
          <SpacedHeader>
            <SpacedHeaderLeft>
              <FieldInputDateSmall
                label="Bertanding Tanggal"
                disabled
                value={settingsByDate.date}
              />
            </SpacedHeaderLeft>

            <HorizontalSpacedButtonGroups>
              {Boolean(settingsByDate.isSettingApplied) && (
                <ButtonOutlineBlue as={Link} to={getDetailUrl(eventId, dateString)}>
                  Ubah Bantalan Peserta
                </ButtonOutlineBlue>
              )}

              <ButtonConfirmPrompt
                customButton={ButtonBlue}
                onConfirm={() => {
                  submit({
                    onSuccess() {
                      const detailUrl = getDetailUrl(eventId, dateString);
                      history.push(detailUrl);
                    },
                  });
                }}
                messagePrompt="Sudah Yakin dengan Pengaturan Bantalan?"
                messageDescription={
                  <React.Fragment>
                    Anda akan melakukan generate bantalan ke peserta.
                    <br />
                    Bantalan masih dapat diubah sebelum pertandingan dimulai.
                  </React.Fragment>
                }
                buttonCancelLabel="Cek Lagi"
                buttonConfirmLabel="Masukkan Bantalan ke Peserta"
              >
                Terapkan
              </ButtonConfirmPrompt>
            </HorizontalSpacedButtonGroups>
          </SpacedHeader>

          <DetailList>
            <VerticalSpacedBox>
              {formSettings.map((setting) => (
                <DetailItem key={setting.key}>
                  <DetailInput>
                    <div title={setting.categoryDetailLabel}>
                      <DisplayTextSmall
                        label="Kategori"
                        displayValue={setting.categoryDetailLabel}
                      />
                    </div>

                    <BudrestInputGroup>
                      {setting.totalParticipant ? (
                        <React.Fragment>
                          <FieldInputTextSmall
                            placeholder="0"
                            disabled={!setting.totalParticipant}
                            value={setting.start}
                            onChange={(ev) => updateFieldStart(setting.key, ev.target.value)}
                          >
                            Awal Bantalan
                          </FieldInputTextSmall>

                          <FieldInputTextSmall
                            placeholder="0"
                            disabled={!setting.totalParticipant}
                            value={setting.end}
                            onChange={(ev) => updateFieldEnd(setting.key, ev.target.value)}
                          >
                            Akhir Bantalan
                          </FieldInputTextSmall>

                          <FieldInputTextSmall
                            placeholder="0"
                            disabled={!setting.totalParticipant}
                            value={setting.targetFace}
                            onChange={(ev) => {
                              updateFieldTargetFace(setting.key, ev.target.value);
                            }}
                          >
                            Target Face
                          </FieldInputTextSmall>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <DisplayTextSmall
                            label="Awal Bantalan"
                            displayValue={<React.Fragment>&ndash;</React.Fragment>}
                          />

                          <DisplayTextSmall
                            label="Akhir Bantalan"
                            displayValue={<React.Fragment>&ndash;</React.Fragment>}
                          />

                          <DisplayTextSmall
                            label="Target Face"
                            displayValue={<React.Fragment>&ndash;</React.Fragment>}
                          />
                        </React.Fragment>
                      )}

                      <DisplayTextSmall
                        noBorder
                        displayValue={
                          setting.totalParticipant || (
                            <React.Fragment>Tidak ada peserta</React.Fragment>
                          )
                        }
                      >
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
    </React.Fragment>
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

    &:last-child {
      max-width: max-content;
    }
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
