import * as React from "react";
import styled from "styled-components";
import { DisplaySettingsProvider, useDisplaySettings } from "./contexts/display-settings";

import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { HUD } from "./components/hud";
import { TeamFilterIndicator } from "./components/team-filter-indicator";
import { TableView } from "./components/table-view";

import IconDot from "components/ma/icons/mono/dot";
import IconAlertTri from "components/ma/icons/mono/alert-triangle";

function PageLiveScore() {
  return (
    <DisplaySettingsProvider>
      <ContentLayoutWrapper pageTitle="Live Score">
        <HUD />
        <DataDisplay />
      </ContentLayoutWrapper>
    </DisplaySettingsProvider>
  );
}

function DataDisplay() {
  const { activeCategory, isRunning, sessionNumber, isQualification, roundOptions, round } =
    useDisplaySettings();

  if (!isRunning) {
    return (
      <TableEmptyContainer>
        <div>
          <div>
            <IconAlertTri size="52" />
          </div>
          <p>Kategori belum dipilih</p>
        </div>
      </TableEmptyContainer>
    );
  }

  return (
    <TableContainer>
      <CategoryBar>
        {isQualification ? (
          <DetailInfo>
            <span>Kualifikasi</span>
            <span>
              <IconDot size="0.375em" />
            </span>
            <span>{activeCategory}</span>
            {sessionNumber > 0 && sessionNumber !== 11 && (
              <React.Fragment>
                <span>
                  <IconDot size="0.375em" />
                </span>
                <span>Sesi {sessionNumber}</span>
              </React.Fragment>
            )}
          </DetailInfo>
        ) : (
          <DetailInfo>
            <span>Eliminasi</span>
            <span>
              <IconDot size="0.375em" />
            </span>
            <span>{activeCategory}</span>
            {roundOptions?.[round] && (
              <React.Fragment>
                <span>
                  <IconDot size="0.375em" />
                </span>
                <RoundLabel>{roundOptions[round]}</RoundLabel>
              </React.Fragment>
            )}
          </DetailInfo>
        )}

        <TeamFilterIndicator />
      </CategoryBar>

      <TableView />
    </TableContainer>
  );
}

/* ========================= */
// styles

const TableEmptyContainer = styled.div`
  border-radius: 0.375rem;
  background-color: var(--ma-gray-100);
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    > * + * {
      margin-top: 0.5rem;
    }

    color: var(--ma-gray-400);
    font-size: 1.75rem;
    font-weight: 600;
    text-align: center;
  }
`;

const TableContainer = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  > *:nth-child(1) {
    flex-shrink: 0;
  }

  > *:nth-child(2) {
    flex-grow: 1;
    flex-basis: 0;
    overflow-y: auto;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const CategoryBar = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  padding-right: 1rem;
  background-color: var(--ma-blue);
  color: #ffffff;
  font-size: 1.625rem;
  font-weight: 600;
`;

const DetailInfo = styled.div`
  > * + * {
    margin-left: 1.5rem;
  }
`;

const RoundLabel = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  background-color: var(--ma-primary-blue-50);
  color: var(--ma-gray-600);
`;

export default PageLiveScore;
