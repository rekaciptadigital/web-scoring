import * as React from "react";
import styled from "styled-components";
import { useParams, NavLink } from "react-router-dom";

import { Container } from "reactstrap";

import IconHome from "components/ma/icons/mono/home";
import IconBudRest from "components/ma/icons/mono/bud-rest";
import IconFile from "components/ma/icons/mono/file";

const _makeMenus = (eventId, isSelectionType) => {
  const commonMenus = [
    {
      url: `/dashboard/event/${eventId}/home`,
      label: "Dashboard",
      icon: IconHome,
    },
    {
      url: `/dashboard/event/${eventId}/scoring-qualification`,
      label: "Skoring Kualifikasi",
      icon: IconBudRest,
    },
    {
      url: `/dashboard/event/${eventId}/scoring-elimination`,
      label: "Skoring Eliminasi",
      icon: IconBudRest,
    },
  ];

  if (!isSelectionType) {
    return [
      ...commonMenus,
      {
        url: `/dashboard/event/${eventId}/doc`,
        label: "Dokumen",
        icon: IconFile,
      },
    ];
  }
  return [
    ...commonMenus,
    {
      url: `/dashboard/event/${eventId}/selection-result`,
      label: "Hasil Akhir",
      icon: IconFile,
    },
  ];
};

function SubNavbar({ isSelectionType }) {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const menuItems = _makeMenus(eventId, isSelectionType);

  return (
    <StyledSubNavbar>
      <Container fluid>
        <ul className="subnavbar">
          {menuItems.map((menu, index) => (
            <li key={index}>
              <NavLinkItem to={menu.url}>
                <span>
                  <menu.icon size="16" />
                </span>
                <span>{menu.label}</span>
              </NavLinkItem>
            </li>
          ))}
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
