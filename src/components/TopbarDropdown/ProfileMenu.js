import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as AuthenticationStore from "store/slice/authentication";
import { AdminService } from "services";
import { withTranslation } from "react-i18next";
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";

// TODO: Barangkali data source image bisa dari resource
import user1 from "../../assets/images/users/avatar-man.png";

const ProfileMenu = (props) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("Admin");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data, success } = await AdminService.profile();
      if (success) {
        setUsername(data.name);
        dispatch(AuthenticationStore.profile(data));
      }
    };
    getUser();
  }, [props.success]);

  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
        <DropdownToggle className="btn header-item " id="page-header-user-dropdown" tag="button">
          <img className="rounded-circle header-profile-user" src={user1} alt="Header Avatar" />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* TODO: */}
          {/* <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem> */}
          {/* <div className="dropdown-divider" /> */}
          <DropdownItem tag="a" href="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default withTranslation()(ProfileMenu);
