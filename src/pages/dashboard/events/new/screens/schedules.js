import * as React from "react";
import styled from "styled-components";
import { useScheduleEditorForm } from "../hooks/form-submit-editor-schedule";
import { toast } from "../components/processing-toast";

import DatePicker from "react-datepicker";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
  NoticeBarInfo,
  AlertSubmitError,
} from "components/ma";
import {
  FieldInputDateSmall,
  FieldInputTimeSmall,
  FieldSelectSmall,
} from "../../components/form-fields";
import { LoadingScreen } from "../components/loading-screen-portal";

import IconPlus from "components/ma/icons/mono/plus";
import IconArrowExchange from "components/ma/icons/mono/arrow-exchange";
import IconTrash from "components/ma/icons/mono/trash";
import illustrationAlert from "assets/images/events/alert-publication.svg";

import classnames from "classnames";
import { isSameDay } from "date-fns";
import id from "date-fns/locale/id";
import { datetime } from "utils";
import { useFormSchedules } from "../hooks/form-schedules";

// function ScreenSchedules({ eventDetail, categories, formSchedules, schedulesProvider }) {
function ScreenSchedules({
  eventDetail,
  categories,
  eventType,
  schedulesProvider,
  schedules,
}) {
  const formSchedules = useFormSchedules(schedules, {
    eventType,
    eventDetail,
    categoryDetails: categories,
  });
  const [indexActiveEditor, setIndexActiveEditor] = React.useState(-1);
  const { data } = formSchedules;

  const asOptionObject = (type) => ({
    value: type.id,
    label: type.labelCategory,
  });
  const options = categories?.map(asOptionObject) || [];

  return (
    <CardSheet>
      <VerticalSpacedBox>
        <NoticeBarInfo>
          Jadwal tidak bisa dihapus jika sudah ada peserta. Anda tetap masih
          bisa merubah jadwal meski sudah ada pendaftar.
        </NoticeBarInfo>

        <VerticalSpacedBoxLoose>
          {data?.map((sessionsByDate, index) => (
            <DayScheduleEditor
              key={sessionsByDate.key}
              keyParent={sessionsByDate.key}
              eventDetail={eventDetail}
              sessionsByDate={sessionsByDate}
              formSchedules={formSchedules}
              optionsCategories={options}
              isEditMode={index === indexActiveEditor}
              onClickEdit={() => setIndexActiveEditor(index)}
              onCloseEdit={() => setIndexActiveEditor(-1)}
              shouldAllowEdit={indexActiveEditor < 0}
              schedulesProvider={schedulesProvider}
            />
          ))}
        </VerticalSpacedBoxLoose>
      </VerticalSpacedBox>
    </CardSheet>
  );
}

function DayScheduleEditor({
  // keyParent,
  schedulesProvider,
  eventDetail,
  sessionsByDate,
  optionsCategories,
  isEditMode,
  onClickEdit,
  onCloseEdit,
  shouldAllowEdit = true,
}) {
  const isDisabled = !isEditMode;

  return (
    <DayGroup className={classnames({ "editor-active": isEditMode })}>
      <VerticalSpacedBox>
        {isEditMode ? (
          <EditorForm
            isDisabled={isDisabled}
            eventDetail={eventDetail}
            optionsCategories={optionsCategories}
            sessionsByDate={sessionsByDate}
            onCloseEdit={onCloseEdit}
            schedulesProvider={schedulesProvider}
          />
        ) : (
          <React.Fragment>
            <SpacedHeader>
              <CommonSessionInput>
                <FieldInputDateSmall
                  label="Tanggal"
                  disabled
                  value={sessionsByDate.sessionDate}
                />
              </CommonSessionInput>

              <HorizontalSpacedButtonGroups>
                <ButtonOutlineBlue
                  disabled={!shouldAllowEdit}
                  onClick={() => {
                    if (!shouldAllowEdit) return;
                    onClickEdit?.();
                  }}
                >
                  Ubah Detail
                </ButtonOutlineBlue>
              </HorizontalSpacedButtonGroups>
            </SpacedHeader>

            <EditorDisplay
              sessionsByDate={sessionsByDate}
              schedulesProvider={schedulesProvider}
            />
          </React.Fragment>
        )}
      </VerticalSpacedBox>
    </DayGroup>
  );
}

