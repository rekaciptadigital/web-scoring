import * as React from "react";
import styled from "styled-components";
import { useParams, NavLink } from "react-router-dom";

import IconScoreboard from "components/ma/icons/mono/scoreboard";
import IconBranch from "components/ma/icons/mono/branch";
import IconMedal from "components/ma/icons/mono/medal";
import IconTrophy from "components/ma/icons/mono/trophy";

function SideBar() {
  const { event_id } = useParams();
  return (
    <SideBarWrapper>
      <MenuContainer>
        <MenuWrapper>
          <li>
            <MenuItem to={`/dashboard/event/${event_id}/dos-qualification`}>
              <div>
                <IconScoreboard />
              </div>
              <div>Kualifikasi</div>
            </MenuItem>
          </li>

          <li>
            <MenuItem to={`/dashboard/event/${event_id}/dos-elimination`}>
              <div>
                <IconBranch />
              </div>
              <div>Eliminasi</div>
            </MenuItem>
          </li>

          <li>
            <MenuItem to={`/dashboard/event/${event_id}/dos-winners`}>
              <div>
                <IconMedal />
              </div>
              <div>Pemenang Kategori</div>
            </MenuItem>
          </li>

          <li>
            <MenuItem to={`/dashboard/event/${event_id}/dos-medals-by-club`}>
              <div>
                <IconTrophy />
              </div>
              <div>Medali Klub</div>
            </MenuItem>
          </li>
        </MenuWrapper>
      </MenuContainer>
    </SideBarWrapper>
  );
}

/* ================================== */
// styles

const SideBarWrapper = styled.div`
  width: 7.5rem;
  background-color: #ffffff;
`;

const MenuContainer = styled.div`
  position: sticky;
  top: var(--ma-header-height);
`;

const MenuWrapper = styled.ul`
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--ma-blue);
  font-weight: 600;
  text-align: center;

  &:hover {
    color: var(--ma-blue);
    background-color: var(--ma-primary-blue-50);
  }

  &.active {
    position: relative;
    background-color: var(--ma-primary-blue-50);
    color: #ffffff;
    color: var(--ma-blue);
    font-weight: 600;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 0.5rem;
      background-color: var(--ma-blue);
    }
  }
`;

export { SideBar };
