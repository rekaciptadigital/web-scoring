import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
// import { Button } from "components/ma";

// import IconDownload from "components/ma/icons/mono/download";
import IconMoreVertical from "components/ma/icons/fill/more-vertical";
import IconTrash from "components/ma/icons/mono/trash";
import IconEdit from "components/ma/icons/mono/eye";

function ButtonMoreMenu({ event }) {
  const [isOpen, setOpen] = React.useState(false);

  console.log(event)

  return (
    <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
      <DropdownToggle tag="div">
        <IconMoreVertical />
      </DropdownToggle>

      <DropdownMenu right>
        <DropdownItem>
          <ItemActionWrapper>
            <span>{event ? 'Jadikan draft' : 'Publikasi Event'}</span>
            <span>
              <IconEdit size="16" />
            </span>
          </ItemActionWrapper>
        </DropdownItem>
        <DropdownItem disabled={event}>
          <ItemActionWrapper>
            <span>Hapus Event</span>
            <span>
              <IconTrash size="16" disabled />
            </span>
          </ItemActionWrapper>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

const ItemActionWrapper = styled.div`
  min-width: 10rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }
  > *:nth-child(2) {
    flex-shrink: 0;
    color: var(--ma-blue);
  }
`;

export { ButtonMoreMenu };
