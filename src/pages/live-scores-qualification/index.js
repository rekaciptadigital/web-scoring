import * as React from "react";
import styled from "styled-components";
import { DisplaySettingsProvider } from "./contexts/display-settings";

import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { HUD } from "./components/hud";

import IconAlertTri from "components/ma/icons/mono/alert-triangle";
import IconBudrest from "components/ma/icons/mono/bud-rest";
import IconMedal from "components/ma/icons/fill/medal-gold.js";

import classnames from "classnames";

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

const colSpans = {
  1: 7,
  2: 5,
  3: 3,
};

function DataDisplay({ columns = [{ key: 1 }] }) {
  const columnCount = columns.length;
  const teamColSpanConfig = colSpans[columnCount];
  return (
    <DisplayWrapper>
      {columns.map((column, index) =>
        index === 1 ? (
          <TableContainer key={column.key}>
            <CategoryBar className={classnames({ "category-column-odd": index === 1 })}>
              Nama Kategori Jiaha Haha (Debug: key {column.key})
            </CategoryBar>

            <ScoreTable className="table table-responsive">
              <thead>
                <tr>
                  <th colSpan={teamColSpanConfig} className="heading-cell-men">
                    Putra
                  </th>
                  <th colSpan={teamColSpanConfig} className="heading-cell-women">
                    Putri
                  </th>
                </tr>
                <tr>
                  {["left", "right"].map((side) => (
                    <React.Fragment key={side}>
                      <th className="cell-rank">
                        <IconMedal size="16" />
                      </th>
                      {columnCount < 3 && (
                        <th className="heading-cell-budrest">
                          <IconBudrest size="16" />
                        </th>
                      )}
                      <th>Nama</th>
                      {columnCount < 2 && <th>Klub</th>}
                      {columnCount < 2 && <th className="cell-numbers">X</th>}
                      {columnCount < 3 && <th className="cell-numbers">X+10</th>}
                      <th className="cell-total">Total</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              <tbody>
                {[1, 2, 3, 4, 5, ...(index === 1 ? [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] : [])].map(
                  (rank, rankIndex) => (
                    <tr key={rank}>
                      {["left", "right"].map((side) => (
                        <React.Fragment key={side}>
                          <td className="cell-rank">{rank}</td>
                          {columnCount < 3 && <td>{rank}A</td>}
                          <td>Nama Peserta Tata Tatata</td>
                          {columnCount < 2 && <td>Club On</td>}
                          {columnCount < 2 && <td className="cell-numbers">30</td>}
                          {columnCount < 3 && <td className="cell-numbers">20</td>}
                          <td className="cell-total">{400 - rankIndex}</td>
                        </React.Fragment>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </ScoreTable>
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

const ScoreTable = styled.table`
  tr {
    background-color: var(--ma-primary-blue-50);

    .cell-rank,
    .cell-numbers {
      text-align: center;
    }

    .cell-total {
      text-align: right;
    }
  }

  thead {
    color: var(--ma-txt-black);

    .heading-cell-men {
      text-align: center;
      background-color: var(--ma-primary-blue-100);
    }

    .heading-cell-women {
      text-align: center;
      background-color: var(--ma-primary-blue-200);
    }

    .heading-cell-budrest {
      color: var(--ma-text-negative);
    }
  }

  tbody tr {
    cursor: auto;

    &:nth-child(odd) {
      background-color: #ffffff;
    }
  }
`;

export default PageLiveScore;
