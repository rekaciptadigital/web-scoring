import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRouteQueryParams } from "./hooks/route-params";
import { useEventDetail } from "./hooks/event-detail";
import { useCategoriesQualification } from "./hooks/qualification-categories";
import { useQualificationSchedules } from "./hooks/qualification-schedules";
import { useFormPublicInfos } from "./hooks/form-public-infos";
import { useFormFees } from "./hooks/form-fees";
import { useFormCategories } from "./hooks/form-categories";
import { useFormSchedules } from "./hooks/form-schedules";
import { useSubmitPublicInfos } from "./hooks/submit-public-infos";
import { useSubmitCategories } from "./hooks/submit-categories";

import { AlertSubmitError, ButtonOutlineBlue } from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import {
  StepByStepScreen,
  StepListIndicator,
  StepItem,
  StepDisplay,
  StepContent,
  StepHeader,
  StepBody,
  StepFooterActions,
} from "./components/step-by-step-screen";
import { ButtonSave } from "./components/button-save";
import { ProcessingToast, toast } from "./components/processing-toast";
import { LoadingScreen } from "./components/loading-screen-portal";

import { ScreenPublicInfos } from "./screens/public-infos";
import { ScreenFees } from "./screens/fees";
import { ScreenCategories } from "./screens/categories";
import { ScreenRules } from "./screens/rules";
import { ScreenSchedules } from "./screens/schedules";
import { ScreenSchedulesMarathon } from "./screens/schedules-marathon";
import { ScreenFinish } from "./screens/finish";

import { eventConfigs } from "constants/index";
import { stepId } from "./constants/step-ids";
import { computeLastUnlockedStep } from "./utils/last-unlocked-step";

import IconPlus from "components/ma/icons/mono/plus";

const { EVENT_TYPES } = eventConfigs;

