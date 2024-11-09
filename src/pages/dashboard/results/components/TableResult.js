import React, { useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

// Plugin terkait datatable
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';

// Data untuk dummy
import { dummyConstants } from '../../../../constants';

// Functional Component untuk TableResult
const TableResult = () => {
  // State untuk pagination dan data hasil
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [productData] = useState(dummyConstants.result);  // Data hasil dari dummy

  // Definisi kolom untuk tabel
  const columns = [
    {
      dataField: 'id',
      text: 'Id',
      sort: true,
    },
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
    },
    {
      dataField: 'code',
      text: 'Kode',
      sort: true,
    },
    {
      dataField: 'date',
      text: 'Tanggal',
      sort: true,
    },
    {
      dataField: 'action',
      text: 'Action',
      // Formatter untuk kolom action
      formatter: () => {
        return (
          <Link to="#" className="btn btn-sm btn-primary">
            View
          </Link>
        );
      },
    },
  ];

  return (
    <Row>
      <Col>
        <Card>
          <CardBody>
            <ToolkitProvider
              keyField="id"
              data={productData}
              columns={columns}
              search
            >
              {(props) => (
                <div>
                  {/* Komponen BootstrapTable dengan konfigurasi yang diperbarui */}
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory({
                      page,
                      sizePerPage,
                      onPageChange: setPage,
                      onSizePerPageChange: (sizePerPage, page) => {
                        setSizePerPage(sizePerPage);
                        setPage(page);
                      },
                    })}
                    striped
                    hover
                  />
                </div>
              )}
            </ToolkitProvider>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TableResult;
