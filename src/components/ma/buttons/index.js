import styled from "styled-components";

import { Button } from "reactstrap";

export const ButtonBlue = styled(Button)`
  &,
  &:focus,
  &:active {
    background-color: var(--ma-blue);
    border: solid 1px var(--ma-blue);
    color: #ffffff;
    box-shadow: none;
  }

  &:hover {
    background-color: #0f53bb;
    border: solid 1px #0f53bb;
  }
`;

export const ButtonBlueOutline = styled(Button)`
  &,
  &:focus,
  &:active {
    background-color: #ffffff;
    border: solid 1px var(--ma-blue);
    border-radius: 2rem;
    color: var(--ma-blue) !important;
    box-shadow: none;
  }

  &:hover {
    background-color: var(--ma-blue);
    color: #ffffff !important;
  }
`;

export const ButtonRed = styled(Button)`
  &,
  &:focus,
  &:active {
    background-color: var(--ma-red);
    border: solid 1px var(--ma-red);
    color: #ffffff;
    box-shadow: none;
  }

  &:hover {
    background-color: #cf1730;
    border: solid 1px #cf1730;
  }
`;
