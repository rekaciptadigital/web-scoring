import React, { useEffect, useState, useCallback } from "react";
//i18n
import { withTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
// users
import user1 from "../../assets/images/users/avatar-man.png";
import { useDispatch } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { ArcherService } from "services";

const ProfileMenuArcher = React.memo((props) => {
  // State untuk status menu dropdown dan nama pengguna
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState("Admin");

  const dispatch = useDispatch();

  // Menggunakan useCallback untuk memoization fungsi toggle
  const toggle = useCallback(() => {
    setMenu((prevMenu) => !prevMenu);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, success } = await ArcherService.profile();
      if (success) {
        setUsername(data.name);
        dispatch(AuthenticationStore.profile(data));
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="#">
            <i className="bx bx-user font-size-16 align-middle me-1"></i>
            {props.t("Profile")}
          </DropdownItem>
          <DropdownItem
            tag="a"
            href="#"
            onClick={() => dispatch(AuthenticationStore.logout())}
          >
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
            {props.t("Logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
});

export default withTranslation()(ProfileMenuArcher);