function EditorDisplay({ sessionsByDate, schedulesProvider }) {
  const { data: schedules, isLoading: isLoadingSchedule } = schedulesProvider;
  const isUpdatingEditorData = Boolean(schedules?.length) && isLoadingSchedule;

  return (
    <CategoryList>
      {isUpdatingEditorData && (
        <UpdatingStateBlocker>Memperbarui data...</UpdatingStateBlocker>
      )}
      <VerticalSpacedBox>
        {sessionsByDate.sessions.map((session) => (
          <CategoryDetailItem key={session.key}>
            <SessionDetailInput>
              <div title={session.categoryDetail?.label}>
                <FieldSelectSmall
                  label="Kategori"
                  placeholder="Pilih kategori"
                  disabled
                  options={null}
                  value={session.categoryDetail}
                />
              </div>

              <div>
                <TimeRangeLabel>Jam Kualifikasi</TimeRangeLabel>
                <TimeRangeBox>
                  <FieldInputTimeSmall
                    disabled
                    value={session.eventStartDatetime}
                  />
                  <span>&ndash;</span>
                  <FieldInputTimeSmall
                    disabled
                    value={session.eventEndDatetime}
                  />
                </TimeRangeBox>
              </div>
            </SessionDetailInput>

            <HorizontalSpacedButtonGroups>
              <Button flexible disabled title="Tambah jadwal">
                <IconPlus size="13" />
              </Button>

              <ScheduleDatePicker disabled title="Ubah jadwal" />

              <Button flexible disabled title="Hapus jadwal">
                <IconTrash size="13" />
              </Button>
            </HorizontalSpacedButtonGroups>
          </CategoryDetailItem>
        ))}
      </VerticalSpacedBox>
    </CategoryList>
  );
}

