import React, {useEffect, useState} from "react";
import MetaTags from "react-meta-tags";
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Card, Media, CardBody, Button } from "reactstrap";
import styled from "styled-components";
import Avatar from "../../../assets/images/users/avatar-man.png";
import { OrderEventService } from "services";
import { useParams } from "react-router";

const H5 = styled.h5`
  font-size: 13px;
  line-height: 19px;
  color: #74788d;
  font-weight: normal;
`;

const CheckoutEvent = () => {
  const [info, setInfo] = useState([]);
  const { id } = useParams();

  const handleClick = () => {
    console.log(info.transactionInfo?.snapToken, 'klik')
    window.snap.pay(`${info.transactionInfo?.snapToken}`)
    return () => {
      document.body.removeChild(scriptTag);
    };
  };

  useEffect(async() => {
    const {data, errors, message, success} = await OrderEventService.get({id});
    console.log(data, errors, message, success)
    if (success) {
      if (data) {
        console.log(data)
        setInfo(data);
        }
      } else {
        console.log(errors)
        console.log(message)
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
                      <h4>{info.participant?.name}</h4>
                      <H5>Klub FAST</H5>
                    </div>
                    <div className="mx-5 text-muted">
                      <h4>No. Ponsel</h4>
                      <H5>{info.participant?.phoneNumber}</H5>
                    </div>
                    <div className="mx-5 text-muted">
                      <h4>Email</h4>
                      <H5>{info.participant?.email}</H5>
                    </div>
                  </div>
                </Media>
                <Button
                  href="/full-day"
                  type="button"
                  size="sm"
                  style={{ backgroundColor: "#0D47A1" }}
                  disabled
                >
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
                      <h4>{info.transactionInfo?.orderId}</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Total</H5>
                      <h4>Rp {info.transactionInfo?.total}</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Status Pembayaran</H5>
                      <h4>{info.transactionInfo?.status}</h4>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div className="mx-5 text-muted">
                      <H5>Event</H5>
                      <h4>Jakarta Archery 2021</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Lokasi</H5>
                      <h4>Gelora Bung Karno</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Peserta</H5>
                      <h4>Asep</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Kategori</H5>
                      <h4>{info.transactionInfo?.orderId}</h4>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div className="mx-5 text-muted">
                      <H5>Tanggal Kualifikasi</H5>
                      <h4>{info.archeryEvent?.eventStartDatetime}</h4>
                    </div>
                    <div className="mx-5 text-muted">
                      <Button
                        href="/marathon/dashboard"
                        type="button"
                        size="sm"
                        style={{ backgroundColor: "#0D47A1" }}
                        disabled
                      >
                        Pilih Jadwal Kualifikasi
                      </Button>
                    </div>
                  </div>
                  <hr />
                </Media>

                <Button
                  type="button"
                  size="md"
                  onClick={handleClick}
                  style={{ backgroundColor: "#0D47A1" }}
                >
                  LAKUKAN PEMBAYARAN
                </Button>
              </Media>
            </CardBody>
          </Card>
        </Row>
      </Container>

      <Footer />
    </React.Fragment>
  );
};

export default CheckoutEvent;
