import * as React from "react";
import styled from "styled-components";
import { useDisplaySettings } from "../contexts/display-settings";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import IconDot from "components/ma/icons/mono/dot";

function MenuRoundOptions({ children, disabled }) {
  const [isOpen, setOpen] = React.useState(false);
  const { roundOptions, round, setRound } = useDisplaySettings();

  if (disabled) {
    return <div>{children}</div>;
  }
  return (
    <div>
      <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
        <DropdownToggle tag="div">{children}</DropdownToggle>

        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem header>Pilih babak yang ditampilkan</DropdownItem>
          {!roundOptions?.length ? (
            <DropdownItem>
              <ItemActionWrapper>
                <span>Babak tidak tersedia</span>
                <span></span>
              </ItemActionWrapper>
            </DropdownItem>
          ) : (
            roundOptions.map((optionRound, optionIndex) => (
              <DropdownItem key={optionRound} onClick={() => setRound(optionIndex)}>
                <ItemActionWrapper>
                  <span>{optionRound}</span>
                  {optionIndex === round && (
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

export { MenuRoundOptions };
