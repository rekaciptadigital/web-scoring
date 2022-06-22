import * as React from "react";
import styled from "styled-components";

import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";

import IconHome from "components/ma/icons/mono/home";
import IconBudRest from "components/ma/icons/mono/bud-rest";
// import IconUser from "components/ma/icons/mono/user";
import IconHelpCircle from "components/ma/icons/mono/help-circle";
import IconCard from "components/ma/icons/mono/card";
import IconUser from "components/ma/icons/mono/user";

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
            <NavLinkItem to={`/dashboard/event/${eventId}/budrests`}>
              <span>
                <IconBudRest size="16" />
              </span>
              <span>Bantalan</span>
            </NavLinkItem>
          </li>

          <li>
            <NavLinkItem to={`/dashboard/event/${eventId}/faqs`}>
              <span>
                <IconHelpCircle size="16" />
              </span>
              <span>FAQ</span>
            </NavLinkItem>
          </li>
          
          <li>
            <NavLinkItem to={`/dashboard/event/${eventId}/official`}>
              <span>
                <IconUser size="16" />
              </span>
              <span>Official</span>
            </NavLinkItem>
          </li>

          <li>
            <NavLinkItem to={`/dashboard/event/${eventId}/id-card`}>
              <span>
                <IconCard size="16" />
              </span>
              <span>ID Card</span>
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
