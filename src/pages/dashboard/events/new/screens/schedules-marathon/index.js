import * as React from "react";
import styled from "styled-components";
import { toast } from "../../components/processing-toast";
import { useFormScheduleMarathon } from "./hooks/form-schedule-marathon";
import { useSubmitSchedules } from "./hooks/submit-schedules";

import {
  NoticeBarInfo,
  AlertSubmitError,
  ButtonBlue,
  ButtonOutlineBlue,
} from "components/ma";
import {
  FieldInputDateSmall,
  FieldInputTextSmall,
} from "../../../components/form-fields";
import { LoadingScreen } from "../../components/loading-screen-portal";
import { ButtonWithConfirmPrompt } from "./components/button-confirm-prompt";

import { setHours, setMinutes } from "date-fns";
import { datetime } from "utils";

// function ScreenSchedulesMarathon({ eventDetail, formSchedules, onSuccessSubmit }) {
function ScreenSchedulesMarathon({
  eventDetail,
  eventType,
  categories,
  onSuccessSubmit,
}) {
  const formSchedules = useFormSchedules(schedules, {
    eventType,
    eventDetail,
    categoryDetails: categories,
  });
  const { data: formData } = formSchedules;

  const [indexActiveEditor, setIndexActiveEditor] = React.useState(-1);
  const editorIsActive = indexActiveEditor >= 0;
  const openEditor = (index) => setIndexActiveEditor(index);
  const closeEditor = () => setIndexActiveEditor(-1);

  return (
    <CardSheet>
      <VerticalSpacedBox>
        <NoticeBarInfo>
          Jadwal hanya bisa diubah bila belum terdapat peserta terdaftar
        </NoticeBarInfo>

        <VerticalSpacedBoxLoose>
          {formData.map((categoryGroup, index) => (
            <CategoryGroupEditor
              key={categoryGroup.key}
              isEditMode={indexActiveEditor === index}
              canOpen={!editorIsActive}
              onOpen={() => openEditor(index)}
              onClose={closeEditor}
              categoryGroup={categoryGroup}
              eventDetail={eventDetail}
              onSuccessSubmit={onSuccessSubmit}
            />
          ))}
        </VerticalSpacedBoxLoose>
      </VerticalSpacedBox>
    </CardSheet>
  );
}

function CategoryGroupEditor({
  isEditMode,
  onOpen,
  onClose,
  canOpen,
  categoryGroup,
  eventDetail,
  onSuccessSubmit,
}) {
  if (isEditMode) {
    return (
      <CategoryGroupContainer className="editor-active">
        <EditorForm
          onClose={onClose}
          categoryGroup={categoryGroup}
          eventDetail={eventDetail}
          onSuccessSubmit={onSuccessSubmit}
        />
      </CategoryGroupContainer>
    );
  }

  return (
    <CategoryGroupContainer>
      <EditorDisplay
        canOpen={canOpen}
        onOpen={onOpen}
        categoryGroup={categoryGroup}
      />
    </CategoryGroupContainer>
  );
}

function EditorDisplay({ canOpen, onOpen, categoryGroup }) {
  return (
    <VerticalSpacedBox>
      <SpacedHeader>
        <CommonSessionInput>
          <h4>{categoryGroup.competitionCategory}</h4>
        </CommonSessionInput>

        <HorizontalSpacedButtonGroups>
          <ButtonOutlineBlue
            disabled={!canOpen}
            title={
              canOpen
                ? "Atur jadwal bertanding untuk masing-masing kategori"
                : "Terdapat form jadwal yang sedang aktif"
            }
            onClick={onOpen}
          >
            Atur Jadwal
          </ButtonOutlineBlue>
        </HorizontalSpacedButtonGroups>
      </SpacedHeader>

      <CategoryList>
        <VerticalSpacedBox>
          {categoryGroup.schedules.map((schedule) => (
            <CategoryDetailItem key={schedule.key}>
              <SessionDetailInput>
                <div>
                  <TimeRangeLabel>Kategori</TimeRangeLabel>
                  <DisplayField>{schedule.categoryDetail.label}</DisplayField>
                </div>

                <div>
                  <TimeRangeLabel>Tanggal Bertanding</TimeRangeLabel>
                  {!schedule.idQualificationTime ? (
                    <TimeRangeBox>
                      <DisplayField>Belum diatur</DisplayField>
                    </TimeRangeBox>
                  ) : (
                    <TimeRangeBox className="range-as-display">
                      <DisplayField>
                        {datetime.formatShortDate(schedule.eventStartDatetime)}
                      </DisplayField>
                      <span>&ndash;</span>
                      <DisplayField>
                        {datetime.formatShortDate(schedule.eventEndDatetime)}
                      </DisplayField>
                    </TimeRangeBox>
                  )}
                </div>
              </SessionDetailInput>
            </CategoryDetailItem>
          ))}
        </VerticalSpacedBox>
      </CategoryList>
    </VerticalSpacedBox>
  );
}

