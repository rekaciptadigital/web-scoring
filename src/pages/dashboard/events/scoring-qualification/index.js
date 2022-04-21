import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useCategoryDetails } from "./hooks/category-details";
import { useCategoriesWithFilters } from "./hooks/category-filters";

import { SpinnerDotBlock, ButtonOutlineBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-matches";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ScoringTable } from "./components/scoring-table";
import { SearchBox } from "./components/search-box";

import IconDownload from "components/ma/icons/mono/download";

import classnames from "classnames";

function PageEventScoringQualification() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const { data: categoryDetails, isLoading: isLoadingCategoryDetails } =
    useCategoryDetails(eventId);
  const {
    activeCategoryDetail,
    optionsCompetitionCategory,
    optionsAgeCategory,
    optionsGenderCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
    selectOptionGenderCategory,
  } = useCategoriesWithFilters(categoryDetails);

  const isPreparingInitialData = !categoryDetails && isLoadingCategoryDetails;

  if (isPreparingInitialData) {
    return (
      <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
        <SpinnerDotBlock />
      </ContentLayoutWrapper>
    );
  }

  return (
    <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
      <TabBar>
        <TabButtonList>
          {optionsCompetitionCategory.map((option) => (
            <li key={option.competitionCategory}>
              <TabButton
                className={classnames({ "tab-active": option.isActive })}
                onClick={() => selectOptionCompetitionCategory(option.competitionCategory)}
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
                        onClick={() => selectOptionAgeCategory(option.ageCategory)}
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
                        onClick={() => selectOptionGenderCategory(option.genderCategory)}
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

          <HorizontalSpaced>
            <SearchBox placeholder="Cari peserta" disabled />
            <ButtonOutlineBlue disabled>
              <IconDownload size="16" /> Unduh Dokumen
            </ButtonOutlineBlue>
          </HorizontalSpaced>
        </ToolbarTop>

        <ScoringTable
          key={activeCategoryDetail?.categoryDetailId}
          categoryDetailId={activeCategoryDetail?.categoryDetailId}
        />
      </ViewWrapper>
    </ContentLayoutWrapper>
  );
}

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;
`;

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

export default PageEventScoringQualification;
