import * as React from "react";
import styled from "styled-components";

import { Container } from "reactstrap";

const StyledFooter = styled.footer`
  height: 60px;
  background-color: var(--ma-blue-50);
`;

const copyRightYear = new Date().getFullYear();

function Footer() {
  return (
    <StyledFooter className="mt-auto">
      <Container fluid>
        <div
          className="text-center d-flex align-items-center justify-content-center"
          style={{ height: 60 }}
        >
          {copyRightYear} &copy; MyArchery. Designed &amp; Developed by Reka Cipta Digital
        </div>
      </Container>
    </StyledFooter>
  );
}

export default Footer;
