import React, {useState} from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col, Card, Media, CardBody, Button, NavItem, NavLink } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../assets/images/users/avatar-man.png"
import classnames from "classnames"
import CardActivity from "./CardActivity";


const H5 = styled.h5`
    font-size: 13px;
    line-height: 19px;
    color: #74788D;
    font-weight: normal;
`;

const DashboardOrderEvent = () => {

    const [activeTab, setActiveTab] = useState("1")
    const toggleTab = tab => {
        if (activeTab !== tab) {
        setActiveTab(tab)
        }
    }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Checkout Events | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />
 
        <Container fluid className="px-5 p-2">
            <Row>
              <Card>
                <CardBody>
                    <Media>
                        <div className="ms-3">
                        <img
                            src={Avatar}
                            alt=""
                            className="avatar-md rounded-circle img-thumbnail"
                        />
                        </div>
                        <Media body className="align-self-center">
                        
                        <H5 className="mx-5">Welcome to MyArchery.id dashboard</H5>
                        <div className="d-flex">
                            <div className="mx-5 text-muted">
                                <h4>John Doe</h4>
                                <H5>Klub FAST</H5>
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>No. Ponsel</h4>
                                <H5>+62 81234 56789</H5>
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>Email</h4>
                                <H5>nama@mail.com</H5>
                            </div>
                        </div>
                        </Media>
                          <Button
                              href="/full-day"
                              type="button"
                              size="sm"
                              style={{backgroundColor: "#0D47A1",  }}>
                              Setting
                          </Button>
                      </Media>
                  </CardBody>
              </Card>
            </Row>

            <Row>
                <Col sm={6}>
                    <CardActivity/>
                </Col>
                <Col sm={6}>
                    <Card>
                        <CardBody>
                            <Media>
                                <ul className="nav nav-tabs nav-tabs-custom">
                                <NavItem>
                                    <NavLink
                                    className={classnames({
                                        active: activeTab === "1",
                                    })}
                                    onClick={() => {
                                        toggleTab("1")
                                    }}
                                    >
                                    Cek Event
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                    className={classnames({
                                        active: activeTab === "2",
                                    })}
                                    onClick={() => {
                                        toggleTab("2")
                                    }}
                                    >
                                    On Going
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                    className={classnames({
                                        active: activeTab === "3",
                                    })}
                                    onClick={() => {
                                        toggleTab("3")
                                    }}
                                    >
                                    Attended
                                    </NavLink>
                                </NavItem>
                                </ul>
                            </Media>
                        </CardBody>
                    </Card>
                </Col>
               
            </Row>


        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default DashboardOrderEvent
