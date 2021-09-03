import PropTypes from 'prop-types'
import React, { useState } from "react"
import {
  Navbar,
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Container,
  Collapse,
} from "reactstrap"
import { Link } from "react-router-dom"

//Import Images
import logolight from "../../assets/images/myachery/logo-myarchery.png"
import logoblack from "../../assets/images/myachery/myachery.png"

const navItems = [
  { id: 1, idnm: "home", navheading: "Home" },
  { id: 2, idnm: "about", navheading: "About" },
  { id: 3, idnm: "features", navheading: "Features" },
  { id: 3, idnm: "roadmap", navheading: "Roadmap" },
  { id: 4, idnm: "team", navheading: "Team" },
  { id: 5, idnm: "news", navheading: "News" },
  { id: 6, idnm: "faqs", navheading: "FAQs" },
]

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
                height="44"
                width="80"
                className="logo logo-dark"
              />
            ) : (
              <img
                src={logolight}
                alt=""
                height="44"
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
           
              <Nav className="ms-auto navbar-nav" id="topnav-menu">
                {navItems.map((item, key) => (
                  <NavItem
                    key={key}
                    className={item.navheading === "Home" ? "active" : ""}
                  >
                    <NavLink href={"#" + item.idnm}> {item.navheading}</NavLink>
                  </NavItem>
                ))}
              </Nav>
            <div className="ms-lg-2">
              <Link to="#" className="btn btn-outline-light w-xs">
                Sign in
              </Link>
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
