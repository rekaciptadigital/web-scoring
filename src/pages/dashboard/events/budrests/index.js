import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useBudrestSettings } from "./hooks/budrest-settings";
import { ButtonDownloadIdCard } from "./hooks/button-download-id-card";

import { NoticeBarInfo } from "components/ma";
import { SubNavbar } from "../components/submenus-settings";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { BudrestSettingEditorByDate } from "./components/budrest-setting-editor-by-date";

function PageEventBudRests() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const { data: budrestSettings, isLoading: isLoadingBudrestSettings } =
    useBudrestSettings(eventId);
  const isPreparingBudrestSettings = !budrestSettings && isLoadingBudrestSettings;

  return (
    <ContentLayoutWrapper pageTitle="Pengaturan Bantalan" navbar={<SubNavbar eventId={eventId} />}>
      <CardSheet>
        <span className="d-flex justify-content-end" style={{ marginBottom: "20px" }}>
          <ButtonDownloadIdCard buttonLabel="Unduh No. Bantalan Peserta" sessionCount={3} />
        </span>
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
