import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useBudrestSettings } from "./hooks/budrest-settings";
import { ButtonDownloadIdCard } from "./hooks/button-download-id-card";

import { AlertSubmitError, NoticeBarInfo } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { BudrestSettingEditorByDate } from "./components/budrest-setting-editor-by-date";
import { useIdcardDownloadBudrest } from "./hooks/download-idcard-budrest";
import { ProcessingToast, toast } from "components/ma/processing-toast";

function PageEventBudRests() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const { data: budrestSettings, isLoading: isLoadingBudrestSettings } =
    useBudrestSettings(eventId);
  const isPreparingBudrestSettings = !budrestSettings && isLoadingBudrestSettings;

  const {
    download: downloadIDCard,
    isError: isErrorDownloadIDCard,
    errors: errorsDownloadIDCard,
  } = useIdcardDownloadBudrest(eventId);

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Bantalan" navbar={<SubNavbar eventId={eventId} />}>
      <AlertSubmitError isError={isErrorDownloadIDCard} errors={errorsDownloadIDCard} />
      <ProcessingToast/>

      <CardSheet>
        {Boolean(budrestSettings?.length) && (
          <span className="d-flex justify-content-end" style={{ marginBottom: "20px" }}>
            <ButtonDownloadIdCard
              buttonLabel="Unduh Semua No. Bantalan Peserta"
              sessionCount={3}
              disabled={!budrestSettings}
              onDownload={(type) => {
                toast.loading("Sedang menyiapkan file data...");
                downloadIDCard(null, type, {
                  onSuccess: () => {
                    toast.dismiss();
                  },
                  onError: () => {
                    toast.dismiss();
                    toast.error("Gagal memulai unduhan");
                  },
                });
              }}
            />
          </span>
        )}
        <VerticalSpacedBox>
          {Boolean(budrestSettings?.length) && (
            <NoticeBarInfo>Pengaturan aktif apabila pendaftaran lomba telah ditutup</NoticeBarInfo>
          )}

          <VerticalSpacedBoxLoose>
            {isPreparingBudrestSettings ? (
              <div>Sedang menyiapkan data pengaturan bantalan...</div>
            ) : budrestSettings ? (
              budrestSettings.length ? (
                budrestSettings.map((settingsByDate) => (
                  <BudrestSettingEditorByDate
                    key={settingsByDate.key}
                    settingsByDate={settingsByDate}
                  />
                ))
              ) : (
                <div>Data kategori atau jadwal belum tersedia.</div>
              )
            ) : (
              <div>Tidak ada data.</div>
            )}
          </VerticalSpacedBoxLoose>
        </VerticalSpacedBox>
      </CardSheet>
    </ContentLayoutWrapper>
  );
}

const CardSheet = styled.div`
  position: relative;
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

export default PageEventBudRests;
