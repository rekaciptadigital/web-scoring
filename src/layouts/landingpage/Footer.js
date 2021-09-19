import React from "react"
import { Container, Row, Col } from "reactstrap"
import logoblack from "../../assets/images/myachery/myachery.png"
import styled from "styled-components"

// const LabelFooter = styled.label`
//     font-family: Poppins;
//     font-style: normal;
//     font-weight: 500;
//     font-size: 16px;
//     line-height: 140%;
//     color: #495057;
//     padding-right: 5px;
// `;

const FooterTag = styled.footer`
  position: absolute;
  background-color: #f2f2f5;
  width: 100%;
`;


const Footer = () => {
  return (
    <React.Fragment>
      <FooterTag>
        <Container fluid={true}>
          {/* <Row className="mt-4">
            <Col md={12}>
              <div className="text-sm-center d-none d-sm-block">
                <LabelFooter>Require Assistance?</LabelFooter>
                    <i className="far fa-lg fa-envelope px-1"/>
                    <i className="fab fa-lg fa-whatsapp px-1"/>
                    <i className="fab fa-lg fa-facebook px-1"/>
                    <i className="fab fa-lg fa-linkedin px-1"/>
              </div>
            </Col>
          </Row> */}
          <Row className="text-center">
            <Col md={12}>
                <img
                src={logoblack}
                alt=""
                height="63"
                width="91"
              />
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={12}>
                {/* <p className="font-size-14">
                    {new Date().getFullYear()} © Skote. Design & Develop by Reka Cipta Digital
                </p> */}
                
                </Col>
          </Row>
        </Container>
      </FooterTag>
    </React.Fragment>
  )
}

export default Footer
