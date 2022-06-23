import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useReportInfos } from "./hooks/report-infos";
import { useReportParticipants } from "./hooks/download-participants";
import { useReportRoundups } from "./hooks/download-roundups";

import { SubNavbar } from "../components/submenus-reporting";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ButtonDownload } from "./components/button-download";
import { toast } from "./components/processing-toast";

import IconUsersGroup from "components/ma/icons/mono/users-group";
// TODO: buat finance nanti kalau udah ready
// import IconMoney from "components/ma/icons/mono/money";
import IconMedal from "components/ma/icons/mono/medal";
import IconLoading from "./components/icon-loading";

import { datetime } from "utils";

function PageEventReports() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const reportInfos = useReportInfos();

  const {
    downloadParticipants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
    errors: errorsParticipants,
  } = useReportParticipants();

  const {
    downloadRoundups,
    isLoading: isLoadingRoundups,
    isError: isErrorRoundups,
    errors: errorsRoundups,
  } = useReportRoundups();

  const _makeDownloadHandler = (downloadFn) => {
    return () => {
      const toastId = toast.loading("Sedang menyiapkan dokumen unduhan...");
      const options = {
        onSuccess() {
          toast.remove(toastId);
          toast.success("Unduhan dimulai");
        },
        onError() {
          toast.remove(toastId);
          toast.error("Unduhan gagal");
        },
      };
      downloadFn(options);
    };
  };

  const pageLayoutProps = {
    pageTitle: "Laporan Event",
    navbar: <SubNavbar eventId={eventId} />,
  };

  return (
    <ContentLayoutWrapper {...pageLayoutProps}>
      <CardList>
        <CardSheet>
          <ReportingMediaObject
            icon={IconUsersGroup}
            title="Laporan Jumlah Peserta"
            description="Laporan jumlah peserta yang mengikuti pertandingan"
            customFooter={<ReportGenerateDateInfo name="participant" reportInfos={reportInfos} />}
            onDownload={_makeDownloadHandler(downloadParticipants)}
            isLoading={isLoadingParticipants}
            isError={isErrorParticipants}
            errors={errorsParticipants}
          />
        </CardSheet>

        {/* TODO: Report finance, copas di atas kalau udah ready */}

        <CardSheet>
          <ReportingMediaObject
            icon={IconMedal}
            title="Laporan Pertandingan"
            description="Laporan hasil akhir pertandingan"
            customFooter={<ReportGenerateDateInfo name="competition" reportInfos={reportInfos} />}
            onDownload={_makeDownloadHandler(downloadRoundups)}
            isLoading={isLoadingRoundups}
            isError={isErrorRoundups}
            errors={errorsRoundups}
          />
        </CardSheet>
      </CardList>
    </ContentLayoutWrapper>
  );
}

function ReportingMediaObject({
  icon,
  title = "Set judul kartu dulu",
  description = "Set deskripsi kartu dulu",
  customFooter,
  onDownload,
  isLoading,
  isError,
  errors,
}) {
  return (
    <ReportingMediaObjectWrapper>
      <ReportingMedia>
        <div>
          <BlueBoxThumb icon={icon} />
        </div>
      </ReportingMedia>

      <ReportingContent>
        <ReportingContentBody>
          <div>
            <ReportingMediaTitle>{title}</ReportingMediaTitle>
            <p>{description}</p>
          </div>

          <div>
            <ButtonDownload
              title={"Unduh " + title}
              onDownload={onDownload}
              isLoading={isLoading}
              isError={isError}
              errors={errors}
            />
          </div>
        </ReportingContentBody>

        <ReportingContentFooter>{customFooter}</ReportingContentFooter>
      </ReportingContent>
    </ReportingMediaObjectWrapper>
  );
}

function BlueBoxThumb({ icon }) {
  if (!icon) {
    return <ThumbWrapper>thumbnail icon</ThumbWrapper>;
  }

  const CustomIcon = icon;
  return (
    <ThumbWrapper>
      <CustomIcon size="60" />
    </ThumbWrapper>
  );
}

function SpinningLoadingIndicator() {
  return (
    <SpinningLoader>
      <IconLoading size="16" />
    </SpinningLoader>
  );
}

function ReportGenerateDateInfo({ reportInfos, name }) {
  const { data, isLoading: isFetching, isError, isRetryEnabled, fetchInfos } = reportInfos;
  const isLoading = !data && isFetching;

  const _getReportGenerateDate = (name) => {
    if (!reportInfos.data?.length) {
      return "";
    }
    const foundDate = reportInfos.data.find((info) => info.reportType === name)?.dateGenerate;
    if (!foundDate) {
      return "";
    }
    return datetime.formatFullDateLabel(foundDate);
  };

  const generateDate = _getReportGenerateDate(name);

  if (isLoading) {
    return (
      <PillLabel>
        <SpinningLoadingIndicator />
      </PillLabel>
    );
  }

  if (isError) {
    return (
      <PillLabel>
        <FailedText>
          Gagal mengambil info tanggal generate laporan
          {!isRetryEnabled && (
            <React.Fragment>
              . <RetryLink onClick={() => fetchInfos()}>Coba lagi.</RetryLink>
            </React.Fragment>
          )}
        </FailedText>
      </PillLabel>
    );
  }

  return (
    <PillLabel>
      {generateDate ? "Sudah di-generate pada tanggal " + generateDate : "Tersedia"}
    </PillLabel>
  );
}

/* ======================== */
// styles

const CardList = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const CardSheet = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
`;

const ReportingMediaObjectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ReportingMedia = styled.div`
  flex-shrink: 0;
`;

const ReportingContent = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const ReportingContentBody = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const ReportingMediaTitle = styled.h3`
  font-weight: 600;
`;

const ReportingContentFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
`;

const PillLabel = styled.span`
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-100);
  color: var(--ma-blue);
  font-weight: 600;
`;

const FailedText = styled.span`
  font-weight: normal;
  color: var(--ma-gray-500);
`;

const RetryLink = styled.a`
  color: var(--ma-gray-500);

  &,
  &:hover {
    text-decoration: underline !important;
  }

  &:hover {
    color: var(--ma-blue);
  }
`;

const ThumbWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  --thumb-size: 7.1875rem;
  min-width: var(--thumb-size);
  min-height: var(--thumb-size);
  border-radius: 0.625rem;
  background-color: var(--ma-primary-blue-50);
  color: #000000;
`;

const SpinningLoader = styled.span`
  display: inline-block;
  animation: spin-loading 0.7s infinite linear;

  @keyframes spin-loading {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
`;

export default PageEventReports;
