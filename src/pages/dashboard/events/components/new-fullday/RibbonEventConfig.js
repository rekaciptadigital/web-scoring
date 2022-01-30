import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ButtonSmallOutlineBlue } from "components/ma";
import Panah from "components/icons/Panah";
import Calendar from "components/icons/Calendar";

const RibbonWrapper = styled.div`
  position: relative;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 60px;
  background-color: #ffffff;

  .ribbon-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .ribbon-config-list {
      list-style: none;
      padding: 0;
      margin: 0;

      display: flex;

      .ribbon-config-item {
        padding: 8px;
        margin-right: 8px;
      }
    }
  }
`;

export function RibbonEventConfig() {
  return (
    <RibbonWrapper>
      <div className="ribbon-container">
        <ul className="ribbon-config-list">
          <li className="ribbon-config-item">
            <span className="me-2">
              <Calendar />
            </span>
            <strong>Jenis Waktu</strong>
            <span className="ms-2">Full Day</span>
          </li>

          <li className="ribbon-config-item">
            <span className="me-2">
              <Panah />
            </span>
            <strong>Jenis Pertandingan</strong>
            <span className="ms-2">Turnamen</span>
          </li>
        </ul>

        <div className="ms-3">
          <ButtonSmallOutlineBlue as={Link} to="/dashboard/events/new/prepare">
            Ubah
          </ButtonSmallOutlineBlue>
        </div>
      </div>
    </RibbonWrapper>
  );
}
