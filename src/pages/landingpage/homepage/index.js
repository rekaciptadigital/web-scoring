import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import { useParams } from "react-router";
import Footer from "layouts/landingpage/Footer";
import { EventsService } from "services";
// import bgauth from "../../../assets/images/myachery/bg-landingpage.jpg"
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import Countdown from "react-countdown";
import "./components/sass/landingpage.scss"
import { dummyHtml } from './components/htmldummy'


const LandingPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState({})

  useEffect(async () => {
    const { data, success } = await EventsService.getEventBySlug({ slug });
    if (success) {
      setEvent(data);
    }
  }, []);

  let eventStartDate = new Date(event.eventStartDatetime)
  let eventEndDate = new Date(event.eventEndDatetime)
  // let regStartDate = new Date(event.registrationStartDatetime)
  // let regEndDate = new Date(event.registrationEndDatetime)

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

  return (
    <React.Fragment>
      <MetaTags>
        <title>{event.eventName}</title>
      </MetaTags>
      {/* import navbar */}
        <div className="px-4 py-1 sticky-top bg-light">
          <Row>
            <Col md={6}>
              <div>
                <img src={logomyarchery} width="91" />
              </div>
            </Col>
            <Col md={6}></Col>
          </Row>
        </div>
        <Container>
            <div>
                <img className="w-100 h-landing" src={event.poster} />
            </div>
            <div>
              <Row className="mt-4">
                <Col md={8}>
                <div>
                  <h1 className="hero-title">
                    {event.eventName}
                  </h1>
                  <p className="font-size-14">
                    Penyelenggara: {event.admin?.name} <br />
                    {eventStartDate.toDateString()} - {eventEndDate.toDateString()} <br />
                    {event.location}
                  </p>
                  <div>
                    <div className="clearfix mt-4">
                      <div dangerouslySetInnerHTML={{__html: dummyHtml}} />
                    </div>
                  </div>
                  {/* Detail data hardcode */}
                </div>
                </Col>
                <Col md={4}>
                <Card className="overflow-hidden mb-0 mt-5 mt-lg-0">
                <CardHeader className="text-center">
                  <h5 className="mb-0">Waktu Acara</h5>
                </CardHeader>
                <CardBody>
                  <div className="text-center">
                    <div className="mt-4">
                      <div className="counter-number ico-countdown">
                        <Countdown date={event.eventEndDatetime != undefined ? event.eventEndDatetime.replace(/-/g, "/") : "2021/12/12"} renderer={renderer} />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="button-items mt-4">
                  <a  target="_blank" rel="noreferrer" href={`/event/register/process/${slug}`} className="btn btn-success me-1 w-100">
                    DAFTAR EVENT
                  </a>
                </div>
                </Col>
              </Row>
            </div>
        </Container>
      <Footer />
    </React.Fragment>
  );
};

export default LandingPage;
