import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useCategoryDetails } from "./hooks/category-details";
// TODO:
// import { useScoresheetDownload } from "./hooks/scoresheet-download";
// import { useSessionDownload } from "./hooks/download-session";

import { SpinnerDotBlock } from "components/ma";
import { PageWrapper } from "components/ma/page-wrapper";
import { SideBar } from "../components/sidebar";
import {
  ToolbarFilter,
  KnobGroupLayout,
  KnobsClassCategories,
  KnobsTeamCategories,
  Knobs,
} from "../components/toolbar-filters";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTeamTable } from "./components/scoring-table/reguTable";

const pageProps = {
  pageTitle: "DOS Kualifikasi",
  sidebar: <SideBar />,
};

function PageDosQualification() {
  const { event_id, date_event } = useParams();
  const eventId = parseInt(event_id);

  const {
    data: categoryDetails,
    errors: errorsCategoryDetail,
    isSettled: isSettledCategories,
    isLoading: isLoadingCategories,
  } = useCategoryDetails(eventId, date_event);

  const [activeCategory, setActiveCategory] = React.useState(null);
  const isIndividual = activeCategory?.categoryTeam?.toLowerCase?.() !== "team";
  const sessionCount = activeCategory?.sessionInQualification;
  const optionsSession = _makeOptionsSessionFromCount(sessionCount);

  const [inputSearchQuery, setInputSearchQuery] = React.useState("");
  const [session, setSession] = React.useState(0);

  const resetOnChangeCategory = () => {
    setInputSearchQuery("");
  };

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <PageWrapper {...pageProps}>
        <ViewWrapper>
          <p>
            Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
            teknis lebih lanjut:
          </p>

          <pre>{JSON.stringify(errorsCategoryDetail)}</pre>
        </ViewWrapper>
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
      <div>
        <ToolbarFilter
          categories={categoryDetails}
          isLoading={isLoadingCategories}
          onChange={(value) => setActiveCategory(value?.categoryDetail)}
          viewLeft={
            <KnobGroupLayout>
              <KnobsClassCategories />
              <KnobsTeamCategories />
              <Knobs
                label="Sesi"
                options={optionsSession}
                activeKnobId={session}
                onChange={(value) => setSession(value)}
              />
            </KnobGroupLayout>
          }
        />
        <ViewWrapper>
          {!activeCategory ? (
            <NoBracketWrapper>
              <h4>Data kategori tidak tersedia</h4>
            </NoBracketWrapper>
          ) : isIndividual ? (
            <ScoringTable
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategory?.defaultEliminationCount}
              isTeam={!isIndividual}
              session={session}
            />
          ) : (
            <ScoringTeamTable
              key={activeCategory?.id}
              categoryDetailId={activeCategory?.id}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategory?.defaultEliminationCount}
              isTeam={!isIndividual}
            />
          )}
        </ViewWrapper>
      </div>
    </PageWrapper>
  );
}

/* =============================== */
// styles

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

const ViewWrapper = styled.div`
  padding: 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

/* =============================== */
// utils

function _makeOptionsSessionFromCount(sessionCount) {
  const sessionNumbers = _makeSessionNumbers(sessionCount);
  return sessionNumbers.map((number) => ({
    value: number,
    label: number > 0 ? "Sesi " + number : "Sesi Total",
  }));
}

function _makeSessionNumbers(sessionCount) {
  const defaultSessionId = 0;
  if (!sessionCount) {
    return [defaultSessionId];
  }
  const qualificationSessions = [...new Array(sessionCount)].map((item, index) => index + 1);
  return [defaultSessionId, ...qualificationSessions];
}

export default PageDosQualification;