function EditorForm({
  isDisabled,
  eventDetail,
  optionsCategories,
  sessionsByDate,
  onCloseEdit,
  schedulesProvider,
}) {
  const { data: schedulesData, fetchSchedules } = schedulesProvider;
  const {
    data: editorFormData,
    isClean,
    updateField,
    createSchedule,
    removeScheduleItem,
    submitSchedules,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useScheduleEditorForm(sessionsByDate, eventDetail?.id);

  const filteredOptionsCategories = filterUnselected(optionsCategories, {
    initialSessions: sessionsByDate.sessions,
    editorSessions: editorFormData.sessions,
    serverSessions: schedulesData,
  });
  const showOnlySessions = editorFormData?.sessions.filter(
    (session) => !session.shouldDelete
  );
  const notEmptyRows = showOnlySessions.filter((session) => {
    return !session.shouldDelete && session.categoryDetail?.value;
  });
  const maxRowCountsAllowed =
    filteredOptionsCategories.length + notEmptyRows.length;
  const isButtonAddDisabled =
    isDisabled || showOnlySessions.length >= maxRowCountsAllowed;

  const handleClickSave = () => {
    submitSchedules({
      onSuccess() {
        fetchSchedules();
        toast.success("Jadwal berhasil disimpan");
        onCloseEdit?.();
      },
    });
  };

  return (
    <React.Fragment>
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />

      <SpacedHeader>
        <CommonSessionInput>
          <FieldInputDateSmall
            label="Tanggal"
            disabled
            value={sessionsByDate.sessionDate}
          />
        </CommonSessionInput>

        <HorizontalSpacedButtonGroups>
          <ButtonWithConfirmPrompt
            customButton={ButtonOutlineBlue}
            reverseButtons
            buttonConfirmLabel="Lanjutkan"
            onConfirm={() => onCloseEdit?.()}
            buttonCancelLabel="Kembali isi data"
            messageDescription="Anda akan membatalkan data yang diubah. Lanjutkan?"
          >
            Batal
          </ButtonWithConfirmPrompt>

          <ButtonWithConfirmPrompt
            disabled={isClean}
            title={isClean ? "Data belum ada yang diubah" : undefined}
            customButton={ButtonBlue}
            buttonConfirmLabel="Sudah Yakin"
            onConfirm={handleClickSave}
            buttonCancelLabel="Cek lagi"
            messagePrompt="Sudah yakin dengan pengaturan jadwal pertandingan?"
            messageDescription="Anda masih dapat mengubah jadwal sebelum pertandingan dimulai"
          >
            Simpan
          </ButtonWithConfirmPrompt>
        </HorizontalSpacedButtonGroups>
      </SpacedHeader>

      <CategoryList>
        <VerticalSpacedBox>
          {editorFormData ? (
            showOnlySessions.map((session) => (
              <CategoryDetailItem key={session.key}>
                <SessionDetailInput>
                  <div title={session.categoryDetail?.label}>
                    <FieldSelectSmall
                      label="Kategori"
                      placeholder="Pilih kategori"
                      emptyMessage="Kategori kosong"
                      disabled={isDisabled}
                      options={filteredOptionsCategories}
                      value={session.categoryDetail}
                      onChange={(value) => {
                        updateField(session.key, "categoryDetail", value);
                      }}
                    />
                  </div>

                  <div>
                    <TimeRangeLabel>Jam Kualifikasi</TimeRangeLabel>
                    <TimeRangeBox>
                      <FieldInputTimeSmall
                        disabled={isDisabled}
                        value={session.eventStartDatetime}
                        onChange={(value) => {
                          const datetime = _addTimeToTargetDate(
                            value,
                            session.eventStartDatetime
                          );
                          updateField(
                            session.key,
                            "eventStartDatetime",
                            datetime
                          );
                        }}
                      />
                      <span>&ndash;</span>
                      <FieldInputTimeSmall
                        disabled={isDisabled}
                        value={session.eventEndDatetime}
                        onChange={(value) => {
                          const datetime = _addTimeToTargetDate(
                            value,
                            session.eventEndDatetime
                          );
                          updateField(
                            session.key,
                            "eventEndDatetime",
                            datetime
                          );
                        }}
                      />
                    </TimeRangeBox>
                  </div>
                </SessionDetailInput>

                <HorizontalSpacedButtonGroups>
                  <Button
                    flexible
                    title="Tambah jadwal"
                    disabled={isButtonAddDisabled}
                    onClick={() => createSchedule(filteredOptionsCategories[0])}
                  >
                    <IconPlus size="13" />
                  </Button>

                  <ScheduleDatePicker
                    disabled={!session.categoryDetail?.data?.totalParticipant}
                    title="Ubah jadwal"
                    titleOnDirty={`Tanggal diubah menjadi ${datetime.formatFullDateLabel(
                      session.eventStartDatetime
                    )}`}
                    minDate={eventDetail?.publicInformation.eventStart}
                    maxDate={eventDetail?.publicInformation.eventEnd}
                    value={session.eventStartDatetime}
                    onChange={(date) => {
                      const datetimeStart = _addTimeToTargetDate(
                        session.eventStartDatetime,
                        date
                      );
                      const datetimeEnd = _addTimeToTargetDate(
                        session.eventEndDatetime,
                        date
                      );

                      updateField(
                        session.key,
                        "eventStartDatetime",
                        datetimeStart
                      );
                      updateField(session.key, "eventEndDatetime", datetimeEnd);
                    }}
                  />

                  <ButtonWithConfirmPrompt
                    flexible
                    title="Hapus jadwal"
                    disabled={isDisabled || showOnlySessions.length <= 1}
                    buttonConfirmLabel="Hapus"
                    onConfirm={() => removeScheduleItem(session.key)}
                    buttonCancelLabel=""
                    messagePrompt="Jadwal hanya akan dihapus setelah disimpan"
                    messageDescription="Anda dapat mengembalikan data dengan membatalkan ubah data bila berubah pikiran"
                  >
                    <IconTrash size="13" />
                  </ButtonWithConfirmPrompt>
                </HorizontalSpacedButtonGroups>
              </CategoryDetailItem>
            ))
          ) : (
            <CategoryDetailItem>Belum ada data</CategoryDetailItem>
          )}
        </VerticalSpacedBox>
      </CategoryList>
    </React.Fragment>
  );
}

function ScheduleDatePicker({
  value,
  onChange,
  title,
  titleOnDirty,
  disabled,
  minDate,
  maxDate,
}) {
  const isDirty = useDirtyValueChecker(value);
  const computedTitle = titleOnDirty && isDirty ? titleOnDirty : title;

  if (disabled) {
    return (
      <Button flexible disabled title={title}>
        <IconArrowExchange size="13" />
      </Button>
    );
  }

  return (
    <SchedulePickerWrapeer title={computedTitle}>
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<PickerTrigger />}
        locale={id}
        showPopperArrow={false}
        minDate={datetime.parseServerDatetime(minDate) || undefined}
        maxDate={datetime.parseServerDatetime(maxDate) || undefined}
      />
    </SchedulePickerWrapeer>
  );
}

const PickerTrigger = React.forwardRef(({ onClick }, ref) => (
  <Button ref={ref} flexible onClick={onClick}>
    <IconArrowExchange size="13" />
  </Button>
));

PickerTrigger.displayName = "PickerTrigger";

function useDirtyValueChecker(value) {
  const cleanValue = React.useRef(value);
  const isDirty = React.useMemo(
    () => !isSameDay(cleanValue.current, value),
    [value]
  );

  React.useEffect(() => {
    if (value) return;
    cleanValue.current = value;
  }, [value]);

  return isDirty;
}

/* ======================================== */

const CardSheet = styled.div`
  margin-bottom: 24px;
  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const VerticalSpacedBoxLoose = styled.div`
  > * + * {
    margin-top: 3rem;
  }
