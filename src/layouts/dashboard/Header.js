import React, { useState } from "react"
//i18n
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from "reactstrap"
import megamenuImg from "../../assets/images/megamenu-img.png"
// Import menuDropdown
import LanguageDropdown from "./components/TopbarDropdown/LanguageDropdown"
import NotificationDropdown from "./components/TopbarDropdown/NotificationDropdown"
import ProfileMenu from "./components/TopbarDropdown/ProfileMenu"

const Header = props => {
  const [search, setsearch] = useState(false)
  const [megaMenu, setmegaMenu] = useState(false)
  const [socialDrp, setsocialDrp] = useState(false)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [position, setPosition] = useState()
  const [open, setOpen] = useState(false)

  const toggleTopDrawer = () => {
    setPosition("right")
    setOpen(!open)
  }

  const onDrawerClose = () => {
    setOpen(false)
  }

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle() {
    var body = document.body
    body.classList.toggle("vertical-collpsed")
    body.classList.toggle("sidebar-enable")
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <Dropdown
              className="dropdown-mega d-none d-lg-block ms-2"
              isOpen={megaMenu}
              toggle={() => {
                setmegaMenu(!megaMenu)
              }}
            >
              <DropdownToggle className="btn header-item " caret tag="button">
                {" "}
                {props.t("Mega Menu")} <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-megamenu">
                <Row>
                  <Col sm={8}>
                    <Row>
                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("UI Components")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Lightbox")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Range Slider")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Sweet Alert")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Rating")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Forms")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tables")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Charts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Applications")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Ecommerce")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Calendar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Email")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Projects")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tasks")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Contacts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("Extra Pages")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Light Sidebar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Compact Sidebar")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Horizontal layout")}</Link>
                          </li>
                          <li>
                            <Link to="#"> {props.t("Maintenance")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Coming Soon")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Timeline")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("FAQs")}</Link>
                          </li>
                        </ul>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={4}>
                    <Row>
                      <Col sm={6}>
                        <h5 className="font-size-14 mt-0">
                          {props.t("UI Components")}
                        </h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link to="#">{props.t("Lightbox")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Range Slider")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Sweet Alert")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Rating")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Forms")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Tables")}</Link>
                          </li>
                          <li>
                            <Link to="#">{props.t("Charts")}</Link>
                          </li>
                        </ul>
                      </Col>

                      <Col sm={5}>
                        <div>
                          <img
                            src={megamenuImg}
                            alt=""
                            className="img-fluid mx-auto d-block"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="d-flex">
            <LanguageDropdown />
            <NotificationDropdown />
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

export default withTranslation()(Header)
