import * as React from "react";
import styled from "styled-components";

import IconSearch from "components/ma/icons/mono/search";

function SearchBox(props) {
  return (
    <SearchBoxWrapper>
      <InputSearch {...props} id="search-box-input" type="text" />
      <IconWrapper htmlFor="search-box-input">
        <IconSearch size="16" />
      </IconWrapper>
    </SearchBoxWrapper>
  );
}

const SearchBoxWrapper = styled.div`
  position: relative;
`;

const InputSearch = styled.input`
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #6a7187;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;

  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &::placeholder {
    color: #6a7187;
    opacity: 0.6;
  }

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }

  &:disabled,
  &[readonly] {
    background-color: #eff2f7;
    opacity: 1;
  }

  &.error-invalid {
    border-color: var(--ma-red);
  }
`;

const IconWrapper = styled.label`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  margin: 0.25rem;
  border-radius: 0.375rem;
  background-color: var(--ma-primary-blue-50);
  color: var(--ma-blue);
`;

export { SearchBox };
