import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../contexts/display-settings";

import classnames from "classnames";

function TeamFilterIndicator() {
  const { teamOptions, activeTeam } = useDisplaySettings();

  if (!teamOptions?.length) {
    return null;
  }

  return (
    <Container>
      {teamOptions?.map((option) => (
        <ButtonIndicator
          key={option.id}
          className={classnames({ "filter-selected": activeTeam === option.id })}
        >
          {option.label}
        </ButtonIndicator>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.625rem;
`;

const ButtonIndicator = styled.span`
  user-select: none;
  padding: 0.5rem 0.75rem;
  border: solid 1px var(--ma-primary-blue-50);
  border-radius: 0.25rem;
  background-color: var(--ma-primary-blue-50);
  color: var(--ma-blue);
  font-size: 0.75em;
  font-weight: 500;

  white-space: nowrap;
  transition: border-color 0.1s, background-color 0.1s;

  &.filter-selected {
    border: solid 1px var(--ma-secondary);
    background-color: var(--ma-secondary);
  }
`;

export { TeamFilterIndicator };
