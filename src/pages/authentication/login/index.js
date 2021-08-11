// import logo from "assets/images/logo.svg"
// import images
// import profile from "assets/images/profile-img.png"
// availity-reactstrap-validation
// import { AvField, AvForm } from "availity-reactstrap-validation"
import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import { AuthenticationService } from "services"
//Import config
import * as AuthenticationStore from "store/slice/authentication"
import toastr from "toastr"

const Login = () => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore)
  let history = useHistory()
  const [loginErrors, setLoginErrors] = useState()

  const handleValidSubmit = async (event, values) => {
    const { data, errors, message, success } =
      await AuthenticationService.login(values)
    if (success) {
      if (data) {
        dispatch(AuthenticationStore.login(data))
      }
    } else {
      console.log(errors)
      setLoginErrors(errors)
      toastr.error(message)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      history.push("/")
    }
  }, [isLoggedIn])

  console.log(loginErrors)

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | Skote - React Admin & Dashboard Template</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container fluid>
          <Row>
            <Col>1</Col>
            <Col>2
            <input type="button" onClick={handleValidSubmit} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login
