import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "../hooks/event-detail";
import { useCategoryDetails } from "./hooks/category-details";

import { AlertSubmitError, ButtonOutlineBlue, SpinnerDotBlock } from "components/ma";
import { toast } from "components/ma/processing-toast";
import IconDownload from "components/ma/icons/mono/download";

import { PageWrapper } from "../components/dos-page-wrapper";
import { PageHeader } from "../components/page-header";
import { ToolbarFilter } from "../components/toolbar-filters";
import { ButtonShowBracket } from "./components/button-show-bracket";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTableTeam } from "./components/scoring-table-team";
import { useDownloadBaganElimination } from "pages/dashboard/events/scoring-elimination/hooks/download-bagan-elimination";

const pageProps = {
  pageTitle: "Eliminasi",
};

function PageDosElimination() {
  const { event_id, date_event } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);

  const {
    isSettled: isSettledCategories,
    data: categoryDetails,
    isLoading: isLoadingCategories,
    errors: errorsCategoryDetail,
  } = useCategoryDetails(eventId, date_event);

  const [activeCategory, setActiveCategory] = React.useState(null);
  const isIndividual = activeCategory?.categoryTeam?.toLowerCase?.() !== "team";

  const {
    download: downloadBagan,
    errors: errorDonwloadBagan,
    isError: isErrorDownloadBagan
  } = useDownloadBaganElimination(eventId, activeCategory?.id);

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Eliminasi" />
        <CardWrapper>
          <Content>
            <p>
              Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
              teknis lebih lanjut:
            </p>

            <pre>{JSON.stringify(errorsCategoryDetail)}</pre>
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  if (!isSettledCategories) {
    return (
      <PageWrapper {...pageProps}>
        <PageHeader eventDetail={eventDetail} subHeading="Eliminasi" />
        <CardWrapper>
          <Content>
            <SpinnerDotBlock />
          </Content>
        </CardWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <PageHeader eventDetail={eventDetail} subHeading="Eliminasi" />

      <CardWrapper>
        <ToolbarFilter
          categories={categoryDetails}
          isLoading={isLoadingCategories}
          onChange={(value) => setActiveCategory(value?.categoryDetail)}
          viewRight={
            <div>
              <ButtonOutlineBlue style={{ marginRight: '10px' }} onClick={() => {
                toast.loading("Sedang memproses unduhan...");
                downloadBagan({
                  onSuccess() {
                    toast.dismiss();
                    toast.success("Memulai unduhan...");
                  },
                  onError() {
                    toast.dismiss();
                    toast.error("Gagal memulai unduhan");
                  },
                });
              }}>
                <span>
                  <IconDownload size="16" />
                </span>{" "}
                <span>Cetak Bagan</span>
              </ButtonOutlineBlue>
              <ButtonShowBracket categoryDetailId={activeCategory?.id} />
            </div>
          }
        />

        <Content>
          {!activeCategory ? (
            <NoBracketWrapper>
              <h4>Data kategori tidak tersedia</h4>
            </NoBracketWrapper>
          ) : isIndividual ? (
            <ScoringTable
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              categoryDetails={activeCategory}
              eliminationMemberCounts={activeCategory?.defaultEliminationCount}
            />
          ) : (
            <ScoringTableTeam
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              categoryDetails={activeCategory}
              eliminationMemberCounts={activeCategory?.defaultEliminationCount}
            />
          )}
        </Content>
      </CardWrapper>
      <AlertSubmitError isError={isErrorDownloadBagan} errors={errorDonwloadBagan} />
    </PageWrapper>
  );
}

/* =============================== */
// styles

const CardWrapper = styled.div`
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const Content = styled.div`
  padding: 0.5rem 0;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

const NoBracketWrapper = styled.div`
  min-height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > *:nth-child(1) {
    margin-top: -2rem;
    color: var(--ma-gray-400);
  }
`;

export default PageDosElimination;