function PageCreateEventFullday() {
  const {
    eventId,
    isManageEvent,
    eventType: qsEventType,
    matchType: qsMatchType,
    setParamEventId,
    pathname,
  } = useRouteQueryParams();

  const {
    data: eventDetail,
    isPreparing: isPreparingEvent,
    fetchEventDetail,
  } = useEventDetail(eventId);
  const { data: categories } = useCategoriesQualification(eventDetail);
  const schedulesProvider = useQualificationSchedules(eventDetail);
  const { data: schedules } = schedulesProvider;

  const eventType = _checkEventType(eventDetail, qsEventType);
  const matchType = _checkMatchType(eventDetail, qsMatchType);
  const isTypeMarathon = eventType === EVENT_TYPES.MARATHON;

  // Forms
  const formPublicInfos = useFormPublicInfos(eventDetail);
  const formFees = useFormFees(eventDetail);
  const formCategories = useFormCategories(eventDetail);
  const formSchedules = useFormSchedules(schedules, {
    eventType,
    eventDetail,
    categoryDetails: categories,
  });

  const lastUnlockedStep = computeLastUnlockedStep({
    1: formPublicInfos.isEmpty,
    2: formFees.isEmpty,
    3: formCategories.isEmpty,
    // TODO:
    4: false,
    5: formSchedules.isEmpty,
    6: !formSchedules.isEmpty,
  });

  // Submit functions
  const {
    submit: submitPublicInfos,
    isLoading: isSubmitingPublicInfos,
    isError: isErrorPublicInfos,
    errors: publicInfosErrors,
  } = useSubmitPublicInfos({
    eventType: eventType,
    matchType: matchType,
    eventId: eventDetail?.id,
  });

  const {
    submit: submitCategories,
    isLoading: isSubmitingCategories,
    isError: isErrorCategories,
    errors: categoriesErrors,
  } = useSubmitCategories();

  const isLoadingSubmit = isSubmitingPublicInfos || isSubmitingCategories;

  return (
    <ContentLayoutWrapper
      pageTitle="Buat Event Baru"
      breadcrumbText="Kembali"
      breadcrumbLink={isManageEvent ? `/dashboard/event/${eventId}/home` : "/dashboard"}
    >
      <ProcessingToast />
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorPublicInfos} errors={publicInfosErrors} />
      <AlertSubmitError isError={isErrorCategories} errors={categoriesErrors} />

      <StepByStepScreen lastUnlocked={lastUnlockedStep}>
        <StepListIndicator title="Pertandingan">
          <StepItem id={stepId.INFO_UMUM}>Informasi Umum</StepItem>
          <StepItem id={stepId.BIAYA}>Biaya Registrasi</StepItem>
          <StepItem id={stepId.KATEGORI}>Kategori Lomba</StepItem>
          <StepItem id={stepId.PERATURAN}>Aturan Pertandingan</StepItem>
          <StepItem id={stepId.JADWAL_KUALIFIKASI}>Jadwal Pertandingan</StepItem>
          <StepItem id={stepId.SELESAI}>Selesai</StepItem>
        </StepListIndicator>

        <StepDisplay>
          <StepContent id={stepId.INFO_UMUM}>
            <StepHeader>
              <h2>Informasi Umum</h2>
              <p>Banner dan informasi mengenai event Anda</p>
            </StepHeader>

            <StepBody>
              <ScreenPublicInfos
                eventDetail={eventDetail}
                form={formPublicInfos}
                isPreparing={isPreparingEvent}
              />
            </StepBody>

            <StepFooterActions mathTpe={matchType}>
              <ButtonSave
                onSubmit={({ next }) => {
                  submitPublicInfos(formPublicInfos.data, {
                    onSuccess(data) {
                      toast.success("Informasi umum event berhasil disimpan");
                      const isCreateMode = !eventDetail?.id || !eventId;
                      if (isCreateMode) {
                        setParamEventId(data.id);
                        next();
                      } else {
                        fetchEventDetail();
                      }
                    },
                  });
                }}
              >
                Simpan
              </ButtonSave>
            </StepFooterActions>
          </StepContent>

          <StepContent id={stepId.BIAYA}>
            <StepHeader>
              <h2>Biaya Registrasi</h2>
              <p>Pengaturan biaya pendaftaran pertandingan</p>
            </StepHeader>

            <StepBody>
              <ScreenFees eventDetail={eventDetail} form={formFees} />
            </StepBody>

            <StepFooterActions mathTpe={matchType}>
              <ButtonSave
                onSubmit={({ next }) => {
                  if (!eventDetail?.eventCategories?.length) {
                    toast.success("Lanjutkan buat kategori.");
                    formFees.markAsFilled();
                    next();
                    return;
                  }

                  // Jalan cuma ketika "edit", udah ada kategorinya
                  submitCategories(formCategories.data, formFees, {
                    eventId,
                    onSuccess() {
                      toast.success("Berhasil menyimpan biaya registrasi");
                      fetchEventDetail();
                    },
                  });
                }}
              >
                Simpan
              </ButtonSave>
            </StepFooterActions>
          </StepContent>

          <StepContent id={stepId.KATEGORI}>
            <StepHeader>
              <SpacedHeaderBar>
                <div>
                  <h2>Kategori Lomba</h2>
                  <p>Pengaturan kategori beserta detailnya</p>
                </div>

                <div>
                  <ButtonOutlineBlue
                    as={Link}
                    to={{
                      pathname: "/dashboard/class-categories",
                      state: { from: pathname },
                    }}
                  >
                    Pengaturan Kelas
                  </ButtonOutlineBlue>

                  <ButtonOutlineBlue
                    disabled={formCategories.data?.length >= formCategories.maxLength}
                    onClick={() => formCategories.createEmptyCategory()}
                  >
                    <IconPlus size="13" /> Tambah Kategori
                  </ButtonOutlineBlue>
                </div>
              </SpacedHeaderBar>
            </StepHeader>

            <StepBody>
              <ScreenCategories
                eventDetail={eventDetail}
                fetchEventDetail={fetchEventDetail}
                form={formCategories}
                formFees={formFees}
              />
            </StepBody>

            <StepFooterActions mathTpe={matchType}>
              <ButtonSave
                onSubmit={({ next }) => {
                  submitCategories(formCategories.data, formFees, {
                    eventId,
                    onSuccess() {
                      fetchEventDetail();
                      toast.success("Berhasil menyimpan kategori");
                      if (formCategories.isEmpty) {
                        next();
                      }
                    },
                  });
                }}
              >
                Simpan
              </ButtonSave>
            </StepFooterActions>
          </StepContent>

          <StepContent id={stepId.PERATURAN}>
            <StepHeader>
              <h2>Aturan Pertandingan</h2>
              <p>Atur aturan pertandingan event Anda</p>
            </StepHeader>

            <StepBody>
              <ScreenRules eventDetail={eventDetail} />
            </StepBody>

            <StepFooterActions mathTpe={matchType}>
              <ButtonSave
                onSubmit={({ next }) => {
                  // TODO: next kalau valid / sudah simpan data
                  next();
                }}
              >
                Selanjutnya
              </ButtonSave>
            </StepFooterActions>
          </StepContent>

          <StepContent id={stepId.JADWAL_KUALIFIKASI}>
            <StepHeader>
              <h2>Jadwal Pertandingan</h2>
              <p>Atur jadwal pertandingan event Anda</p>
            </StepHeader>

            <StepBody>
              {!isTypeMarathon ? (
                <ScreenSchedules
                  eventDetail={eventDetail}
                  categories={categories}
                  formSchedules={formSchedules}
                  schedulesProvider={schedulesProvider}
                />
              ) : (
                <ScreenSchedulesMarathon
                  eventDetail={eventDetail}
                  categories={categories}
                  formSchedules={formSchedules}
                  onSuccessSubmit={schedulesProvider.fetchSchedules}
                />
              )}
            </StepBody>

            <StepFooterActions mathTpe={matchType}>
              <ButtonSave
                disabled={formSchedules.isEmpty}
                onSubmit={({ next }) => {
                  toast.success("Selesai mengisi data event!");
                  next();
                }}
              >
                Selesai
              </ButtonSave>
            </StepFooterActions>
          </StepContent>

          <StepContent id={stepId.SELESAI}>
            <StepBody>
              <ScreenFinish eventDetail={eventDetail} fetchEventDetail={fetchEventDetail} />
            </StepBody>
          </StepContent>
        </StepDisplay>
      </StepByStepScreen>
    </ContentLayoutWrapper>
  );
}

const SpacedHeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;

    > * + * {
      margin-left: 0.5rem;
    }
  }
`;

/* ======================================= */
// utils

function _checkEventType(eventDetail, qsEventType) {
  return eventDetail?.eventType || qsEventType || null;
}

function _checkMatchType(eventDetail, qsMatchType) {
  return eventDetail?.eventCompetition || qsMatchType || null;
}

export { PageCreateEventFullday };