`;

const HorizontalSpacedButtonGroups = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SpacedHeader = styled.div`
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

const CommonSessionInput = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    max-width: 10rem;
    flex: 1;
  }
`;

const DayGroup = styled.div`
  padding: 1rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;

  transition: box-shadow 0.3s, border-color 0.3s;

  &.editor-active {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

const CategoryList = styled.div`
  position: relative;
  padding: 1rem;
  border: 1px solid var(--ma-gray-100);
  border-radius: 0.25rem;
`;

const CategoryDetailItem = styled.div`
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

const SessionDetailInput = styled.div`
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

const TimeRangeLabel = styled.div`
  margin-bottom: 0.25rem;
`;

const TimeRangeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > *:first-child,
  > *:last-child {
    max-width: 6.375rem;
    flex: 1;
  }
`;

const UpdatingStateBlocker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.75);
`;

const SchedulePickerWrapeer = styled.div`
  display: inline-block;

  .react-datepicker-wrapper {
    width: initial !important;
  }
`;

/* ==================================== */

function ButtonWithConfirmPrompt({
  children,
  disabled,
  title,
  reverseButtons,
  buttonConfirmLabel,
  onConfirm,
  buttonCancelLabel,
  onCancel,
  customButton,
  flexible,
  messagePrompt,
  messageDescription,
}) {
  const [showAlert, setShowAlert] = React.useState(false);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    closeAlert();
  };

  const CustomButtomComp = customButton || Button;

  const buttonTriggerProps = {
    onClick: () => setShowAlert(true),
    disabled: disabled,
    flexible: flexible,
    title: title,
  };

  return (
    <React.Fragment>
      <CustomButtomComp {...buttonTriggerProps}>{children}</CustomButtomComp>
      <SweetAlert
        show={showAlert}
        title=""
        custom
        btnSize="md"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        style={{ width: 800, padding: "35px 88px", borderRadius: "1.25rem" }}
        customButtons={
          <span
            className="d-flex justify-content-center"
            style={{ gap: "0.5rem", width: "100%" }}
          >
            {reverseButtons ? (
              <React.Fragment>
                <Button onClick={handleConfirm}>
                  {buttonConfirmLabel || "Konfirmasi"}
                </Button>
                <ButtonBlue onClick={handleCancel}>
                  {buttonCancelLabel || "Batal"}
                </ButtonBlue>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button onClick={handleCancel}>
                  {buttonCancelLabel || "Batal"}
                </Button>
                <ButtonBlue onClick={handleConfirm}>
                  {buttonConfirmLabel || "Konfirmasi"}
                </ButtonBlue>
              </React.Fragment>
            )}
          </span>
        }
      >
        <IllustationAlertPrompt />
        {messagePrompt && <h4>{messagePrompt}</h4>}
        {messageDescription && (
          <p className="text-muted">{messageDescription}</p>
        )}
      </SweetAlert>
    </React.Fragment>
  );
}

const IllustationAlertPrompt = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 188px;
  background-image: url(${illustrationAlert});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

/* ========================================== */

function filterUnselected(
  categoryOptions,
  { initialSessions, editorSessions, serverSessions }
) {
  const idsFromServer = serverSessions.map(
    (session) => session.categoryDetailId
  );
  const idsInitialEditor = initialSessions
    .map((session) => session.categoryDetail?.value)
    .filter((id) => Boolean(id));

  const slicedIds = idsFromServer.filter((serverId) => {
    for (const initialFormId of idsInitialEditor) {
      if (serverId === initialFormId) {
        return false;
      }
    }
    return true;
  });

  const idsFromEditor = editorSessions.reduce((sessions, session) => {
    if (!session.categoryDetail?.value || session.shouldDelete) {
      return sessions;
    }
    return [...sessions, session.categoryDetail.value];
  }, []);

  const selectedCategoryDetailIds = [...slicedIds, ...idsFromEditor];

  const resultOptions = categoryOptions.filter((option) => {
    for (const id of selectedCategoryDetailIds) {
      if (id === option.value) {
        return false;
      }
    }
    return true;
  });

  return resultOptions;
}

function _addTimeToTargetDate(valueDatetime, targetDatetime) {
  const timeString = datetime
    .formatServerDatetime(valueDatetime)
    ?.split?.(" ")[1];
  const dateString = datetime
    .formatServerDatetime(targetDatetime)
    ?.split?.(" ")[0];
  const resultDatetime = datetime.parseServerDatetime(
    `${dateString} ${timeString}`
  );
  return resultDatetime;
}

export { ScreenSchedules };
