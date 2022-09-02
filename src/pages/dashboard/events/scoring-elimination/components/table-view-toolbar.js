import * as React from "react";
import styled from "styled-components";

import classnames from "classnames";

function TableViewToolbar({ rounds, selectedTab, onChangeTab, viewRight }) {
  const tabsProps = {
    labels: _getTabLabels(rounds),
    currentTab: selectedTab,
    onChange: onChangeTab,
  };

  if (!viewRight) {
    return (
      <div>
        <StagesTabs {...tabsProps} />
      </div>
    );
  }

  return (
    <TableViewToolbarWrapper>
      <StagesTabs {...tabsProps} />
      {viewRight}
    </TableViewToolbarWrapper>
  );
}

function StagesTabs({ labels, currentTab, onChange }) {
  return (
    <StagesBarContainer>
      <StageTabsList>
        {labels.map((label, index) => (
          <li key={label}>
            <StageTabButton
              className={classnames({ "session-tab-active": index === currentTab })}
              onClick={() => onChange(index)}
            >
              <span>{label}</span>
            </StageTabButton>
          </li>
        ))}
      </StageTabsList>
    </StagesBarContainer>
  );
}

/* ============================ */
// styles

const TableViewToolbarWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
    padding: 0 1.5rem;
  }
`;

const StagesBarContainer = styled.div`
  padding: 1rem;
`;

const StageTabsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  gap: 0.5rem;
`;

const StageTabButton = styled.button`
  display: block;
  border: none;
  padding: 0 0.5rem;
  background-color: transparent;

  min-width: 6rem;
  color: var(--ma-gray-400);
  font-size: 0.875rem;
  font-weight: 600;

  transition: all 0.15s;

  > span {
    display: block;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 0.25rem 0;

    &::before {
      content: " ";
      position: absolute;
      height: 2px;
      top: 0;
      left: 0;
      width: 1.5rem;
      background-color: transparent;
      transition: all 0.3s;
      transform: scaleX(0);
      transform-origin: left;
    }
  }

  &:hover {
    color: var(--ma-blue);
  }

  &.session-tab-active {
    color: var(--ma-blue);

    > span {
      &::before {
        background-color: #90aad4;
        transform: scaleX(1);
      }
    }
  }
`;

/* =========================== */
// utils

function _getTabLabels(bracketTemplate) {
  if (!bracketTemplate) {
    return [];
  }

  const tabLabels = {
    16: "32 Besar",
    8: "16 Besar",
    4: "8 Besar",
    2: "Semi-Final",
  };

  let finalHasTaken = false;
  const labels = bracketTemplate.map((round) => {
    const matchCount = round.seeds.length;
    if (matchCount > 1) {
      return tabLabels[matchCount];
    }
    if (!finalHasTaken) {
      finalHasTaken = true;
      return "Final";
    }
    return "3rd Place";
  });

  return labels;
}

export { TableViewToolbar };
