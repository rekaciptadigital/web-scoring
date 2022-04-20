import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue } from "components/ma";
import { SubNavbar } from "../components/submenus-matches";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ScoringTable } from "./components/scoring-table";

import IconDownload from "components/ma/icons/mono/download";

function PageEventScoringQualification() {
  return (
    <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
      <div>
        <TabBar>
          <TabButtonList>
            <li>
              <TabButton>Recurve</TabButton>
            </li>
            <li>
              <TabButton className="tab-active">Compound</TabButton>
            </li>
            <li>
              <TabButton>Nasional</TabButton>
            </li>
            <li>
              <TabButton>Barebow</TabButton>
            </li>
            <li>
              <TabButton>Traditional Bow</TabButton>
            </li>
          </TabButtonList>
        </TabBar>

        <ViewWrapper>
          <ToolbarTop>
            <FilterBars>
              <CategoryFilter>
                <FilterLabel>Kelas:</FilterLabel>
                <FilterList>
                  <li>
                    <FilterItemButton> Umum - 70m</FilterItemButton>
                  </li>
                  <li>
                    <FilterItemButton className="filter-item-active"> U15 - 50m</FilterItemButton>
                  </li>
                </FilterList>
              </CategoryFilter>

              <CategoryFilter>
                <FilterLabel>Jenis Regu:</FilterLabel>
                <FilterList>
                  <li>
                    <FilterItemButton className="filter-item-active">
                      Individu Putra
                    </FilterItemButton>
                  </li>
                  <li>
                    <FilterItemButton>Individu Putri</FilterItemButton>
                  </li>
                </FilterList>
              </CategoryFilter>
            </FilterBars>

            <div>
              <input type="text" placeholder="Cari peserta" />
              <ButtonOutlineBlue>
                <IconDownload size="16" /> Unduh Dokumen
              </ButtonOutlineBlue>
            </div>
          </ToolbarTop>

          <ScoringTable />
        </ViewWrapper>
      </div>
    </ContentLayoutWrapper>
  );
}

const ViewWrapper = styled.div`
  padding: 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

const TabBar = styled.div`
  margin-bottom: 0.25rem;
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
  font-size: 0.875rem;
  font-weight: 600;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
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
    box-shadow: 0 0 0 1px var(--ma-blue-400);
    background-color: transparent;

    color: var(--ma-blue-400);
    font-size: 0.875rem;
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
