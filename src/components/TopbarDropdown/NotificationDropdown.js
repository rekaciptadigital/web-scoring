import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

// i18n
import { withTranslation } from "react-i18next";

const NotificationDropdown = React.memo((props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  // Menggunakan useCallback untuk memoization fungsi toggle
  const toggle = useCallback(() => {
    setMenu((prevMenu) => !prevMenu);
  }, []);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={toggle}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">3</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t("Notifications")} </h6>
              </Col>
              <div className="col-auto">
                <Link to="#" className="small">
                  {props.t("View All")}
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ maxHeight: "230px" }}>
            {/* Contoh item notifikasi */}
            <Link to="#" className="text-reset notification-item">
              <div className="d-flex">
                <div className="flex-shrink-0 me-3">
                  <img
                    src="/images/users/avatar-1.jpg"
                    className="rounded-circle avatar-sm"
                    alt="user-pic"
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">{props.t("Your order is placed")}</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{props.t("If several languages coalesce the grammar")}</p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline" /> 3 min ago
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            {/* Tambahkan item notifikasi lainnya sesuai kebutuhan */}
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
});

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(NotificationDropdown);
