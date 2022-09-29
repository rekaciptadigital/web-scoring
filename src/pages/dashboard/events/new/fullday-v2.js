import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useRouteQueryParams } from "./hooks/route-params";
import { useEventDetail } from "./hooks/event-detail";
import { useCategoryDetails } from "./hooks/category-details";
import { useCategoriesQualification } from "./hooks/qualification-categories";
import { useConfigRegistrationDates } from "./hooks/config-registration-dates";
import { useQualificationSchedules } from "./hooks/qualification-schedules";
import { useFormPublicInfos } from "./hooks/form-public-infos";
import { useFormFees } from "./hooks/form-fees";
import { useFormCategories } from "./hooks/form-categories";
import { useFormRegistrationDates } from "./hooks/form-registration-dates";
import { useFormSchedules } from "./hooks/form-schedules";
import { useSubmitPublicInfos } from "./hooks/submit-public-infos";
import { useSubmitEventLogo } from "./hooks/submit-event-logo";
import { useSubmitRegistrationDates } from "./hooks/submit-config-registration-dates";
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
import { ScreenRegistrationDates } from "./screens/registration-dates";
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
  const { data: categoryDetails, fetch: fetchCategoryDetails } = useCategoryDetails(eventId);
  const { data: categoriesQualification } = useCategoriesQualification(eventDetail);
  const schedulesProvider = useQualificationSchedules(eventDetail);
  const { data: configRegistrationDates, fetch: fetchConfigRegistrationDates } =
    useConfigRegistrationDates(eventId);
  const { data: schedules } = schedulesProvider;

  const eventType = _checkEventType(eventDetail, qsEventType);
  const matchType = _checkMatchType(eventDetail, qsMatchType);
  const isTypeMarathon = eventType === EVENT_TYPES.MARATHON;
  const isTypeSelection = matchType === "Selection";

  // Forms
  const formPublicInfos = useFormPublicInfos(eventDetail);
  const formFees = useFormFees(eventDetail);
  const formCategories = useFormCategories(eventDetail);
  const formRegistrationDates = useFormRegistrationDates(categoryDetails, configRegistrationDates);
  const formSchedules = useFormSchedules(schedules, {
    eventType,
    eventDetail,
    categoryDetails: categoriesQualification,
  });

  const emptyFormSequenceByStep = isTypeSelection
    ? {
        1: formPublicInfos.isEmpty,
        2: formFees.isEmpty,
        3: formCategories.isEmpty,
        4: formRegistrationDates.isFirstTimeCreatingConfig,
        5: formSchedules.isEmpty,
        6: !formSchedules.isEmpty,
      }
    : {
        1: formPublicInfos.isEmpty,
        2: formFees.isEmpty,
        3: formCategories.isEmpty,
        4: formRegistrationDates.isFirstTimeCreatingConfig,
        5: false, // selalu unlock apapun nilainya (sifatnya gak wajib diset)
        6: formSchedules.isEmpty,
        7: !formSchedules.isEmpty,
      };

  const lastUnlockedStep = computeLastUnlockedStep(emptyFormSequenceByStep);

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
    submit: submitLogo,
    isLoading: isLoadingLogo,
    isError: isErrorLogo,
    errors: errorsLogo,
  } = useSubmitEventLogo(eventDetail?.id);

  const {
    submit: submitCategories,
    isLoading: isSubmitingCategories,
    isError: isErrorCategories,
    errors: categoriesErrors,
  } = useSubmitCategories();

  const {
    submit: submitRegistrationDates,
    isLoading: isSubmitRegistrationDates,
    isError: isErrorRegistrationDates,
    errors: errorsRegistrationDates,
  } = useSubmitRegistrationDates(eventDetail?.id, formRegistrationDates.data);

  const isLoadingSubmit =
    isSubmitingPublicInfos || isLoadingLogo || isSubmitingCategories || isSubmitRegistrationDates;

  return (
    <ContentLayoutWrapper
      pageTitle="Buat Event Baru"
      breadcrumbText="Kembali"
      breadcrumbLink={isManageEvent ? `/dashboard/event/${eventId}/home` : "/dashboard"}
    >
      <ProcessingToast />
      <LoadingScreen loading={isLoadingSubmit} />
      <AlertSubmitError isError={isErrorPublicInfos} errors={publicInfosErrors} />
      <AlertSubmitError isError={isErrorLogo} errors={errorsLogo} />
      <AlertSubmitError isError={isErrorCategories} errors={categoriesErrors} />
      <AlertSubmitError isError={isErrorRegistrationDates} errors={errorsRegistrationDates} />

      <StepByStepScreen lastUnlocked={lastUnlockedStep}>
        <StepListIndicator title="Pertandingan">
          <StepItem id={stepId.INFO_UMUM}>Informasi Umum</StepItem>
          <StepItem id={stepId.BIAYA}>Biaya Registrasi</StepItem>
          <StepItem id={stepId.KATEGORI}>Kategori Lomba</StepItem>
          <StepItem id={stepId.JADWAL_REGISTRASI}>Informasi Pendaftaran</StepItem>
          {!isTypeSelection && <StepItem id={stepId.PERATURAN}>Aturan Pertandingan</StepItem>}
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
                fetchEventDetail={fetchEventDetail}
                form={formPublicInfos}
                isPreparing={isPreparingEvent}
              />
            </StepBody>

            <StepFooterActions>
              <ButtonSave
                onSubmit={async ({ next }) => {
                  // Maafkan kerumitan ini wkwk. Ini karena ada 2 endpoint API yang
                  // harus di-hit sekaligus ketika klik tombol simpan, tanpa terjadi
                  // race condition.
                  const isCreateMode = !eventDetail?.id || !eventId;
                  let tempEventId = undefined;

                  try {
                    await new Promise((resolve, reject) => {
                      submitPublicInfos(formPublicInfos.data, {
                        onSuccess(data) {
                          tempEventId = data.id;
                          resolve();
                        },
                        onError() {
                          reject();
                        },
                      });
                    });

                    const SUCCESS_MESSAGE = "Informasi umum event berhasil disimpan";

                    // 1
                    if (!isCreateMode) {
                      toast.success(SUCCESS_MESSAGE);
                      fetchEventDetail();
                      return;
                    }

                    // 2
                    if (!formPublicInfos.data.logoImage?.base64) {
                      toast.success(SUCCESS_MESSAGE);
                      setParamEventId(tempEventId); // set event id di sini akan otomatis trigger fetch event detail
                      next();
                      return;
                    }

                    // 3
                    submitLogo(formPublicInfos.data.logoImage?.base64, {
                      eventId: tempEventId,
                      onSuccess() {
                        toast.success(SUCCESS_MESSAGE);
                        setParamEventId(tempEventId); // set event id di sini akan otomatis trigger fetch event detail
                        next();
                      },
                    });
                  } catch (err) {
                    toast.error("Terjadi kesalahan");
                    console.error(err);
                  }
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

            <StepFooterActions>
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
                      fetchCategoryDetails();
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

            <StepFooterActions>
              <ButtonSave
                onSubmit={({ next }) => {
                  submitCategories(formCategories.data, formFees, {
                    eventId,
                    onSuccess() {
                      fetchEventDetail();
                      fetchCategoryDetails();
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

          <StepContent id={stepId.JADWAL_REGISTRASI}>
            <StepHeader>
              <SpacedHeaderBar>
                <div>
                  <h2>Informasi Pendaftaran</h2>
                  <p>Pengaturan informasi pendaftaran untuk event Anda</p>
                </div>
              </SpacedHeaderBar>
            </StepHeader>

            <StepBody>
              <ScreenRegistrationDates form={formRegistrationDates} />
            </StepBody>

            <StepFooterActions>
              <ButtonSave
                onSubmit={({ next }) => {
                  submitRegistrationDates({
                    onSuccess() {
                      toast.success("Berhasil menyimpan informasi pendaftaran");
                      // Event detail juga perlu di-GET ulang karena data untuk jadwal kualifikasi
                      // diambil dari data tanggal lomba dari event detail
                      fetchEventDetail();
                      fetchConfigRegistrationDates();

                      formRegistrationDates.isFirstTimeCreatingConfig && next();
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

            <StepFooterActions>
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
                  categories={categoriesQualification}
                  formSchedules={formSchedules}
                  schedulesProvider={schedulesProvider}
                />
              ) : (
                <ScreenSchedulesMarathon
                  eventDetail={eventDetail}
                  categories={categoriesQualification}
                  formSchedules={formSchedules}
                  onSuccessSubmit={schedulesProvider.fetchSchedules}
                />
              )}
            </StepBody>

            <StepFooterActions>
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
