import * as React from "react";
import styled from "styled-components";
import { DisplaySettingsProvider, useDisplaySettings } from "./contexts/display-settings";

import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { HUD } from "./components/hud";
import { ScoringTable } from "./components/scoring-table";

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

function DataDisplay({ columns = [{ key: 1 }] }) {
  const { activeCategory, activeTeam, activeCategoryDetail, isRunning, next } =
    useDisplaySettings();

  return (
    <DisplayWrapper>
      {columns.map((column) =>
        isRunning ? (
          <TableContainer key={column.key}>
            <CategoryBar>Nama Kategori Jiaha Haha (Debug: key {column.key})</CategoryBar>

            {/* Fake navigasi */}
            <h4>{activeCategory}</h4>
            <h4>{activeTeam}</h4>
            <h4>{activeCategoryDetail?.id}</h4>

            {activeCategoryDetail && (
              <ScoringTable
                key={activeCategoryDetail.id}
                categoryDetail={activeCategoryDetail}
                onEmptyData={() => next()}
              />
            )}
          </TableContainer>
        ) : (
          <TableEmptyContainer key={column.key}>
            <div>
              <div>
                <IconAlertTri size="52" />
              </div>
              <p>Kategori belum dipilih</p>
            </div>
          </TableEmptyContainer>
        )
      )}
    </DisplayWrapper>
  );
}

/* ========================= */
// styles

const DisplayWrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: var(--scores-grid-template-columns, 1fr);
`;

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
  border-radius: 0.375rem;
  overflow: hidden;
`;

const CategoryBar = styled.div`
  padding: 0.75rem 0;
  background-color: var(--ma-blue);
  color: #ffffff;
  font-weight: 600;
  text-align: center;

  &.category-column-odd {
    background-color: var(--ma-primary-blue-3);
  }
`;

export default PageLiveScore;
