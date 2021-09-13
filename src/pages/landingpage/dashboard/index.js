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
                            disabled
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
                                        href={`/checkout-event/${i.participant.id}`}
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

      </Container>

      <Footer />
    </React.Fragment>
  );
};

export default DashboardOrderEvent;
