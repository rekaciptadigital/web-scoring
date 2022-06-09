import * as React from "react";
import styled from "styled-components";

import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";

import IconHome from "components/ma/icons/mono/home";
import IconBudRest from "components/ma/icons/mono/bud-rest";

function SubNavbar({ eventId }) {
  return (
    <StyledSubNavbar>
      <Container fluid>
        <ul className="subnavbar">
          <li>
            <NavLinkItem to={`/dashboard/event/${eventId}/home`}>
              <span>
                <IconHome size="16" />
              </span>
              <span>Dashboard</span>
            </NavLinkItem>
          </li>

          <li>
            <NavLinkItem to={`/dashboard/event/${eventId}/reports`}>
              <span>
                <IconBudRest size="16" />
              </span>
              <span>Laporan</span>
            </NavLinkItem>
          </li>
        </ul>
      </Container>
    </StyledSubNavbar>
  );
}

const StyledSubNavbar = styled.div`
  background-color: var(--ma-blue);

  .subnavbar {
    display: flex;
    justify-content: flex-start;
    gap: 3rem;

    list-style: none;
    padding: 0.625rem 0;
  }
`;

const NavLinkItem = styled(NavLink)`
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: #ffffff;

  > span {
    display: inline-block;
  }

  > * + * {
    margin-left: 0.5rem;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.25);
    color: #ffffff;
  }
`;

export { SubNavbar };
