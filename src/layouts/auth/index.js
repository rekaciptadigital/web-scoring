import PropTypes from 'prop-types';
import React from "react";
import { withRouter } from "react-router-dom";
import "toastr/build/toastr.min.css";

const NonAuthLayout = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object,
};

export default withRouter(NonAuthLayout);
