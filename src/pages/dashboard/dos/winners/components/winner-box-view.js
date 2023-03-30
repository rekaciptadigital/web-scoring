import * as React from "react";
import styled from "styled-components";

import IconMedalGold from "components/ma/icons/fill/medal-gold";
import IconMedalSilver from "components/ma/icons/fill/medal-silver";
import IconMedalBronze from "components/ma/icons/fill/medal-bronze";

function WinnerBoxView({ title, data, eventDetail }) {
  const rowsGroupByCategory = React.useMemo(() => _makeRowData(data), [data]);

  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return "Kontingen";
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (!rowsGroupByCategory?.length) {
    return (
      <WinnerBox>
        <WinnerTableHeading>{title}</WinnerTableHeading>
        <div>Tidak ada data</div>
      </WinnerBox>
    );
  }

  return (
    <WinnerBox>
      <WinnerTableHeading>{title}</WinnerTableHeading>
      <WinnerTable className="table table-responsive">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Medali</th>
            <th className="name">Nama</th>
            <th className="name">
              {capitalizeFirstLetter(eventDetail.parentClassificationTitle)}
              {/* {!eventDetail.withContingent ? "Klub" : "Kontingen"}{" "} */}
            </th>
          </tr>
        </thead>

        <tbody>
          {rowsGroupByCategory.map((group) => {
            return group.rows.map((row, index) => {
              return (
                <tr key={index}>
                  {index === 0 && (
                    <CategoryCell className="name" rowSpan={group.length}>
                      {row.categoryLabel}
                    </CategoryCell>
                  )}

                  <td>
                    <span title={"Juara " + row.rank}>
                      <Medal rank={row.rank} />
                    </span>
                  </td>

                  <td className="name">{row.winnerName}</td>
                  {/* {!eventDetail.withContingent ? (
                    <td className="name">{row.clubName} suk</td>
                  ) : (
                    <td className="name">{row.cityName} suk</td>
                  )} */}
                  {row.parentClassification === 1 ? (
                    <td className="name">{row.clubName}</td>
                  ) : row.parentClassification === 2 ? (
                    <td className="name">{row.countryName}</td>
                  ) : row.parentClassification === 3 ? (
                    <td className="name">{row.provinceName}</td>
                  ) : row.parentClassification === 4 ? (
                    <td className="name">{row.cityName}</td>
                  ) : (
                    <td className="name">{row.childrenClassificationName}</td>
                  )}
                </tr>
              );
            });
          })}
        </tbody>
      </WinnerTable>
    </WinnerBox>
  );
}

function Medal({ rank }) {
  const medals = {
    1: <IconMedalGold size="20" />,
    2: <IconMedalSilver size="20" />,
    3: <IconMedalBronze size="20" />,
  };
  return medals[rank] || rank || null;
}

/* =============================== */
// styles

const WinnerBox = styled.div`
  padding: 0.5rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.25rem;
  background-color: #ffffff;
`;

const WinnerTableHeading = styled.h6`
  color: var(--ma-txt-black);
  font-weight: 600;
  text-align: center;
`;

const WinnerTable = styled.table`
  text-align: center;

  thead {
    background-color: var(--ma-primary-blue-50);

    th {
      color: var(--ma-txt-black);
      font-weight: 600;

      &.name {
        text-align: left;
      }
    }
  }

  tbody td {
    vertical-align: middle;

    &.name {
      text-align: left;
    }
  }

  th,
  td {
    cursor: auto;
  }
`;

const CategoryCell = styled.td`
  border-right-width: 1px;
`;

/* =============================== */
// utils

function _makeRowData(data) {
  if (!data?.length) {
    return [];
  }

  const groupByCategoryId = {};

  for (const row of data) {
    groupByCategoryId[row.categoryId] = groupByCategoryId[row.categoryId] || [];
    groupByCategoryId[row.categoryId].push(row);
  }

  const groupedRows = Object.keys(groupByCategoryId).map((category) => ({
    length: groupByCategoryId[category].length,
    rows: groupByCategoryId[category],
  }));

  return groupedRows;
}

export { WinnerBoxView };
