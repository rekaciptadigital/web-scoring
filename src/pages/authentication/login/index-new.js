import React, { useState } from "react"
import { Container, Row, Col, Card, CardBody } from "reactstrap"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import MetaTags from "react-meta-tags"

// Import images
import profile from "assets/images/profile-img.png"
import logo from "assets/images/logo.svg"
import { AuthenticationService } from "services"
import * as AuthenticationStore from "store/slice/authentication"

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  
  // State untuk error handling
  const [loginErrors, setLoginErrors] = useState(null)
  const [loading, setLoading] = useState(false)

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    
    // Ambil data dari form
    const formData = new FormData(event.target)
    const values = {
      email: formData.get('email'),
      password: formData.get('password')
    }

    try {
      const { data, success, message } = await AuthenticationService.login(values)
      
      if (success && data) {
        dispatch(AuthenticationStore.login(data))
        history.push('/dashboard')
      } else {
        setLoginErrors(message || 'Login gagal')
      }
    } catch (error) {
      setLoginErrors(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | MyArchery</title>
      </MetaTags>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Selamat Datang!</h5>
                        <p>Silahkan login ke MyArchery.</p>
                      </div>
                    </Col>
                    <Col xs={5} className="align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>

                <CardBody className="pt-0">
                  <div className="auth-logo">
                    <Link to="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img src={logo} alt="" height="34" />
                        </span>
                      </div>
                    </Link>

                    <Link to="/" className="auth-logo-dark">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img src={logo} alt="" height="34" />
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="p-2">
                    <form className="form-horizontal" onSubmit={handleSubmit}>
                      {loginErrors && (
                        <div className="alert alert-danger">{loginErrors}</div>
                      )}

                      <div className="mb-3">
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          required
                        />
                      </div>

                      <div className="form-check form-check-inline mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="rememberme"
                        />
                        <label className="form-check-label" htmlFor="rememberme">
                          Remember me
                        </label>
                      </div>

                      <div className="mb-3 text-end">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Login"}
                        </button>
                      </div>
                    </form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} MyArchery. 
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login
