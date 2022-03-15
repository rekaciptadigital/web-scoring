import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";
import { useEventBudRests, useBudRestsForm } from "./hooks/bud-rests";
import { BudRestService } from "services";

import { LoadingScreen } from "components";
import { ButtonOutlineBlue } from "components/ma";
import {
  FieldInputTextSmall,
  FieldSelectBudRest,
  FolderPanel,
  NoticeBarInfo,
  AlertSubmitError,
} from "../../components";

import IconAlertCircle from "components/ma/icons/mono/alert-circle";

import { FolderHeader, FolderHeaderActions } from "./styles";

import { parseISO, format } from "date-fns";
import id from "date-fns/locale/id";
import { errorsUtil } from "utils";
import { shouldDisableEditing } from "./utils";

function TabBudRest() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);
  const {
    data: eventBudRests,
    groupNames,
    refetch: refetchEventBudRests,
  } = useEventBudRests(eventId);
  const { data: form, errors: formErrors, dispatch: dispatchForm } = useBudRestsForm(eventBudRests);
  const {
    isSubmitLoading,
    errors: submitErrors,
    isSubmitError,
    setSubmitLoading,
    setSubmitSuccess,
    setSubmitError,
  } = useSubmitStatus();

  // sementara buka set bantalan di waktu kapanpun sebelum tanggal kualifikasi
  const shouldAllowEdit = !shouldDisableEditing(eventDetail?.publicInformation.eventEnd);

  const shouldShowGroupErrorMessages = (groupName) =>
    formErrors?.[groupName] && Object.keys(formErrors[groupName])?.length;

  const handleClickSaveGroup = async ({ group }) => {
    // validate inputs
    const validationErrors = {};
    iterateGroupData(
      form[group],
      ({ start, end, targetFace, totalParticipants, isEditAllowed }, categoryDetailId) => {
        // skip
        if (!isEditAllowed) {
          return;
        }

        // 1. Validasi nomor bantalan yang sama
        // cek item sekarang dengan item-item lain di kelompok kategori
        iterateGroupData(form[group], (checkBudRest, checkId) => {
          // skip cek dengan dirinya sendiri
          if (categoryDetailId === checkId) {
            return;
          }

          const isStartNumberSame = start === checkBudRest.start;

          if (isStartNumberSame) {
            if (!validationErrors[group]) {
              validationErrors[group] = {};
            }
            const notIdenticalMessage = "Mulai & akhir antar detail kategori tidak boleh sama";
            validationErrors[group][`${group}-${categoryDetailId}-start`] = [notIdenticalMessage];
            validationErrors[group][`${group}-${categoryDetailId}-end`] = [notIdenticalMessage];
            const previousMessages = validationErrors[group].messages;
            if (
              Array.isArray(previousMessages) &&
              !previousMessages.some((message) => message === notIdenticalMessage)
            ) {
              previousMessages.push(notIdenticalMessage);
            }
            validationErrors[group].messages = previousMessages || [notIdenticalMessage];
          }
        });

        // 2. Validasi jumlah bantalan yang diset
        const referenceRange = totalParticipants / targetFace.value;
        const inputRange = end - start + 1;
        const isInsufficient = inputRange < referenceRange;

        if (isInsufficient) {
          if (!validationErrors[group]) {
            validationErrors[group] = {};
          }
          const insufficientMessage = "Jumlah bantalan kurang";
          validationErrors[group][`${group}-${categoryDetailId}-start`] = [insufficientMessage];
          validationErrors[group][`${group}-${categoryDetailId}-end`] = [insufficientMessage];
          const previousMessages = validationErrors[group].messages;
          if (
            Array.isArray(previousMessages) &&
            !previousMessages.some((message) => message === insufficientMessage)
          ) {
            previousMessages.push(insufficientMessage);
          }
          validationErrors[group].messages = previousMessages || [insufficientMessage];
        }
      }
    );

    // TODO: open validasi kalau sudah...
    // dispatchForm({ type: "INVALID", errors: validationErrors });
    // const isValid = !(validationErrors?.[group] && Object.keys(validationErrors?.[group])?.length);
    // if (!isValid) {
    //   return;
    // }

    setSubmitLoading();
    const payload = makeSaveGroupPayload(form[group]);
    const result = await BudRestService.setByEventId(payload, { event_id: eventId });
    if (result.success) {
      setSubmitSuccess();
      refetchEventBudRests();
    } else {
      const errors = errorsUtil.interpretServerErrors(result);
      setSubmitError(errors);
    }
  };

  return (
    <React.Fragment>
      <FolderPanel>
        <FolderHeader>
          <div>
            <h3>Atur Bantalan Kualifikasi</h3>
            <div>Pengaturan bantalan pada kualifikasi pertandingan</div>
          </div>

          <FolderHeaderActions></FolderHeaderActions>
        </FolderHeader>

        {shouldAllowEdit ? (
          <NoticeBarInfo>
            Bantalan hanya bisa diubah sebelum tanggal kualifikasi masing-masing kategori
          </NoticeBarInfo>
        ) : (
          <NoticeBarInfo>Pengaturan aktif apabila pendaftaran lomba telah ditutup</NoticeBarInfo>
        )}
      </FolderPanel>

      <FolderPanel style={{ paddingTop: 3 }}>
        <CategoryGroupsList>
          {Boolean(groupNames?.length) &&
            groupNames.map((groupName) => {
              const shouldDisableAllInputs = () => {
                const reducerForAllEditsNotAllowed = (state, category) => {
                  const budRest = form[groupName][category.categoryDetailId];
                  return state && !budRest.isEditAllowed;
                };
                return eventBudRests && form
                  ? eventBudRests[groupName].reduce(reducerForAllEditsNotAllowed, true)
                  : false;
              };

              const allInputsDisabled = shouldDisableAllInputs();

              return (
                <CategoryGroup key={groupName}>
                  <GroupHeader>
                    <HeaderTitle>
                      <div>Kategori</div>
                      <h4>{groupName}</h4>
                    </HeaderTitle>

                    <HeaderMiddleControl>
                      <FieldTargetFace>
                        <FieldSelectBudRest
                          disabled={!shouldAllowEdit || allInputsDisabled}
                          value={form?.[groupName]?.common.targetFace}
                          onChange={(option) => {
                            dispatchForm({
                              type: "CHANGE_COMMON",
                              groupName,
                              payload: option,
                            });
                          }}
                        >
                          Target Face
                        </FieldSelectBudRest>
                      </FieldTargetFace>
                    </HeaderMiddleControl>

                    <HeaderActions>
                      {shouldAllowEdit && (
                        <ButtonOutlineBlue
                          disabled={allInputsDisabled}
                          onClick={() => handleClickSaveGroup({ group: groupName })}
                        >
                          Simpan
                        </ButtonOutlineBlue>
                      )}
                    </HeaderActions>
                  </GroupHeader>

                  {shouldShowGroupErrorMessages(groupName) && (
                    <ErrorMessagesBar>
                      {formErrors[groupName].messages.map((message, index) => (
                        <ValidationMessagePill key={index}>
                          <span>
                            <IconAlertCircle size="20" />
                          </span>
                          <span>{message}</span>
                        </ValidationMessagePill>
                      ))}
                    </ErrorMessagesBar>
                  )}

                  <table className="table table-responsive">
                    <thead>
                      <tr>
                        <THCateg>Kelas</THCateg>
                        <THCateg>Jenis Regu</THCateg>
                        <THCateg>Jarak</THCateg>
                        <THCateg>Peserta</THCateg>
                        <THCateg>Tanggal Kualifikasi</THCateg>
                        <THCateg>Mulai</THCateg>
                        <THCateg>Akhir</THCateg>
                        <THCateg>Target Face</THCateg>
                      </tr>
                    </thead>

                    <tbody>
                      {eventBudRests[groupName]?.map((detail) => {
                        const budRest = form?.[groupName][detail.categoryDetailId] || {};
                        return (
                          <tr key={detail.categoryDetailId}>
                            <TDCateg>{detail.age}</TDCateg>
                            <TDCateg>{detail.team}</TDCateg>
                            <TDCateg>{detail.distance}</TDCateg>
                            <TDCateg>{detail.totalParticipants}</TDCateg>
                            <TDCateg>
                              {format(parseISO(detail.qualificationTimeStart), "dd MMMM yyyy", {
                                locale: id,
                              })}
                            </TDCateg>

                            <TDInput>
                              <FieldInputTextSmall
                                placeholder="No. bantalan"
                                disabled={!shouldAllowEdit || !budRest.isEditAllowed}
                                value={
                                  shouldAllowEdit && budRest.totalParticipants > 0
                                    ? budRest.start
                                    : "—"
                                }
                                onChange={(value) => {
                                  dispatchForm({
                                    group: groupName,
                                    categoryDetailId: detail.categoryDetailId,
                                    payload: { start: value },
                                  });
                                }}
                                errors={
                                  formErrors?.[groupName]?.[
                                    `${groupName}-${detail.categoryDetailId}-start`
                                  ]
                                }
                              />
                            </TDInput>

                            <TDInput>
                              <FieldInputTextSmall
                                placeholder="No. bantalan"
                                disabled={!shouldAllowEdit || !budRest.isEditAllowed}
                                value={
                                  shouldAllowEdit && budRest.totalParticipants > 0
                                    ? budRest.end
                                    : "—"
                                }
                                onChange={(value) => {
                                  dispatchForm({
                                    group: groupName,
                                    categoryDetailId: detail.categoryDetailId,
                                    payload: { end: Number(value) },
                                  });
                                }}
                                errors={
                                  formErrors?.[groupName]?.[
                                    `${groupName}-${detail.categoryDetailId}-end`
                                  ]
                                }
                              />
                            </TDInput>

                            <TDInput>
                              <FieldSelectBudRest
                                disabled={!shouldAllowEdit || !budRest.isEditAllowed}
                                value={budRest.targetFace}
                                onChange={(option) => {
                                  dispatchForm({
                                    group: groupName,
                                    categoryDetailId: detail.categoryDetailId,
                                    payload: { targetFace: option },
                                  });
                                }}
                              />
                            </TDInput>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CategoryGroup>
              );
            })}
        </CategoryGroupsList>
      </FolderPanel>

      <LoadingScreen loading={isSubmitLoading} />
      <AlertSubmitError isError={isSubmitError} errors={submitErrors} />
    </React.Fragment>
  );
}

const CategoryGroupsList = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const CategoryGroup = styled.div`
  padding: 1.25rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.5rem;
`;

const GroupHeader = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
`;

const HeaderTitle = styled.div`
  flex: 1 0 5rem;

  > * + * {
    margin-top: 0.5rem;
  }
`;

const HeaderMiddleControl = styled.div`
  flex-grow: 5;
`;

const FieldTargetFace = styled.div`
  width: 120px;
`;

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessagesBar = styled.div`
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const ValidationMessagePill = styled.span`
  display: inline-block;
  padding: 0.375rem 0.5rem;
  padding-right: 0.75rem;
  border-radius: 2rem;
  background-color: var(--ma-red);
  color: #ffffff;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const THCateg = styled.th`
  text-transform: uppercase;
`;

const TDCateg = styled.td`
  text-transform: capitalize;
`;

const TDInput = styled.td`
  width: 7.5rem;
`;

function iterateGroupData(data, callback) {
  let index = -1;
  for (const id in data) {
    index = index + 1;
    if (id === "common") {
      continue;
    }
    const item = data[id];
    callback(item, parseInt(id), index);
  }
}

const TYPE_QUALIFICATION = "qualification";

function makeSaveGroupPayload(data) {
  const budRestsData = [];
  iterateGroupData(data, (budRest, categoryDetailId) => {
    if (!budRest.isEditAllowed) {
      return;
    }
    budRestsData.push({
      type: TYPE_QUALIFICATION,
      archery_event_category_id: categoryDetailId,
      bud_rest_start: budRest.start,
      bud_rest_end: budRest.end,
      target_face: budRest.targetFace.value,
    });
  });
  return { event_category: budRestsData };
}

function useSubmitStatus() {
  const [state, dispatch] = React.useReducer((state, action) => ({ ...state, ...action }), {
    status: "idle",
    errors: null,
  });

  const { status, errors } = state;

  const isSubmitLoading = status === "loading";
  const isSubmitError = status === "error" || errors;
  const setSubmitLoading = () => dispatch({ status: "loading", errors: null });
  const setSubmitSuccess = () => dispatch({ status: "success" });
  const setSubmitError = (serverErrors) => dispatch({ status: "error", errors: serverErrors });

  return {
    ...state,
    isSubmitLoading,
    isSubmitError,
    setSubmitLoading,
    setSubmitSuccess,
    setSubmitError,
  };
}

export { TabBudRest };
