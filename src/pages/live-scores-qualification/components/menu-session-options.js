import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import IconDot from "components/ma/icons/mono/dot";

function MenuSessionOptions({
  children,
  sessionNumber: activeSessionNumber,
  sessionCount,
  onSelect,
}) {
  const [isOpen, setOpen] = React.useState(false);

  const sessionNumbers = React.useMemo(() => {
    if (!sessionCount) {
      return [];
    }
    return [...[...new Array(sessionCount)].map((item, index) => index + 1), 0];
  }, [sessionCount]);

  return (
    <div>
      <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
        <DropdownToggle tag="div">{children}</DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem header>Pilih sesi yang ditampilkan</DropdownItem>
          {!sessionNumbers?.length ? (
            <DropdownItem>
              <ItemActionWrapper>
                <span>Tidak tersedia sesi</span>
                <span></span>
              </ItemActionWrapper>
            </DropdownItem>
          ) : (
            sessionNumbers.map((sessionNumber) => (
              <DropdownItem key={sessionNumber} onClick={() => onSelect?.(sessionNumber)}>
                <ItemActionWrapper>
                  {sessionNumber > 0 ? <span>Sesi {sessionNumber}</span> : <span>Semua sesi</span>}
                  {sessionNumber === activeSessionNumber && (
                    <span>
                      <IconDot size="8" />
                    </span>
                  )}
                </ItemActionWrapper>
              </DropdownItem>
            ))
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
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
    color: var(--ma-field-focused);
  }
`;

export { MenuSessionOptions };
