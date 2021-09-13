import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

const Breadcrumb = props => {
  const { title } = props;
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    const pathParts = path.slice(1).split("/");
    const breadcrumbItems = pathParts.map(e => {
      return {
        title: e.charAt(0).toUpperCase() + e.slice(1),
      };
    });
    setBreadcrumbItems(breadcrumbItems)
  }, []);

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {breadcrumbItems.map((item, key) => (
                <BreadcrumbItem key={key} active={key + 1 === breadcrumbItems.length}>
                  <Link to="#">{item.title}</Link>
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

Breadcrumb.propTypes = {
  breadcrumbItems: PropTypes.array,
  title: PropTypes.string,
};

export default Breadcrumb;
