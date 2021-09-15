import React, {useEffect, useState} from "react";
import MetaTags from "react-meta-tags";
import Footer from "layouts/landingpage/Footer";
import HeaderForm from "layouts/landingpage/HeaderForm";
import { Container, Row, Card, Media, CardBody, Button } from "reactstrap";
import styled from "styled-components";
import Avatar from "../../../assets/images/users/avatar-man.png";
import { OrderEventService } from "services";
import { useParams } from "react-router";
import logoLight from "../../../assets/images/myachery/myachery.png";
import { useSelector } from "react-redux"
import { getAuthenticationStore } from "store/slice/authentication"

const H5 = styled.h5`
  font-size: 13px;
  line-height: 19px;
  color: #74788d;
  font-weight: normal;
`;

const CheckoutEvent = () => {
  const [info, setInfo] = useState([]);
  const { id } = useParams();
  let { profile } = useSelector(getAuthenticationStore);

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
                                <h4>{profile.name}</h4>
                                {/* <H5>Klub FAST</H5> */}
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>No. Ponsel</h4>
                                <H5>{profile.phoneNumber}</H5>
                            </div>
                            <div className="mx-5 text-muted">
                                <h4>Email</h4>
                                <H5>{profile.email}</H5>
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
          <Card>
            <CardBody>
              <Media>
                <div className="ms-3">
                <img src={info.archeryEvent != undefined && info.archeryEvent.poster != null && info.archeryEvent.poster ? info.archeryEvent.poster : logoLight} height="130" />
                </div>
                <Media body className="align-self-center">
                  <H5 className="mx-5">Detail Order</H5>
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
                      {info.transactionInfo != undefined && info.transactionInfo.status == 1 ?
                        <p style={{color: "green"}} className="fw-medium"><i>{info.transactionInfo.status}</i></p>                                                 
                      : info.transactionInfo != undefined && info.transactionInfo.status == 4 ? 
                        <p style={{color: "yellow"}} className="fw-medium"><i>{info.transactionInfo.status}</i></p> 
                      :
                      <p style={{color: "red"}} className="fw-medium"><i>{info.transactionInfo ? info.transactionInfo.status : ""}</i></p> 
                      }
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div className="mx-5 text-muted">
                      <H5>Event</H5>
                      <h5>{info.archeryEvent?.eventName}</h5>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Lokasi</H5>
                      <h5>{info.archeryEvent?.location}</h5>
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Peserta</H5>
                        {info.participant && info.participant.members ? info.participant.members.map((i) => (
                          <li key={i}>{i.name}</li>
                        )):<></>
                        }
                    </div>
                    <div className="mx-5 text-muted">
                      <H5>Kategori</H5>
                      <p>{info.transactionInfo?.orderId}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div className="mx-5 text-muted">
                      <H5>Tanggal Kualifikasi</H5>
                      <p>{info.archeryEvent?.eventStartDatetime}</p>
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
