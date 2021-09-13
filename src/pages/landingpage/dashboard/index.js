import React, {useEffect, useState} from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col, Card, Media, CardBody, Button } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../assets/images/users/avatar-man.png"
import { OrderEventService } from "services";
// import classnames from "classnames"
// import CardActivity from "./CardActivity";

const H5 = styled.h5`
  font-size: 13px;
  line-height: 19px;
  color: #74788d;
  font-weight: normal;
`;

const DashboardOrderEvent = () => {
    const [event, setEvent] = useState([]);

    // const [activeTab, setActiveTab] = useState("1")
    // const toggleTab = tab => {
    //     if (activeTab !== tab) {
    //     setActiveTab(tab)
    //     }
    // }

    useEffect(async() => {
        const {data, success} = await OrderEventService.getAll();
        if (success) {
            setEvent(data);
        }
    }, []);

  return (
    <React.Fragment>
      <MetaTags>
        <title>Checkout Events | MyAchery</title>
      </MetaTags>
      {/* import navbar */}
      <HeaderForm />

            <Row>
                {/* <Col sm={6}>
                    <CardActivity/>
                </Col> */}
                <Col sm={6}>
                    <Card>
                        <CardBody>
                                {event && event?.map((i) => (
                                    <>
                                    <Media className="mt-3 flex-row" key={i.archeryEvent.id}>
                                        <div>
                                            <div className="d-flex">
                                                <h3>{i.archeryEvent.eventName} </h3>
                                                <p style={{color: "#74788D"}} className="mt-1 mx-3"><i>{i.transactionInfo.status}</i></p> 
                                            </div>
                                            <H5>{i.archeryEvent.flatCategories[0].archeryEventCategoryLabel}</H5>
                                            <H5>ID {i.transactionInfo.orderId}</H5>
                                        </div>
                                    </Media> 
                                    <Button
                                        href="/checkout-event"
                                        type="button"
                                        style={{backgroundColor: "#0D47A1",  }}>
                                        Detail
                                    </Button>
                                </>
                                ))}


                                {/* <ul className="nav nav-tabs nav-tabs-custom">
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
                                </ul> */}


                           
                            
                        </CardBody>
                    </Card>
                </Col>
               
            </Row>

        <Row>
          <Col sm={6}>
            <CardActivity />
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
                          toggleTab("1");
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
                          toggleTab("2");
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
                          toggleTab("3");
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
  );
};

export default DashboardOrderEvent;
