import * as React from "react";
import styled from "styled-components";

import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { DisplaySettings } from "./components/display-settings";
import { MenuSessionOptions } from "./components/menu-session-options";

import IconDot from "components/ma/icons/mono/dot";
import IconAlertTri from "components/ma/icons/mono/alert-triangle";
import IconBudrest from "components/ma/icons/mono/bud-rest";
import IconMedal from "components/ma/icons/fill/medal-gold.js";

import classnames from "classnames";
import { stringUtil } from "utils";

function PageLiveScore() {
  const [columns, setColumns] = React.useState([{ key: stringUtil.createRandom() }]);
  const [sessionNumber, setSessionNumber] = React.useState(0);

  return (
    <ContentLayoutWrapper pageTitle="Live Score">
      <SectionTop>
        <Header>
          <Infos>
            <div>Logo</div>
            <MainTitleContainer>
              <EventTitle>
                Judul Event Ini Panjang Anti Lorem Ipsum Lorem Ipsum Club Anti Lorem Ipsum Lorem
                Ipsum Club
              </EventTitle>
              <div>Kualifikasi</div>
            </MainTitleContainer>
          </Infos>

          <Settings>
            <MenuSessionOptions sessionCount={2} onSelect={(value) => setSessionNumber(value)}>
              <LabelLiveScore className={classnames({ "label-is-live": Boolean(sessionNumber) })}>
                {sessionNumber ? (
                  <React.Fragment>
                    <LiveScoreIndicator isLive />
                    <span>Live Score Kualifikasi Sesi {sessionNumber}</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <LiveScoreIndicator />
                    <span>Pilih Sesi Live Score</span>
                  </React.Fragment>
                )}
              </LabelLiveScore>
            </MenuSessionOptions>
            <DisplaySettings
              session={sessionNumber}
              onChangeSession={(value) => setSessionNumber(value)}
            />
          </Settings>
        </Header>
      </SectionTop>

      <ScoresGrid
        columns={columns}
        onRemoveColumn={(value) => {
          setColumns((columns) => {
            return columns.filter((column, index) => index !== value);
          });
        }}
      />
    </ContentLayoutWrapper>
  );
}

function LiveScoreIndicator({ isLive = false }) {
  return (
    <LiveScoreIndicatorWrapper className={classnames({ "indicator-is-live": isLive })}>
      <IconDot size="14" />
    </LiveScoreIndicatorWrapper>
  );
}

const gridColumnConfigs = {
  1: "1fr",
  2: "1fr 1fr",
  3: "1fr 1fr 1fr",
};

const colSpans = {
  1: 7,
  2: 5,
  3: 3,
};

function ScoresGrid({ columns = [] }) {
  const columnCount = columns.length;
  const gridConfig = gridColumnConfigs[columnCount];
  const teamColSpanConfig = colSpans[columnCount];
  return (
    <GridWrapper style={{ "--scores-grid-template-columns": gridConfig }}>
      {columns.map((column, index) => (
        <Column key={column.key}>
          {index === 1 ? (
            <TableContainer>
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
                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                    ...(index === 1 ? [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] : []),
                  ].map((rank, rankIndex) => (
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
                  ))}
                </tbody>
              </ScoreTable>
            </TableContainer>
          ) : (
            <TableEmptyContainer>
              <div>
                <div>
                  <IconAlertTri size="42" />
                </div>
                <p>Kategori belum dipilih</p>
                <p>(Debug: key {column.key})</p>
              </div>
            </TableEmptyContainer>
          )}
        </Column>
      ))}
    </GridWrapper>
  );
}

/* ========================= */
// styles

const SectionTop = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Infos = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--ma-gray-500);

  > *:nth-child(1) {
    flex-shrink: 0;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const MainTitleContainer = styled.div`
  max-width: 56.25rem;
`;

const EventTitle = styled.h1`
  margin: 0;
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Settings = styled.div`
  display: flex;
`;

const LabelLiveScore = styled.span`
  cursor: pointer;
  user-select: none;
  display: inline-block;
  min-height: 2.5rem;
  padding: 0.25rem 0.75rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  background-color: var(--ma-gray-200);

  color: var(--ma-gray-500);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;

  margin-right: 2px;

  > * + * {
    margin-left: 0.5rem;
  }

  &.label-is-live {
    color: var(--ma-blue);
  }
`;

const LiveScoreIndicatorWrapper = styled.span`
  color: var(--ma-gray-400);

  &.indicator-is-live {
    color: var(--ma-text-negative);
  }
`;

const GridWrapper = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: var(--scores-grid-template-columns, 1fr);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;

  > *:nth-child(1) {
    flex-shrink: 1;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const TableEmptyContainer = styled.div`
  border-radius: 0.25rem;
  background-color: var(--ma-gray-100);
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    > * + * {
      margin-top: 0.5rem;
    }

    text-align: center;
    color: var(--ma-gray-400);
  }
`;

const TableContainer = styled.div`
  border-radius: 0.25rem;
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
