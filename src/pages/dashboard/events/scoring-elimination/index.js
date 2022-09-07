import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useCategoryDetails } from "./hooks/category-details";

import { SpinnerDotBlock } from "components/ma";
import { ToolbarFilter } from "components/ma/toolbar-filters";
import { SubNavbar } from "../components/submenus-matches";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ProcessingToast } from "./components/processing-toast";
import { ButtonShowBracket } from "./components/button-show-bracket";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTableTeam } from "./components/scoring-table-team";

const propsContentWrapper = {
  pageTitle: "Skoring Eliminasi",
  navbar: <SubNavbar />,
};

function PageEventScoringElimination() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const {
    isSettled: isSettledCategories,
    isLoading: isLoadingCategories,
    data: categoryDetails,
    errors: errorsCategoryDetail,
  } = useCategoryDetails(eventId);

  const [activeCategory, setActiveCategory] = React.useState(null);
  const isIndividual = activeCategory?.categoryTeam?.toLowerCase?.() === "individual";

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <ContentLayoutWrapper {...propsContentWrapper}>
        <ViewWrapper>
          <p>
            Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
            teknis lebih lanjut:
          </p>

          <pre>{JSON.stringify(errorsCategoryDetail)}</pre>
        </ViewWrapper>
      </ContentLayoutWrapper>
    );
  }

  // TODO: loading ganti ketika belum settle filter, enggak lagi ke fetch detail
  if (!isSettledCategories) {
    return (
      <ContentLayoutWrapper {...propsContentWrapper}>
        <SpinnerDotBlock />
      </ContentLayoutWrapper>
    );
  }

  return (
    <ContentLayoutWrapper {...propsContentWrapper}>
      <ProcessingToast />

      <ToolbarFilter
        categories={categoryDetails}
        isLoading={isLoadingCategories}
        onChange={(data) => setActiveCategory(data?.categoryDetail)}
        viewRight={
          <div key={activeCategory?.id}>
            <ButtonShowBracket
              categoryDetailId={activeCategory?.id}
              eliminationMemberCount={activeCategory?.defaultEliminationCount}
            />
          </div>
        }
      >
        {activeCategory &&
          (isIndividual ? (
            <ScoringTable
              key={"elimination-" + activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              categoryDetails={activeCategory}
              eliminationMemberCounts={activeCategory?.defaultEliminationCount}
            />
          ) : (
            <ScoringTableTeam
              key={"elimination-" + activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              categoryDetails={activeCategory}
              eliminationMemberCounts={activeCategory?.defaultEliminationCount}
            />
          ))}
      </ToolbarFilter>
    </ContentLayoutWrapper>
  );
}

/* =============================== */
// styles

const ViewWrapper = styled.div`
  padding: 1rem 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

export default PageEventScoringElimination;