function EditorForm({ onClose, categoryGroup, eventDetail, onSuccessSubmit }) {
  const eventId = eventDetail?.id ? parseInt(eventDetail.id) : undefined;
  const { data: formData, updateField } = useFormScheduleMarathon(
    categoryGroup?.schedules
  );
  const {
    submitSchedules,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useSubmitSchedules(eventId);

  const setDateStart = (key, value) =>
    updateField(key, "eventStartDatetime", value);
  const setDateEnd = (key, value) =>
    updateField(key, "eventEndDatetime", value);

  const dateConstraint = React.useMemo(() => {
    const eventStart = datetime.parseServerDatetime(
      eventDetail.publicInformation.eventStart
    );
    const eventEnd = datetime.parseServerDatetime(
      eventDetail.publicInformation.eventEnd
    );
    return {
      min: eventDetail ? setHours(setMinutes(eventStart, 0), 0) : undefined,
      max: eventDetail ? setHours(setMinutes(eventEnd, 59), 23) : undefined,
    };
  }, [eventDetail]);

  return (
    <VerticalSpacedBox>
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorSubmit} errors={errorsSubmit} />

      <SpacedHeader>
        <CommonSessionInput>
          <h4>{categoryGroup.competitionCategory}</h4>
        </CommonSessionInput>

        <HorizontalSpacedButtonGroups>
          <ButtonWithConfirmPrompt
            customButton={ButtonOutlineBlue}
            reverseButtons
            buttonConfirmLabel="Yakin"
            buttonCancelLabel="Kembali isi data"
            messageDescription="Yakin akan membatalkan data yang dimasukkan?"
            onConfirm={onClose}
          >
            Batal
          </ButtonWithConfirmPrompt>

          <ButtonWithConfirmPrompt
            customButton={ButtonBlue}
            buttonConfirmLabel="Sudah Yakin"
            buttonCancelLabel="Cek lagi"
            messagePrompt="Sudah yakin dengan pengaturan jadwal pertandingan?"
            messageDescription="Anda masih dapat mengubah jadwal sebelum pertandingan dimulai"
            onConfirm={() => {
              submitSchedules(formData, {
                onSuccess() {
                  toast.success("Jadwal berhasil disimpan");
                  onSuccessSubmit?.();
                  onClose?.();
                },
              });
            }}
          >
            Simpan
          </ButtonWithConfirmPrompt>
        </HorizontalSpacedButtonGroups>
      </SpacedHeader>

      <CategoryList>
        <VerticalSpacedBox>
          {formData.map((schedule) => (
            <CategoryDetailItem key={schedule.key}>
              <SessionDetailInput>
                <div>
                  <FieldInputTextSmall
                    label="Kategori"
                    placeholder="Pilih kategori"
                    readOnly
                    value={schedule.categoryDetail.label}
                  />
                </div>

                <div>
                  <TimeRangeLabel>Tanggal Bertanding</TimeRangeLabel>
                  <TimeRangeBox>
                    <FieldInputDateSmall
                      value={schedule.eventStartDatetime}
                      onChange={(value) => setDateStart(schedule.key, value)}
                      minDate={dateConstraint.min}
                      maxDate={dateConstraint.max}
                    />
                    <span>&ndash;</span>
                    <FieldInputDateSmall
                      value={schedule.eventEndDatetime}
                      onChange={(value) => setDateEnd(schedule.key, value)}
                      minDate={schedule.eventStartDatetime}
                      maxDate={dateConstraint.max}
                    />
                  </TimeRangeBox>
                </div>
              </SessionDetailInput>
            </CategoryDetailItem>
          ))}
        </VerticalSpacedBox>
      </CategoryList>
    </VerticalSpacedBox>
  );
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
  > * + * {
    margin-left: 0.5rem;
  }
`;

const CategoryGroupContainer = styled.div`
  padding: 1rem;
  border: 1px solid var(--ma-gray-200);
  border-radius: 0.5rem;

  transition: box-shadow 0.3s, border-color 0.3s;

  &.editor-active {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
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

  &.range-as-display {
    > *:first-child,
    > *:last-child {
      flex: 0;
    }
  }
`;

const DisplayField = styled.div`
  display: block;
  width: 100%;
  padding: 8px 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #6a7187;
`;

export { ScreenSchedulesMarathon };
