import React, { useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

// Plugin terkait datatable
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data untuk dummy
import { dummyConstants } from '../../../../constants';

// Import stylesheet untuk datatables
import './sass/datatables.scss';

// Functional Component untuk TableScoring
const TableScoring = () => {
  // State untuk pagination dan data scoring
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [productData] = useState(dummyConstants.scoring);  // Data scoring dari dummy

  // Definisi kolom untuk tabel
  const columns = [
    {
      dataField: 'id',
      text: 'Id',
      sort: true,
    },
    {
      dataField: 'class',
      text: 'Kelas',
      sort: true,
    },
    {
      dataField: 'arange',
      text: 'Jarak',
      sort: true,
    },
    {
      dataField: 'session',
      text: 'Sesi',
      sort: true,
    },
    {
      dataField: 'score',
      text: 'Score',
      sort: true,
    },
    {
      dataField: 'status',
      text: 'Status',
      // Formatter untuk kolom status
      formatter: (cell, row) => {
        return (
          <span className={`${row.status ? "bg-success" : "bg-danger"} text-white rounded-3 px-2`}>
            {row.status ? "Completed" : "Pending"}
          </span>
        );
      },
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

export default TableScoring;
