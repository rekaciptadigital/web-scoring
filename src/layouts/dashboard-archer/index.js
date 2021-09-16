import React, { Component } from "react"
import { withRouter } from "react-router-dom"

// Other Layout related Component
// import Navbar from "./Navbar"
// import HeaderForm from "../landingpage/HeaderForm"
import Footer from "./Footer"

class LayoutArcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpened: false,
    }
  }

  componentDidMount() {
    if (document.body) document.body.setAttribute('data-layout', 'horizontal')
    if (this.props.isPreloader === true) {
      document.getElementById("preloader").style.display = "block"
      document.getElementById("status").style.display = "block"

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none"
        document.getElementById("status").style.display = "none"
      }, 2500)
    } else {
      document.getElementById("preloader").style.display = "none"
      document.getElementById("status").style.display = "none"
    }

    // Scrollto 0,0
    window.scrollTo(0, 0)

    // const title = this.props.location.pathname
    // let currentage = title.charAt(1).toUpperCase() + title.slice(2)
    document.title =
      "Dashboard" + " | MyArchery"
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened })
  }
  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          {/* <Navbar menuOpen={this.state.isMenuOpened} /> */}
          <div className="main-content" style={{minHeight: "calc(100vh - 60px)"}}>{this.props.children}</div>
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}

export default (withRouter(LayoutArcher))
