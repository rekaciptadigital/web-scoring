import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { SubNavbar } from "../components/submenus-reporting";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ButtonDownload } from "./components/button-download";
import { toast } from "./components/processing-toast";

import IconUsersGroup from "components/ma/icons/mono/users-group";
import IconMoney from "components/ma/icons/mono/money";
import IconMedal from "components/ma/icons/mono/medal";

import { useFetcher } from "utils/hooks/alt-fetcher";
import { misc } from "utils";

function useDownload() {
  const fetcher = useFetcher();
  const download = (options) => {
    const getFunction = async () => {
      await misc.sleep(750);
      return { success: true, data: "haha" };
    };
    fetcher.runAsync(getFunction, options);
  };
  return { ...fetcher, download };
}

function PageEventReports() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const {
    download: downloadParticipants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
    errors: errorsParticipants,
  } = useDownload();

  const {
    download: downloadFinance,
    isLoading: isLoadingFinance,
    isError: isErrorFinance,
    errors: errorsFinance,
  } = useDownload();

  const {
    download: downloadMatches,
    isLoading: isLoadingMatches,
    isError: isErrorMatches,
    errors: errorsMatches,
  } = useDownload();

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
            description="Laporan jumlah peserta yang mengikuti pertandingan dalam bentuk PDF"
            customFooter={<PillLabel>Sudah di-generate pada tanggal 25/04/22</PillLabel>}
            onDownload={() => {
              const toastId = toast.loading("Sedang menyiapkan dokumen unduhan...");
              downloadParticipants({
                onSuccess() {
                  toast.remove(toastId);
                  toast.success("Unduhan dimulai");
                },
                onError() {
                  toast.remove(toastId);
                  toast.error("Unduhan gagal");
                },
              });
            }}
            isLoading={isLoadingParticipants}
            isError={isErrorParticipants}
            errors={errorsParticipants}
          />
        </CardSheet>

        <CardSheet>
          <ReportingMediaObject
            icon={IconMoney}
            title="Laporan Keuangan"
            description="Laporan keuangan pertandingan dalam bentuk PDF"
            customFooter={<PillLabel>Sudah di-generate pada tanggal 25/04/22</PillLabel>}
            onDownload={() => {
              const toastId = toast.loading("Sedang menyiapkan dokumen unduhan...");
              downloadFinance({
                onSuccess() {
                  toast.remove(toastId);
                  toast.success("Unduhan dimulai");
                },
                onError() {
                  toast.remove(toastId);
                  toast.error("Unduhan gagal");
                },
              });
            }}
            isLoading={isLoadingFinance}
            isError={isErrorFinance}
            errors={errorsFinance}
          />
        </CardSheet>

        <CardSheet>
          <ReportingMediaObject
            icon={IconMedal}
            title="Laporan Pertandingan"
            description="Laporan hasil akhir pertandingan dalam bentuk PDF"
            customFooter={<PillLabel>Tersedia</PillLabel>}
            onDownload={() => {
              const toastId = toast.loading("Sedang menyiapkan dokumen unduhan...");
              downloadMatches({
                onSuccess() {
                  toast.remove(toastId);
                  toast.success("Unduhan dimulai");
                },
                onError() {
                  toast.remove(toastId);
                  toast.error("Unduhan gagal");
                },
              });
            }}
            isLoading={isLoadingMatches}
            isError={isErrorMatches}
            errors={errorsMatches}
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

export default PageEventReports;
