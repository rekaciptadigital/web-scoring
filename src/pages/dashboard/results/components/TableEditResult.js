import React, { useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

// Plugin terkait datatable
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data untuk dummy
import { dummyConstants } from '../../../../constants';

// Functional Component untuk TableEditResult
const TableEditResult = () => {
  // State untuk pagination dan data hasil edit
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [productData] = useState(dummyConstants.editResult);  // Data hasil edit dari dummy

  // Definisi kolom untuk tabel
  const columns = [
    {
      dataField: 'id',
      text: 'Id',
    },
    {
      dataField: 'shoot',
      text: 'Shoot',
      // Formatter untuk kolom shoot
      formatter: (cell, row) => {
        return (
          <div>
            <div className="d-flex">
              {row.shoot.map((item, index) => (
                <span key={index} className="badge badge-soft-info font-size-12">{item}</span>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      dataField: 'score',
      text: 'Score',
      sort: true
    },
    {
      dataField: 'hit',
      text: 'Hit',
      sort: true
    },
    {
      dataField: 'ten',
      text: '10s',
      sort: true
    },
    {
      dataField: 'x',
      text: 'Xs',
      sort: true
    },
    {
      dataField: 'action',
      text: 'Action',
      // Formatter untuk kolom action
      formatter: () => {
        return (
          <button className="btn btn-sm btn-primary">
            Edit
          </button>
        );
      }
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

export default TableEditResult;
