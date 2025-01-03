import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

// Functional Component untuk Breadcrumb
const Breadcrumb = React.memo((props) => {
  const { title } = props;
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    // Mengambil path URL saat ini
    const path = window.location.pathname;
    const pathParts = path.slice(1).split("/");

    // Menghitung item breadcrumb berdasarkan path URL
    const breadcrumbItems = pathParts.map((part, index) => {
      return {
        title: part.charAt(0).toUpperCase() + part.slice(1),
        path: pathParts.slice(0, index + 1).join("/"),
      };
    });

    // Mengatur state breadcrumb items
    setBreadcrumbItems(breadcrumbItems);
  }, []); // Dependensi kosong, dijalankan sekali setelah komponen mount

  // Menggunakan useMemo jika ingin memoization lebih lanjut, misalnya:
  const memoizedBreadcrumbItems = useMemo(() => breadcrumbItems, [breadcrumbItems]);

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {memoizedBreadcrumbItems.map((item, index) => (
                <BreadcrumbItem 
                  key={`breadcrumb-${item.path}`} 
                  active={index + 1 === memoizedBreadcrumbItems.length}
                >
                  {index + 1 === memoizedBreadcrumbItems.length ? (
                    item.title
                  ) : (
                    <Link to={`/${item.path}`}>{item.title}</Link>
                  )}
                </BreadcrumbItem>
              ))}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
});

// Menentukan prop types untuk komponen
Breadcrumb.propTypes = {
  title: PropTypes.string,
};

export default Breadcrumb;
