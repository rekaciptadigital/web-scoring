import * as React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import IconAdd from "components/icons/EventAdd";

const EventAddCardWrapper = styled.div`
  position: relative;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 240px;
  border-radius: 8px;
  border: dashed 2px var(--ma-gray-400);

  background-color: #ffffff;
  transition: all 0.4s;

  .svg-icon-path {
    stroke: var(--ma-gray-400);
  }

  .action-button {
    &::before {
      content: " ";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .action-icon {
      transform: translateY(1em);
      transition: transform 0.4s;

      .svg-icon-path {
        transition: stroke 0.4s;
      }
    }

    .action-label {
      color: var(--ma-blue);
      opacity: 0;
      transition: opacity 0.4s;
    }
  }

  &:hover {
    border: dashed 2px var(--ma-blue);

    .action-icon {
      transform: translateY(0);

      .svg-icon-path {
        stroke: var(--ma-blue);
      }
    }

    .action-label {
      opacity: 1;
    }
  }
`;

export default function EventAddCard({ href, style }) {
  return (
    <EventAddCardWrapper style={style}>
      <Link className="action-button" to={href}>
        <span className="action-icon">
          <IconAdd />
        </span>
        <span className="action-label">Tambah Event</span>
      </Link>
    </EventAddCardWrapper>
  );
}
