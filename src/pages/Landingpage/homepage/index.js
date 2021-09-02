import React, { useEffect, useState } from "react"
import MetaTags from 'react-meta-tags';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap"
import { Link } from "react-router-dom"

//Import Countdown
import Countdown from "react-countdown"
//Import Components
import Header from "layouts/landingpage/Header"
import CardContent from "./components/card-content";


const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>You are good to go!</span>
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
    )
  }
}


const LandingPage = () => {
  const [imglight, setimglight] = useState(true)
  const [navClass, setnavClass] = useState("")

  // Use ComponentDidMount
  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true)
  })

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop
    if (scrollup > 80) {
      setimglight(false)
      setnavClass("nav-sticky")
    } else {
      setimglight(true)
      setnavClass("")
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>ICO Landing | Skote - React Admin & Dashboard Template</title>
      </MetaTags>
      {/* import navbar */}
      <Header navClass={navClass} imglight={imglight} />

      <section className="section hero-section bg-ico-hero" id="home">
        <div className="bg-overlay"/>
        <Container>
          <Row className="align-items-center">
            <Col lg="5">
              <div className="text-white-50">
                <h1 className="text-white font-weight-semibold mb-3 hero-title">
                  Jakarta Archery 2021
                </h1>
                <p className="font-size-14">
                Penyelenggara: Panahan Jakarta <br/>
                13 Agustus - 16 Agustus 2021 <br/>
                Gelora Bung karno
                </p>

                <div className="button-items mt-4">
                  <Link to="#" className="btn btn-success me-1">
                    DAFTAR
                  </Link>
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
                        <Countdown date="2021/12/31" renderer={renderer} />
                      </div>
                    </div>
                  </div>

                    <div className="mt-5">
                      <div className="clearfix mt-4">
                        <h4 className="font-weight-semibold">Total Hadiah 50 JT</h4>
                      </div>
                      <div className="clearfix mt-1">
                        <p className="font-size-14">
                        Juara I: Medali + Piagam+ Tunai<br/>
                        Juara II: Medali + Piagam+ Tunai<br/>
                        Juara III: Medali + Piagam+ Tunai<br/>
                        Doorprize
                        </p>
                      </div>
                    </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <CardContent/>


    </React.Fragment>
  )
}

export default LandingPage
