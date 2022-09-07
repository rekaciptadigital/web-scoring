import * as React from "react";
import styled from "styled-components";

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { ButtonOutlineBlue } from "components/ma";

import IconDownload from "components/ma/icons/mono/download";
import IconMenu from "components/ma/icons/mono/menu";

function ScoresheetMenus({ label = "", options = [], displayAsButtonList = false }) {
  const [isOpen, setOpen] = React.useState(false);

  if (displayAsButtonList) {
    return (
      <ButtonList>
        {options?.map((option, index) => (
          <ButtonOutlineBlue key={option.value || index} tag="button" onClick={option.onClick}>
            <DropdownTriggerWrapper>
              <span>{option.label}</span>
            </DropdownTriggerWrapper>
          </ButtonOutlineBlue>
        ))}
      </ButtonList>
    );
  }

  return (
    <Dropdown isOpen={isOpen} toggle={() => setOpen((open) => !open)}>
      <DropdownToggle tag="span">
        <ButtonOutlineBlue>
          <DropdownTriggerWrapper>
            <span>{label}</span>
            <span>
              <IconMenu size="16" />
            </span>
          </DropdownTriggerWrapper>
        </ButtonOutlineBlue>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        {options?.map((option, index) => (
          <DropdownItem key={option.value || index} tag="button" onClick={option.onClick}>
            <DropdownItemWrapper>
              <span>{option.label}</span>
              <span>
                <IconDownload size="16" />
              </span>
            </DropdownItemWrapper>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

/* ============================ */
// styles

const ButtonList = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

const DropdownTriggerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }
  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const DropdownItemWrapper = styled.div`
  min-width: 10rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }
  > *:nth-child(2) {
    flex-shrink: 0;
    color: var(--ma-blue);
  }
`;

export { ScoresheetMenus };
