import React from 'react'
import MetaTags from "react-meta-tags";
import {
  Container,
  Row,
  Col,
//   Card,
//   CardBody,
//   CardHeader,
  Button
} from "reactstrap";
import { Link } from "react-router-dom"
import ProfileMenuArcher from "components/TopbarDropdown/ProfileMenuArcher";
import logomyarchery from "../../../assets/images/myachery/myachery.png"
import { useSelector } from "react-redux";
import { getAuthenticationStore } from "store/slice/authentication";
import Footer from "layouts/landingpage/Footer";
import { TextInput } from "components"
import "./components/sass/displayscore.scss"
import TableScore from './components/TableScore';

function DisplayScore() {
    const path = window.location.pathname;


    let { isLoggedIn } = useSelector(getAuthenticationStore);
    return (
        <React.Fragment>
            <MetaTags>
            <title>MyAchery | The HuB Scoring - 2021</title>
            </MetaTags>
            <div className="px-4 py-1 sticky-top bg-light d-flex justify-content-between">
          {/* <Row>
            <Col md={6}> */}
              <Link to="/archer/dashboard">
              <div>
                <img src={logomyarchery} width="91" />
              </div>
              </Link>
            {/* </Col>
            <Col md={6}> */}
              { isLoggedIn ? (
                <div>
                  <ProfileMenuArcher color="black" />
                </div>
              ) : (
                  <div>
                    <Link style={{padding:"20px"}} to={"/archer/login?path="+path}>
                    <Button className="float-end" color="outline-dark">Masuk</Button>
                </Link>
                    <Link>
                        <Button className="me-2" color='primary'>Daftar</Button>
                    </Link>
                </div>
                )
              }
            {/* </Col>
          </Row> */}
        </div>
        <Container>
            {/* Detail header about live scoring */}
            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <span className="header-detail pt-1 pe-2"></span>
                        <span>
                        Live Score
                        </span>
                        <span className="ms-2">
                            Babak Kualifikasi
                        </span>
                        <span className="ms-2">
                            <span>Last Update: 23 September 2021 | 13.00 WIB</span>
                        </span>
                    </div>
                        <div>
                            <span className="float-end">Lihat Jadwal Lengkap<a className="text-success ms-1">ke myachery.id/TheHuB</a></span>
                        </div>
                    </div>
            </div>
            <div className="text-center">
                <h1 className="text-primary py-4">The HuB Scoring - 2021</h1>
            </div>
            <div className="mb-4">
                <Row>
                    <Col md={6} sm={12}>
                        
                    </Col>
                    <Col md={6} sm={12}>
                        <div className="w-50 float-md-end float-none d-flex">
                            <TextInput name="name" />
                            <Button color="primary" className="ms-2"><i className="bx bx-search"></i></Button>
                        </div>
                    </Col>
                </Row>
                <div className="d-flex" style={{width: '170px'}}>
                            <Link>Traditional Bow</Link>
                            <Link className="text-black-50 ms-2">Recurve</Link>
                        </div>
                    <hr />
                </div>
                <TableScore />
        </Container>
        <Footer />
        </React.Fragment>
    )
}

export default DisplayScore
