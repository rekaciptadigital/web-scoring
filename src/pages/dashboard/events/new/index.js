import { Breadcrumbs } from "components";
import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";
import eventFullday from "assets/images/events/fullday.jpg";
import eventMarathon from "assets/images/events/marathon.jpg";

const EventsNew = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Events"
            breadcrumbItems={[{ title: "Dashboard" }, { title: "Events" }]}
          />

          <h2 className="text-center">Pilih Jenis Event Anda</h2>

          <Row className="my-5">
            <Col className="mx-auto" xl={8}>
              <Row className="gx-5">
                <Col md={6} xl={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="mt-0">Event Full Day</CardTitle>
                    </CardHeader>

                    <CardImg className="img-fluid p-2" src={eventFullday} alt="Skote" />

                    <CardBody>
                      <CardText>Event diadakan dalam satu satu hari</CardText>

                      <Link to="/dashboard/events/new/fullday" className="card-link">
                        Buat Event &rarr;
                      </Link>
                    </CardBody>
                  </Card>
                </Col>

                <Col md={6} xl={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="mt-0">Event Marathon</CardTitle>
                    </CardHeader>

                    <CardImg className="img-fluid p-2" src={eventMarathon} alt="Skote" />

                    <CardBody>
                      <CardText>
                        Event diadakan bertahap dalam jangka waktu tertentu mulai dari tahap
                        kualifikasi hingga eliminasi
                      </CardText>

                      <Link to="/dashboard/events/new/marathon" className="card-link">
                        Buat Event &rarr;
                      </Link>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EventsNew;
