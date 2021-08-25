// availity-reactstrap-validation
import myachery from "assets/images/myachery/logo-myarchery.png"
import React, { useEffect, useState } from "react"
import google from "assets/images/myachery/Google.png"
import facebook from "assets/images/myachery/Facebook.png"
import ladBg from "assets/images/myachery/achery-lad.png"
import { AvField, AvForm } from "availity-reactstrap-validation"
import MetaTags from "react-meta-tags"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom"
import { AuthenticationService } from "services"
import { Col, Container, Row } from "reactstrap"
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
    console.log(values)
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
        <title>Register | MyArchery</title>
      </MetaTags>
      <Container fluid>
        <div>
          <Row>
            <Col md={5} sm={12} xs={12}>
            <img src={ladBg} style={{height: '100vh', zIndex: "-1", position: 'absolute', left:'-1px', width: 'auto'}} />
              <div>
                <div style={{paddingTop: "20vh"}} className=" mx-auto">
                  <img src={myachery} />
                </div>
                <div style={{zIndex: '100'}}>
                <p className="font-size-16 text-white">BUAT EVENT DI MANA SAJA KAPAN SAJA</p>
                  <div className="w-75 mx-auto">
                    <Link to="/authentication/login" className="text-decoration-none text-black-50">
                      <span style={{marginRight: '36px'}} className="font-size-18 text-white">Masuk</span>
                    </Link>
                    <Link to="/authentication/register" className="text-decoration-none text-black-50 text-decoration-underline">
                      <span className="font-size-18 text-white">Daftar</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={7} sm={12} xs={12}>
            <div className="w-50 mx-auto" style={{paddingTop: "16vh"}}>
              <div className="text-center">
                <h2 className="font-size-20 text-danger">Daftar ke myarchery.id</h2>
              </div>
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

                <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                        I Agree to Terms of Service and Privacy Policy
                        </label>
                      </div>
                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Daftar
                        </button>
                      </div>
              </AvForm>
                    <div className="d-flex justify-content-center pt-5">
                      <img src={facebook} style={{cursor: 'pointer'}} />
                      <img src={google} style={{cursor: 'pointer'}} />
                    </div>
                </div>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default Register
