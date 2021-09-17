import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Media,
  // Modal,
  // ModalBody,
  // ModalFooter,
  // ModalHeader,
  // Button
} from "reactstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

//Import Countdown
import Countdown from "react-countdown";
//Import Components
import Header from "layouts/landingpage/Header";
import Footer from "layouts/landingpage/Footer";
import { EventsService } from "services";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import styled from "styled-components";

const Td = styled.td`
  padding-top: 12px;
`;
const Label = styled.label`
  font-size: 12px;
  line-height: 15px;
  color: #495057;
  display: ruby;
  font-weight: 400;
`;

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>You are good to go!</span>;
  } else {
    // Render a countdown
    return (
      <>
        <div className="coming-box">
          {days}
          <span>Days</span>
        </div>
        <div className="coming-box">
          {hours}
          <span>Hours</span>
        </div>
        <div className="coming-box">
          {minutes}
          <span>Minutes</span>
        </div>
        <div className="coming-box">
          {seconds}
          <span>Seconds</span>
        </div>
      </>
    );
  }
};

const LandingPage = () => {
  const { slug } = useParams();
  const [imglight, setimglight] = useState(true);
  const [navClass, setnavClass] = useState("");
  const [event, setEvent] = useState({});
  // const [modal, setModal] = useState(false);

  // const toggle = () => setModal(!modal);

  // Use ComponentDidMount
  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  });

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 80) {
      setimglight(false);
      setnavClass("nav-sticky");
    } else {
      setimglight(true);
      setnavClass("");
    }
  }

  useEffect(async () => {
    const { data, success } = await EventsService.getEventBySlug({ slug });
    if (success) {
      setEvent(data);
    }
  }, []);

  const pageOptions = {
    sizePerPage: 10,
    totalSize: event.flatCategories?.length,
    custom: true,
  };

  const columns = [
    {
      dataField: "ageCategoryLabel",
      text: "Kategori Usia.",
      sort: true,
    },
    {
      dataField: "competitionCategoryLabel",
      text: "Kategori Lomba",
      sort: true,
    },
    {
      dataField: "teamCategoryLabel",
      text: "Jenis Regu",
      sort: true,
    },
    {
      dataField: "distanceLabel",
      text: "Jarak",
      sort: true,
    },
  ];

  const defaultSorted = [
    {
      dataField: "ageCategoryId",
      order: "asc",
    },
  ];

  let eventStartDate = new Date(event.eventStartDatetime)
  let eventEndDate = new Date(event.eventEndDatetime)
  // let regStartDate = new Date(event.registrationStartDatetime)
  let regEndDate = new Date(event.registrationEndDatetime)

  return (
    <React.Fragment>
      <MetaTags>
        <title>{event.eventName}</title>
      </MetaTags>
      {/* import navbar */}
      <Header navClass={navClass} imglight={imglight} />

      <section className="section hero-section bg-ico-hero" id="home">
        <div className="bg-overlay" />
        <Container>
          <Row className="align-items-center">
            <Col lg="5">
              <div className="text-white-50">
                <h1 className="text-white font-weight-semibold mb-3 hero-title">
                  {event.eventName}
                </h1>
                <p className="font-size-14">
                  Penyelenggara: {event.admin?.name} <br />
                  {eventStartDate.toDateString()} - {eventEndDate.toDateString()} <br />
                  {event.location}
                </p>

                <div className="button-items mt-4">
                  <Link to={`/event/register/process/${slug}`} className="btn btn-success me-1">
                    DAFTAR EVENT
                  </Link>
                </div>
                <div>
              {/* <Button color="danger" onClick={toggle}>Modal</Button> */}
              {/* <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
              </Modal> */}
            </div>
              </div>
            </Col>
            <Col lg="5" md="8" sm="10" className="ms-lg-auto">
              <Card className="overflow-hidden mb-0 mt-5 mt-lg-0">
                <CardHeader className="text-center">
                  <h5 className="mb-0">Time Left</h5>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <div className="mt-4">
                      <div className="counter-number ico-countdown">
                        <Countdown date={event.eventStartDatetime != undefined ? event.eventStartDatetime.replace(/-/g, "/") : "2021/12/12"} renderer={renderer} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="clearfix mt-4">
                      <div dangerouslySetInnerHTML={{__html: event.description}} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section bg-white p-0">
        <Container>
          <div className="currency-price">
            <Row>
              {/* reder card boxes */}
              <Col md="5">
                <Card>
                  <CardBody>
                    <Media>
                      <Media body>
                        <h5>Waktu dan Tempat</h5>
                        <table>
                          <tr>
                            <Td>
                              <Label className="text-muted text-Truncate mb-0 me-3">
                                Pendaftaran Hingga
                              </Label>
                            </Td>
                            <Td>
                              <i className={"me-2 far fa-calendar"} />
                            </Td>
                            <Td>
                              <p className="mb-0 font-weight-bold">
                                {regEndDate.toDateString()} - {regEndDate.toLocaleTimeString()}
                              </p>
                            </Td>
                          </tr>
                          <tr>
                            <Td>
                              <Label className="text-muted text-Truncate mb-0 me-3">
                                Tanggal Lomba:
                              </Label>
                            </Td>
                            <Td>
                              <i className={"me-2 far fa-calendar"} />
                            </Td>
                            <Td>
                              <p className="mb-0 font-weight-bold">
                                {eventStartDate.toDateString()}, {eventStartDate.getHours()+":"+eventStartDate.getMinutes()} WIB-{" "}
                                {eventEndDate.toDateString()}, {eventEndDate.getHours()+":"+eventEndDate.getMinutes()} WIB
                              </p>
                            </Td>
                          </tr>
                          <tr>
                            <Td>
                              <Label className="text-muted text-Truncate mb-0 me-3">
                                Lokasi
                              </Label>
                            </Td>
                            <Td>
                              <i className={"me-2 fas fa-map-marker-alt"} />
                            </Td>
                            <Td>
                              <p className="mb-0 font-weight-bold">
                                {event.location}
                              </p>
                            </Td>
                          </tr>
                          <tr>
                            <Td>
                              <Label className="text-muted text-Truncate mb-0 me-3">
                                No. Telpon
                              </Label>
                            </Td>
                            <Td>
                              <i className={"me-2 fas fa-phone-alt"} />
                            </Td>
                            <Td>
                              <p className="mb-0 font-weight-bold">
                                {event.admin?.phoneNumber || '-'}
                              </p>
                            </Td>
                          </tr>
                        </table>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
              <Col md="7">
                <Card>
                  <CardBody>
                    <Media>
                      <Media body>
                        <h5 className="mb-3">Kategori Event</h5>
                        <div className="col-11">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="id"
                            columns={columns}
                            data={event.flatCategories}
                          >
                            {({ paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="id"
                                columns={columns}
                                data={event.flatCategories || []}
                                search
                              >
                                {(toolkitProps) => (
                                  <React.Fragment>
                                    <Row>
                                      <Col xl="12">
                                        <div className="table-responsive">
                                          <BootstrapTable
                                            keyField={"id"}
                                            responsive
                                            bordered={false}
                                            striped={false}
                                            defaultSorted={defaultSorted}
                                            classes={
                                              "table align-middle table-nowrap"
                                            }
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                            {...paginationTableProps}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )}
                          </PaginationProvider>
                        </div>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <Footer />
    </React.Fragment>
  );
};

export default LandingPage;
