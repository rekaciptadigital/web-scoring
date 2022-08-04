import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useReportInfos } from "./hooks/report-infos";
import { useReportParticipants } from "./hooks/download-participants";

import { SubNavbar } from "../components/submenus-reporting";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ButtonDownload } from "./components/button-download";
import { toast } from "./components/processing-toast";

import IconUsersGroup from "components/ma/icons/mono/users-group";
// TODO: buat finance nanti kalau udah ready
// import IconMoney from "components/ma/icons/mono/money";
import IconInfo from "components/ma/icons/mono/info";
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

  

  const _getIsReportAvailable = (name) => {
    if (!reportInfos.data?.length) {
      return false;
    }
    const isAvailable = reportInfos.data.find((info) => info.reportType === name)?.isAvailable;
    return Boolean(isAvailable); // bisa undefined kalau find()-nya gak dapat
  };

  const _makeDownloadHandler = (downloadFn) => {
    return () => {
      const toastId = toast.loading("Sedang menyiapkan dokumen unduhan...");
      const options = {
        onSuccess() {
          toast.remove(toastId);
          toast.success("Unduhan dimulai");
          reportInfos.fetchInfos();
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

  const participantIsAvailable = _getIsReportAvailable("participant");
  // TODO: finance

  return (
    <ContentLayoutWrapper {...pageLayoutProps}>
      <CardList>
        <CardSheet>
          <ReportingMediaObject
            icon={IconUsersGroup}
            title="Laporan Jumlah Peserta"
            description="Laporan jumlah peserta yang mengikuti pertandingan"
            customFooter={
              <ReportGenerateDateInfo
                name="participant"
                reportInfos={reportInfos}
                isAvailable={participantIsAvailable}
              />
            }
            onDownload={_makeDownloadHandler(downloadParticipants)}
            isLoading={isLoadingParticipants}
            isError={isErrorParticipants}
            errors={errorsParticipants}
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
  downloadDisabled = false,
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
              title={downloadDisabled ? `Belum tersedia ${title}` : `Unduh ${title}`}
              disabled={downloadDisabled}
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

function ReportGenerateDateInfo({ reportInfos, name, isAvailable }) {
  const { data, isLoading: isFetching, isError, fetchInfos } = reportInfos;
  const isLoading = !data && isFetching;

  const generateDate = React.useMemo(() => {
    if (!reportInfos.data?.length) {
      return "";
    }
    const foundDate = reportInfos.data.find((info) => info.reportType === name)?.dateGenerate;
    if (!foundDate) {
      return "";
    }
    return datetime.formatFullDateLabel(foundDate);
  }, [name, reportInfos]);

  if (isLoading) {
    return (
      <PillLabel>
        <SpinningLoadingIndicator />
      </PillLabel>
    );
  }

  if (isError || !data) {
    return (
      <PillLabel title="Gagal mengambil info tanggal generate laporan. Klik untuk coba lagi.">
        <FailedText onClick={fetchInfos}>
          <IconInfo size="12" />
        </FailedText>
      </PillLabel>
    );
  }

  if (!isAvailable) {
    return <PillLabel title="Laporan tersedia setelah event berakhir.">Tidak Tersedia</PillLabel>;
  }

  return (
    <PillLabel>
      {!generateDate ? "Tersedia" : `Sudah di-generate pada tanggal ${generateDate}`}
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
  cursor: pointer;
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
