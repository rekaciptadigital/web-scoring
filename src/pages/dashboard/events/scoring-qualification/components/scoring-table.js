import * as React from "react";
import styled from "styled-components";

import { ButtonGhostBlue } from "components/ma";

import IconChevronLeft from "components/ma/icons/mono/chevron-left";
import IconChevronRight from "components/ma/icons/mono/chevron-right";
import IconX from "components/ma/icons/mono/x";

import classnames from "classnames";

function ScoringTable() {
  const [indexActiveItem, setIndexActiveItem] = React.useState(null);
  const isItemActive = (index) => indexActiveItem === index;
  const showEditor = indexActiveItem !== null;
  return (
    <TableContainer>
      <div style={{ outline: "dashed 1px red" }}>
        <table className="table table-responsive">
          <thead>
            <tr>
              <td>Bantalan</td>
              <td>Peringkat</td>
              <td>Nama Peserta</td>
              <td>Nama Klub</td>
              {!showEditor && <td>Sesi 1</td>}
              {!showEditor && <td>Sesi 2</td>}
              <td>Total</td>
              {!showEditor && <td>X</td>}
              {!showEditor && <td>X+10</td>}
              <td>ellipsis</td>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((id, index) => (
              <tr key={id} className={classnames({ "row-active": isItemActive(index) })}>
                <td>1A</td>
                <td>10</td>
                <td>John Doe</td>
                <td>Jakarta Jaya</td>
                {!showEditor && <td>82</td>}
                {!showEditor && <td>82</td>}
                <td>164</td>
                {!showEditor && <td>8</td>}
                {!showEditor && <td>10</td>}
                <td>
                  {isItemActive(index) ? (
                    <ButtonGhostBlue flexible onClick={() => setIndexActiveItem(null)}>
                      <IconChevronLeft size="16" />
                    </ButtonGhostBlue>
                  ) : (
                    <ButtonGhostBlue flexible onClick={() => setIndexActiveItem(index)}>
                      <IconChevronRight size="16" />
                    </ButtonGhostBlue>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditor && (
        <div style={{ outline: "dashed 1px green" }} key={indexActiveItem}>
          <h1>Active Row Identity: {indexActiveItem}</h1>

          <div>
            <ul>
              <li>50m</li>
              <li>40m</li>
              <li>30m </li>
            </ul>

            <div>
              <div>Akumulasi Skor: 360</div>
              <div>
                <ButtonGhostBlue flexible onClick={() => setIndexActiveItem(null)}>
                  <IconX size="16" />
                </ButtonGhostBlue>
              </div>
            </div>
          </div>

          <table className="table table-responsive">
            <thead>
              <tr>
                <td>End</td>
                <td colSpan="6">Shot</td>
                <td>Total</td>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5, 6].map((id, indexRambahan) => (
                <tr key={id}>
                  <td>{indexRambahan + 1}</td>

                  {[1, 2, 3, 4, 5, 6].map((id, indexShot) => (
                    <td key={id}>
                      <select
                        name={`shot-score-${indexRambahan}-${indexShot}`}
                        id={`shot-score-${indexRambahan}-${indexShot}`}
                        defaultValue={""}
                        onChange={(ev) => alert(`Simpan nilai jadi ${ev.target.value}`)}
                      >
                        <option value="" disabled>
                          &ndash;
                        </option>
                        {["m", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "x"].map((value) => (
                          <option key={value} value={value}>
                            {isNaN(value) ? value.toUpperCase() : value}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}

                  <td>60</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>Total: 360</div>
        </div>
      )}
    </TableContainer>
  );
}

const TableContainer = styled.div`
  outline: dashed 1px yellow;
  display: flex;

  > *:first-child {
    flex-grow: 1;
  }

  > *:last-child {
    flex-shrink: 0;
  }

  .row-active {
    background-color: var(--ma-gray-100);
    transition: all 0.15s;
  }
`;

export { ScoringTable };
