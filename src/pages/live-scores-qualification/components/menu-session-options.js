import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../contexts/display-settings";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import IconDot from "components/ma/icons/mono/dot";

function MenuSessionOptions({ children, disabled }) {
  const [isOpen, setOpen] = React.useState(false);
  const { maxSessionCount, sessionNumber, setSessionNumber } = useDisplaySettings();
  const sessionNumbers = React.useMemo(() => _makeOptions(maxSessionCount), [maxSessionCount]);

  if (disabled) {
    return <div>{children}</div>;
  }
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
            sessionNumbers.map((optionSessionNumber) => (
              <DropdownItem
                key={optionSessionNumber}
                onClick={() => setSessionNumber(optionSessionNumber)}
              >
                <ItemActionWrapper>
                  {optionSessionNumber > 0 ? (
                    <span>Sesi {optionSessionNumber}</span>
                  ) : (
                    <span>Semua sesi</span>
                  )}
                  {optionSessionNumber === sessionNumber && (
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

function _makeOptions(count) {
  if (!count) {
    return [];
  }
  const arrayFromCount = [...new Array(count)];
  const sessionNumbers = arrayFromCount.map((item, index) => index + 1);
  return [...sessionNumbers, 0];
}

export { MenuSessionOptions };
