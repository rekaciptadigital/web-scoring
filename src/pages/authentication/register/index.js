// availity-reactstrap-validation
import myachery from "assets/images/myachery/logo 3.png"
import React, { useEffect, useState } from "react"
import google from "assets/images/myachery/Google.png"
import facebook from "assets/images/myachery/Facebook.png"
// import ladBg from "assets/images/myachery/achery-lad.png"
import { AvField, AvForm } from "availity-reactstrap-validation"
import MetaTags from "react-meta-tags"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom"
import { AuthenticationService } from "services"
import { Col, Container, Row, Card, CardBody } from "reactstrap"
import * as AuthenticationStore from "store/slice/authentication"
import toastr from "toastr"
// import logoImg from "../../../assets/images/logo.svg"
// import images
// import profileImg from "../../../assets/images/profile-img.png"

const Register = () => {
  const [registerErrors, setRegisterErrors] = useState()

  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore)
  let history = useHistory();
  
  const handleValidSubmit = async (event, values) => {
    const { data, errors, message, success } = await AuthenticationService.register(values)
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.register())
      }
    } else {
      console.log(errors)
      setRegisterErrors(errors)
      toastr.error(message)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/")
    }
  }, [isLoggedIn])

  console.log(registerErrors)

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | MyArchery</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary">
                  <Row>
                    <Col xs={7}>
                      <div className="text-light p-4">
                        <h5 className="text-light">Daftar MyArchery.id</h5>
                        <p>Get your free MyArchery.id <br />account now.</p>
                      </div>
                    </Col>
                    {/* <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col> */}
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={myachery}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                  <AvForm
              className="form-horizontal"
              onValidSubmit={(e, v) => {
                handleValidSubmit(e, v)
              }}
              >
                <div className="mb-2">
                  <AvField
                    name="email"
                    label="Email"
                    className="form-control"
                    placeholder="Masukkan email/Nama EO Terdaftar"
                    type="email"
                    required
                  />
                </div>
                <div className="mb-2">
                  <AvField
                    name="name"
                    label="Nama EO"
                    className="form-control"
                    placeholder="Masukkan email/Nama EO Terdaftar"
                    type="text"
                    required
                  />
                </div>
                <div className="mb-2">
                        <AvField
                          name="password"
                          label="Kata Sandi"
                          type="password"
                          required
                          placeholder="Masukkan kata sandi"
                        />
                      </div>
                <div className="mb-2">
                  <AvField
                    name="password_confirmation"
                    label="Konfirmasi Kata Sandi"
                    type="password"
                    required
                    placeholder="Masukkan kata sandi"
                  />
                </div>
                <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>

                      <div className="text-center mt-4">
                        <p className="font-size-14 color-black">Atau daftar dengan</p>
                        <div>
                          <img src={facebook} alt="" />
                          <img src={google} alt="" />
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <Link
                          to="/authentication/forgot-password"
                          className="text-muted"
                        >
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
              </AvForm>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/authentication/login" className="fw-medium text-primary">
                    {" "}
                    Login{" "}
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Register
