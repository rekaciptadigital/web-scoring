import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useCategoryDetails } from "./hooks/category-details";
import { useCategoriesWithFilters } from "./hooks/category-filters";
import { useScoresheetDownload } from "./hooks/scoresheet-download";

import {
  SpinnerDotBlock,
  ButtonOutlineBlue,
} from "components/ma";
import { SubNavbar } from "../components/submenus-matches";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ScoringTable } from "./components/scoring-table";
import { ProcessingToast, toast } from "./components/processing-toast";

import IconDownload from "components/ma/icons/mono/download";

import classnames from "classnames";

function PageDosQualification() {
  const { event_id, date_event } = useParams();
  const eventId = parseInt(event_id);

  const {
    data: categoryDetails,
    errors: errorsCategoryDetail,
    isSettled: isSettledCategories,
  } = useCategoryDetails(eventId, date_event);

  const {
    activeCategoryDetail,
    optionsCompetitionCategory,
    optionsAgeCategory,
    optionsGenderCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
    selectOptionGenderCategory,
  } = useCategoriesWithFilters(categoryDetails);

  const [inputSearchQuery, setInputSearchQuery] = React.useState("");

  const { handleDownloadScoresheet } = useScoresheetDownload(
    activeCategoryDetail?.categoryDetailId
  );

  const resetOnChangeCategory = () => {
    setInputSearchQuery("");
  };

  const errorFetchingInitialCategories = !categoryDetails && errorsCategoryDetail;

  if (errorFetchingInitialCategories) {
    return (
      <ContentLayoutWrapper pageTitle="Dos Kualifikasi" navbar={<SubNavbar />}>
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

  if (!isSettledCategories) {
    return (
      <ContentLayoutWrapper pageTitle="Dos Kualifikasi" navbar={<SubNavbar />}>
        <SpinnerDotBlock />
      </ContentLayoutWrapper>
    );
  }

  return (
    <ContentLayoutWrapper pageTitle="Dos Kualifikasi" navbar={<SubNavbar />}>
      <ProcessingToast />
  
      <TabBar>
        <TabButtonList>
          {optionsCompetitionCategory.map((option) => (
            <li key={option.competitionCategory}>
              <TabButton
                className={classnames({ "tab-active": option.isActive })}
                onClick={() => {
                  resetOnChangeCategory();
                  selectOptionCompetitionCategory(option.competitionCategory);
                }}
              >
                {option.competitionCategory}
              </TabButton>
            </li>
          ))}
        </TabButtonList>
      </TabBar>

      <ViewWrapper>
        <ToolbarTop>
          <FilterBars>
            <CategoryFilter>
              <FilterLabel>Kelas:</FilterLabel>
              <FilterList>
                {optionsAgeCategory?.length > 0 ? (
                  optionsAgeCategory.map((option) => (
                    <li key={option.ageCategory}>
                      <FilterItemButton
                        className={classnames({ "filter-item-active": option.isActive })}
                        onClick={() => {
                          resetOnChangeCategory();
                          selectOptionAgeCategory(option.ageCategory);
                        }}
                      >
                        {option.ageCategory}
                      </FilterItemButton>
                    </li>
                  ))
                ) : (
                  <li>Tidak tersedia filter kelas</li>
                )}
              </FilterList>
            </CategoryFilter>

            <CategoryFilter>
              <FilterLabel>Jenis Regu:</FilterLabel>
              <FilterList>
                {optionsGenderCategory?.length > 0 ? (
                  optionsGenderCategory.map((option) => (
                    <li key={option.genderCategory}>
                      <FilterItemButton
                        className={classnames({ "filter-item-active": option.isActive })}
                        onClick={() => {
                          resetOnChangeCategory();
                          selectOptionGenderCategory(option.genderCategory);
                        }}
                      >
                        {option.genderCategoryLabel}
                      </FilterItemButton>
                    </li>
                  ))
                ) : (
                  <li>Tidak tersedia filter jenis regu</li>
                )}
              </FilterList>
            </CategoryFilter>
          </FilterBars>

          <ToolbarRight>
            <HorizontalSpaced>
              <ButtonOutlineBlue
                onClick={() => {
                  toast.loading("Sedang menyiapkan dokumen scoresheet...");
                  handleDownloadScoresheet({
                    onSuccess() {
                      toast.dismiss();
                    },
                  });
                }}
              >
                <span>
                  <IconDownload size="16" />
                </span>{" "}
                <span>Unduh Laporan</span>
              </ButtonOutlineBlue>

            </HorizontalSpaced>
          </ToolbarRight>
        </ToolbarTop>

        <ScoringTable
          key={activeCategoryDetail?.categoryDetailId}
          categoryDetailId={activeCategoryDetail?.categoryDetailId}
          searchName={inputSearchQuery}
          onChangeParticipantPresence={resetOnChangeCategory}
          eliminationParticipantsCount={activeCategoryDetail?.defaultEliminationCount}
        />
      </ViewWrapper>
    </ContentLayoutWrapper>
  );
}

/* =============================== */
// styles

const ViewWrapper = styled.div`
  padding: 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

const TabBar = styled.div`
  margin-bottom: 0.25rem;
  background-color: #ffffff;
`;

const TabButtonList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  > * {
    flex-grow: 1;
  }
`;

const TabButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #ffffff;
  color: var(--ma-blue);
  font-weight: 500;

  position: relative;

  &::after {
    content: " ";
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;

    transform: scaleX(0);
    transition: all 0.2s;
  }

  &:hover {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }

  &.tab-active {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }
`;

const ToolbarTop = styled.div`
  display: flex;
  gap: 1.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
    margin-top: auto;
  }
`;

const FilterBars = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const ToolbarRight = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;

  > * {
    flex-grow: 1;
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  align-items: center;

  > *:nth-child(1) {
    flex-shrink: 0;
    min-width: 6.25rem;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const FilterLabel = styled.div`
  color: var(--ma-txt-black);
  font-weight: 600;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterItemButton = styled.button`
  transition: all 0.15s;

  &,
  &:active,
  &:focus,
  &:focus-visible {
    padding: 0.5rem 0.75rem;
    border: solid 1px var(--ma-blue-400);
    border-radius: 0.5rem;
    background-color: transparent;

    color: var(--ma-blue-400);
    font-weight: 600;

    &.filter-item-active {
      background-color: var(--ma-primary-blue-50);
      border-color: var(--ma-blue);
      box-shadow: 0 0 0 1px var(--ma-blue);
      color: var(--ma-blue);
    }
  }

  &:hover {
    background-color: var(--ma-primary-blue-50);
  }
`;

export default PageDosQualification;
