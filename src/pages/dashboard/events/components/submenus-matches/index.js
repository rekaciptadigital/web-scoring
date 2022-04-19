import * as React from "react";
import styled from "styled-components";
import { useParams, NavLink } from "react-router-dom";

import { Container } from "reactstrap";

import IconHome from "components/ma/icons/mono/home";
import IconBudRest from "components/ma/icons/mono/bud-rest";
import IconHelpCircle from "components/ma/icons/mono/help-circle";
import IconFile from "components/ma/icons/mono/file";

function SubNavbar() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
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
            <NavLinkItem to={`/dashboard/event/${eventId}/scoring-qualification`}>
              <span>
                <IconBudRest size="16" />
              </span>
              <span>Skoring Kualifikasi</span>
            </NavLinkItem>
          </li>

          <li>
            {/* TODO: hapus as="span" kalau mau dipakai */}
            <NavLinkItem as="span" to={`/dashboard/event/${eventId}/scoring-elimination`}>
              <span>
                <IconBudRest size="16" />
              </span>
              <span>Skoring Eliminasi</span>
            </NavLinkItem>
          </li>

          <li>
            {/* TODO: hapus as="span" kalau mau dipakai */}
            <NavLinkItem as="span" to={`/dashboard/event/${eventId}/documents`}>
              <span>
                <IconFile size="16" />
              </span>
              <span>Dokumen</span>
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
