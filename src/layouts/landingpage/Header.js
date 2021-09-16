import PropTypes from 'prop-types'
import React, { useState } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,

  Container,
  Collapse,
} from "reactstrap"
// import { Link } from "react-router-dom"

//Import Images
import logolight from "../../assets/images/myachery/logo-myarchery.png"
import logoblack from "../../assets/images/myachery/myachery.png"


const Navbar_Page = props => {
  const [isOpenMenu, setisOpenMenu] = useState(false)

  return (
    <React.Fragment>
      <Navbar
        expand="lg"
        fixed="top"
        className={"navigation sticky " + props.navClass}
      >
        <Container>
          <NavbarBrand className="navbar-logo" href="/">
            {props.imglight !== true ? (
              <img
                src={logoblack}
                alt=""
                height="auto"
                width="80"
                className="logo logo-dark"
              />
            ) : (
              <img
                src={logolight}
                alt=""
                height="auto"
                width="80"
                className="logo logo-light"
              />
            )}
          </NavbarBrand>

          <NavbarToggler
            className="p-0"
            onClick={() => {
              setisOpenMenu()
            }}
          >
            <i className="fa fa-fw fa-bars"/>
          </NavbarToggler>

          <Collapse id="topnav-menu-content" isOpen={isOpenMenu} navbar>
            <div className="ms-auto">
              {/* <Link to="/archer/login" className="btn btn-outline-light w-xs">
                Sign in
              </Link> */}
            </div>
          </Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  )
}

Navbar_Page.propTypes = {
  imglight: PropTypes.any,
  navClass: PropTypes.string
}

export default Navbar_Page
