import React, {useEffect, useState} from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Col, Card, Media, CardBody, Button } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../assets/images/users/avatar-man.png"
import { OrderEventService } from "services";
import { getAuthenticationStore } from "store/slice/authentication"
import logoLight from "../../../assets/images/myachery/myachery.png";
import { useSelector } from "react-redux"
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
    let { profile } = useSelector(getAuthenticationStore);

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

    console.log(profile)

  return (
    <React.Fragment>
      <MetaTags>
        <title>Dashboard | MyAchery</title>
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
                                <h4>Admin</h4>
                                {/* <H5>Klub FAST</H5> */}
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>No. Ponsel</h4>
                                <H5>081256897045</H5>
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>Email</h4>
                                <H5>admin234@gmail.com</H5>
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
                <Col sm={12}>
                    <Card>
                        <CardBody>
                        <H5 className="mx-5">Your Event</H5>
                                {event.length < 1 ? 
                                    <div style={{paddingTop:"20px", verticalAlign: "middle", textAlign: "center"}}>
                                    <H5 className="mx-5">You haven&apos;t followed any events yet</H5>
                                    </div>
                                : null}
                                {event && event?.map((i) => (
                                    <div style={{marginBottom:"20px;",borderRadius:"10px",border:"2px solid #0064ff"}} key={i.archeryEvent.id}>
                                    <CardBody>
                                        <Row>
                                            <Col md={3} sm={12}>
                                                <div>
                                                    <span>
                                                        {/* <i className="bx bx-home font-size-24"></i> */}
                                                        <img src={i.archeryEvent.poster != null && i.archeryEvent.poster ? i.archeryEvent.poster : logoLight} height="130" />
                                                    </span>
                                                </div>
                                            </Col>
                                            <Col md={9} sm={12}>
                                                <div>
                                                <h4>{i.archeryEvent.eventName}</h4>
                                                <p className="text-muted fw-medium">
                                                    {i.archeryEvent.eventType}
                                                    {i.archeryEvent.flatCategories[0] ? i.archeryEvent.flatCategories[0].archeryEventCategoryLabel : null}
                                                </p>
                                                <p className="text-muted fw-medium">
                                                   Order ID : {i.transactionInfo.orderId}
                                                </p>
                                                {i.transactionInfo.status == 1 ?
                                                    <p style={{color: "green"}} className="fw-medium"><i>{i.transactionInfo.status}</i></p>                                                 
                                                : i.transactionInfo.status == 4 ? 
                                                    <p style={{color: "yellow"}} className="fw-medium"><i>{i.transactionInfo.status}</i></p> 
                                                :
                                                    <p style={{color: "red"}} className="fw-medium"><i>{i.transactionInfo.status}</i></p> 
                                                }
                                                <Button
                                                    href={`/checkout-event/${i.participant.id}`}
                                                    type="button"
                                                    class="btn-sm"
                                                    color="primary"
                                                    style={{float:"right"}}
                                                    >
                                                    Show Detail
                                                </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    {/* <Media className="mt-3 flex-row">
                                        <div>
                                            <div className="d-flex">
                                                <h3>{i.archeryEvent.eventName} </h3>
                                                <p style={{color: "#74788D"}} className="mt-1 mx-3"><i>{i.transactionInfo.status}</i></p> 
                                            </div>
                                            <H5>{i.archeryEvent.flatCategories[0] ? i.archeryEvent.flatCategories[0].archeryEventCategoryLabel : null}</H5>
                                            <H5>ID {i.transactionInfo.orderId}</H5>
                                        </div>
                                    </Media> 
                                    <Button
                                        href={`/checkout-event/${i.participant.id}`}
                                        type="button"
                                        class="btn-sm"
                                        style={{backgroundColor: "#0D47A1",  }}>
                                        Detail
                                    </Button> */}
                                </div>
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
