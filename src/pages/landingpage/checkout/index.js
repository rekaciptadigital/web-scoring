import React from "react"
import MetaTags from 'react-meta-tags';
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Card, Media, CardBody, Button } from "reactstrap";
import styled from 'styled-components';
import Avatar from "../../../assets/images/users/avatar-man.png"

const H5 = styled.h5`
    font-size: 13px;
    line-height: 19px;
    color: #74788D;
    font-weight: normal;
`;

const CheckoutEvent = () => {

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
                                  <H5>ID ORDER</H5>
                                  <h4>#88 8888</h4>
                                  <H5>21 Agustus 2021</H5>
                              </div>
                              <div className="mx-5 text-muted">
                                  <H5>Total</H5>
                                  <h4>Rp 100.000</h4>
                              </div>
                              <div className="mx-5 text-muted">
                                  <H5>Status Pembayaran</H5>
                                  <h4>Email</h4>
                              </div>
                          </div>
                          <hr/>
                          <div className="d-flex">
                              <div className="mx-5 text-muted">
                                  <H5>ID ORDER</H5>
                                  <h4>#88 8888</h4>
                                  <H5>21 Agustus 2021</H5>
                              </div>
                              <div className="mx-5 text-muted">
                                  <H5>Total</H5>
                                  <h4>Rp 100.000</h4>
                              </div>
                              <div className="mx-5 text-muted">
                                  <H5>Status Pembayaran</H5>
                                  <h4>Email</h4>
                              </div>
                          </div>
                          <hr/>
                          <div className="d-flex">
                            <div className="mx-5 text-muted">
                                <H5>Tanggal Kualifikasi</H5>
                                <h4>Unknown</h4>
                            </div>
                            <div className="mx-5 text-muted">
                              <Button
                                href="/marathon/dashboard"
                                type="button"
                                size="sm"
                                style={{backgroundColor: "#0D47A1",  }}>
                                Pilih Jadwal Kualifikasi
                              </Button>
                            </div>
                          </div>
                          <hr/>                        
                        </Media>

                        <Button
                          type="button"
                          size="md"
                          style={{backgroundColor: "#0D47A1",  }}>
                          LAKUKAN PEMBAYARAN
                        </Button>
                      </Media>
                  </CardBody>
              </Card>
            </Row>

        </Container>

      <Footer />

    </React.Fragment>
  )
}

export default CheckoutEvent
