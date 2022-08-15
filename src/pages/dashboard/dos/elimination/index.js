import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useCategoryDetails } from "./hooks/category-details";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { SideBar } from "../components/sidebar";
import { ToolbarFilter } from "../components/toolbar-filters";
import { ButtonShowBracket } from "./components/button-show-bracket";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTableTeam } from "./components/scoring-table-team";

const pageProps = {
  pageTitle: "DOS Eliminasi",
  sidebar: <SideBar />,
};

function PageDosElimination() {
  const { event_id, date_event } = useParams();
  const eventId = parseInt(event_id);

  const {
    isSettled: isSettledCategories,
    data: categoryDetails,
    isLoading: isLoadingCategories,
    errors: errorsCategoryDetail,
  } = useCategoryDetails(eventId, date_event);

  const [activeCategory, setActiveCategory] = React.useState(null);
  const isIndividual = activeCategory?.categoryTeam?.toLowerCase?.() !== "team";

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <PageWrapper {...pageProps}>
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
        <SpinnerDotBlock />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper {...pageProps}>
      <CardWrapper>
        <ToolbarFilter
          categories={categoryDetails}
          isLoading={isLoadingCategories}
          onChange={(value) => setActiveCategory(value?.categoryDetail)}
          viewRight={
            <div>
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
