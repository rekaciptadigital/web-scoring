import * as React from "react";
import styled from "styled-components";

import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { Tutorial } from "./components/tutorial";

import IconDot from "components/ma/icons/mono/dot";
import IconPlus from "components/ma/icons/mono/plus";
import IconAlertTri from "components/ma/icons/mono/alert-triangle";
import IconBudrest from "components/ma/icons/mono/bud-rest";
import IconMedal from "components/ma/icons/fill/medal-gold.js";

import classnames from "classnames";
import { stringUtil } from "utils";

function PageLiveScore() {
  const [columns, setColumns] = React.useState([{ key: stringUtil.createRandom() }]);
  const columnCount = columns.length;
  const addColumn = () => {
    setColumns((columns) => {
      const newColumn = { key: stringUtil.createRandom() };
      return [...columns, newColumn];
    });
  };
  return (
    <ContentLayoutWrapper pageTitle="Live Score">
      <SectionTop>
        <Tutorial isOpen={false} />
        <Header>
          <Infos>
            <div>Logo</div>
            <div>
              <EventTitle>Judul Event Ini Panjang Anti Lorem Ipsum Lorem Ipsum Club</EventTitle>
              <div>Kualifikasi</div>
            </div>
          </Infos>
          <div>
            <LabelLiveScore>
              <LiveScoreIndicator />
              <span>Live Score Kualifikasi Sesi 1/2/3/4/5 (?)</span>
            </LabelLiveScore>
          </div>
        </Header>
        <ActionBar>
          <div>
            <ButtonBlue disabled={columnCount >= 3} onClick={addColumn}>
              <IconPlus size="16" /> Tambah Kategori
            </ButtonBlue>
          </div>
        </ActionBar>
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

function LiveScoreIndicator() {
  return (
    <LiveScoreIndicatorWrapper>
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
  1: 6,
  2: 5,
  3: 3,
};

function ScoresGrid({ columns = [], onRemoveColumn }) {
  const columnCount = columns.length;
  const gridConfig = gridColumnConfigs[columnCount];
  const teamColSpanConfig = colSpans[columnCount];
  return (
    <GridWrapper style={{ "--scores-grid-template-columns": gridConfig }}>
      {columns.map((column, index) => (
        <Column key={column.key}>
          <div>
            <label htmlFor="team">Jenis Regu</label>
            <br />
            <select id="team" placeholder="Pilih Jenis Regu" value="" readOnly>
              <option value="i">Individu</option>
              <option value="t">Beregu</option>
              <option value="tm">Beregu Campuran</option>
            </select>

            <input placeholder="Cari Kategori" />

            <ButtonOutlineBlue
              flexible
              disabled={columnCount <= 1}
              onClick={() => onRemoveColumn?.(index)}
            >
              -
            </ButtonOutlineBlue>
          </div>

          {index === 0 || index === 1 ? (
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
                        {columnCount < 2 && <th>X</th>}
                        {columnCount < 3 && <th>X+10</th>}
                        <th>Total</th>
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
                  ].map((rank) => (
                    <tr key={rank}>
                      {["left", "right"].map((side) => (
                        <React.Fragment key={side}>
                          <td className="cell-rank">{rank}</td>
                          {columnCount < 3 && <td>{rank}A</td>}
                          <td>kolom 2</td>
                          {columnCount < 2 && <td>30</td>}
                          {columnCount < 3 && <td>20</td>}
                          <td>400</td>
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

const EventTitle = styled.h1`
  margin: 0;
  color: var(--ma-blue);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const LabelLiveScore = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-200);

  color: var(--ma-blue);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;

  > * + * {
    margin-left: 0.5rem;
  }
`;

const LiveScoreIndicatorWrapper = styled.span`
  color: var(--ma-text-negative);
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
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

    .cell-rank {
      text-align: center;
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
