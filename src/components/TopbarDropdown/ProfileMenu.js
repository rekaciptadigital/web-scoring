import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { AdminService } from "services";
import { withTranslation } from "react-i18next";

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";

// TODO: Barangkali data source image bisa dari resource
import user1 from "../../assets/images/users/avatar-man.png";

const ProfileMenu = React.memo((props) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("Admin");
  const [menu, setMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Menggunakan useCallback untuk memoization fungsi toggle
  const toggle = useCallback(() => {
    setMenu((prevMenu) => !prevMenu);
  }, []);

  const handleShowConfirmLogout = useCallback(() => setConfirmLogout(true), []);
  const handleCancelLogout = useCallback(() => setConfirmLogout(false), []);
  const handleLogout = useCallback(() => {
    dispatch(AuthenticationStore.logout());
    push("/login");
  }, [dispatch, push]);

  useEffect(() => {
    AdminService.getProfile().then((res) => {
      setUsername(res?.data?.name);
    });
  }, []);

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown">
          <img className="rounded-circle header-profile-user" src={user1} alt="Header Avatar" />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="#">
            <i className="bx bx-user font-size-16 align-middle me-1"></i>
            {props.t("Profile")}
          </DropdownItem>
          <DropdownItem tag="a" href="#" onClick={handleShowConfirmLogout}>
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
            {props.t("Logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {confirmLogout && (
        <SweetAlert
          title={props.t("Are you sure?")}
          warning
          showCancel
          confirmBtnText={props.t("Yes, logout!")}
          cancelBtnText={props.t("Cancel")}
          onConfirm={handleLogout}
          onCancel={handleCancelLogout}
        >
          {props.t("You will be logged out of the session.")}
        </SweetAlert>
      )}
    </React.Fragment>
  );
});

export default withTranslation()(ProfileMenu);
