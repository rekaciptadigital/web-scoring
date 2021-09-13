import { Breadcrumbs } from "components";
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  // Col,
  Container,
  // Row,
} from "reactstrap";
import eventFullday from "assets/images/events/fullday.jpg";
// import eventMarathon from "assets/images/events/marathon.jpg";

const EventsNew = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Events"
            breadcrumbItems={[{ title: "Dashboard" }, { title: "Events" }]}
          />
          <h2 style={{textAlign: 'center'}}>Pilih Jenis Event Anda</h2>
          {/* <Row> */}
            {/* <Col md={12} xl={{size: 3, offset: 3}}> */}
              <Card>
                <CardBody>
                  <CardTitle className="mt-0">Event Full Day</CardTitle>
                </CardBody>
                <CardImg className="img-fluid" src={eventFullday} alt="Skote" />
                <CardBody>
                  <CardText>Event diadakan dalam satu satu hari</CardText>
                  <Link to="/dashboard/events/new/fullday" className="card-link">
                    Buat Event
                  </Link>
                </CardBody>
              </Card>
            {/* </Col> */}
            {/* <Col md={6} xl={3}>
              <Card>
                <CardBody>
                  <CardTitle className="mt-0">Event Marathon</CardTitle>
                </CardBody>
                <CardImg
                  className="img-fluid"
                  src={eventMarathon}
                  alt="Skote"
                />
                <CardBody>
                  <CardText>
                    Event diadakan bertahap dalam jangka waktu tertentu mulai
                    dari tahap kualifikasi hingga eliminasi
                  </CardText>
                  <Link to="/dashboard/events/new/marathon" className="card-link">
                    Buat Event
                  </Link>
                </CardBody>
              </Card>
            </Col> */}
          {/* </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNew;
