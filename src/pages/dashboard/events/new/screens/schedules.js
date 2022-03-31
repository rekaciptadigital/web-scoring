import * as React from "react";
import styled from "styled-components";
import { useScheduleEditorForm } from "../hooks/form-submit-editor-schedule";
import { toast } from "../components/processing-toast";

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
import IconTrash from "components/ma/icons/mono/trash";

import classnames from "classnames";

function ScreenSchedules({ eventDetail, categories, formSchedules, schedulesProvider }) {
  const [indexActiveEditor, setIndexActiveEditor] = React.useState(-1);
  const { data } = formSchedules;

  const asOptionObject = (type) => ({ value: type.id, label: type.labelCategory });
  const options = categories?.map(asOptionObject) || [];

  return (
    <CardSheet>
      <VerticalSpacedBox>
        <NoticeBarInfo>
          Jadwal hanya bisa diubah bila belum terdapat peserta terdaftar
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
                <FieldInputDateSmall label="Tanggal" disabled value={sessionsByDate.sessionDate} />
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

            <EditorDisplay sessionsByDate={sessionsByDate} schedulesProvider={schedulesProvider} />
          </React.Fragment>
        )}
      </VerticalSpacedBox>
    </DayGroup>
  );
}

function EditorDisplay({ sessionsByDate, schedulesProvider }) {
  const { data: schedules, isLoading: isLoadingSchedule } = schedulesProvider;
  const isUpdatingEditorData = schedules?.length && isLoadingSchedule;

  return (
    <CategoryList>
      {isUpdatingEditorData && <UpdatingStateBlocker>Memperbarui data...</UpdatingStateBlocker>}
      <VerticalSpacedBox>
        {sessionsByDate.sessions.map((session) => (
          <CategoryDetailItem key={session.key}>
            <SessionDetailInput>
              <div>
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
                  <FieldInputTimeSmall disabled value={session.eventStartDatetime} />
                  <span>&ndash;</span>
                  <FieldInputTimeSmall disabled value={session.eventEndDatetime} />
                </TimeRangeBox>
              </div>
            </SessionDetailInput>

            <HorizontalSpacedButtonGroups>
              <Button flexible disabled>
                <IconPlus size="13" />
              </Button>

              <Button flexible disabled>
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
  const { fetchSchedules } = schedulesProvider;
  const {
    data: editorFormData,
    updateField,
    createEmptySchedule,
    removeScheduleItem,
    submitSchedules,
    isLoading: isLoadingSubmit,
    isError: isErrorSubmit,
    errors: errorsSubmit,
  } = useScheduleEditorForm(sessionsByDate, eventDetail?.id);

  const showOnlySessions = editorFormData?.sessions.filter((session) => !session.shouldDelete);

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
          <FieldInputDateSmall label="Tanggal" disabled value={sessionsByDate.sessionDate} />
        </CommonSessionInput>

        <HorizontalSpacedButtonGroups>
          <ButtonOutlineBlue onClick={() => onCloseEdit?.()}>Batal</ButtonOutlineBlue>
          <ButtonBlue onClick={handleClickSave}>Simpan</ButtonBlue>
        </HorizontalSpacedButtonGroups>
      </SpacedHeader>

      <CategoryList>
        <VerticalSpacedBox>
          {editorFormData ? (
            showOnlySessions.map((session) => (
              <CategoryDetailItem key={session.key}>
                <SessionDetailInput>
                  <div>
                    <FieldSelectSmall
                      label="Kategori"
                      placeholder="Pilih kategori"
                      disabled={isDisabled}
                      options={optionsCategories}
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
                          updateField(session.key, "eventStartDatetime", value);
                        }}
                      />
                      <span>&ndash;</span>
                      <FieldInputTimeSmall
                        disabled={isDisabled}
                        value={session.eventEndDatetime}
                        onChange={(value) => {
                          updateField(session.key, "eventEndDatetime", value);
                        }}
                      />
                    </TimeRangeBox>
                  </div>
                </SessionDetailInput>

                <HorizontalSpacedButtonGroups>
                  <Button flexible disabled={isDisabled} onClick={() => createEmptySchedule()}>
                    <IconPlus size="13" />
                  </Button>

                  <Button
                    flexible
                    disabled={isDisabled || showOnlySessions.length <= 1}
                    onClick={() => removeScheduleItem(session.key)}
                  >
                    <IconTrash size="13" />
                  </Button>
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

export { ScreenSchedules };
