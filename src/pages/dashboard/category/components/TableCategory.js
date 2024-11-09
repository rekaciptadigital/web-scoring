import React, { useMemo, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

// Datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data for dummy
import { dummyConstants } from '../../../../constants';

// Import Breadcrumb
import './sass/datatables.scss';

const TableCategory = React.memo(() => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [productData] = useState(dummyConstants.category);

  // Memoize columns definition to avoid unnecessary re-renders
  const columns = useMemo(() => [
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
      dataField: 'death_bird',
      text: 'Batas Lahir',
      sort: true,
    },
    {
      dataField: 'arange',
      text: 'Jarak',
      sort: true,
    },
    {
      dataField: 'kuota',
      text: 'Kuota Terisi',
      sort: true,
    },
    {
      dataField: 'registrasi',
      text: 'Biaya Registrasi',
    },
    {
      dataField: 'status',
      text: 'Status',
      formatter: (cell, row) => {
        return (
          <div>
            <span className={`${row.status ? "bg-danger" : "bg-success"} text-white rounded-3 px-2`}>{row.status ? "Full Booked" : "On Sale"}</span>
          </div>
        );
      },
    }
  ], []);

  return (
    <Card>
      <CardBody>
        <ToolkitProvider
          keyField="id"
          data={productData}
          columns={columns}
          search
        >
          {toolkitProps => (
            <div>
              <BootstrapTable
                {...toolkitProps.baseProps}
                pagination={paginationFactory({
                  page,
                  sizePerPage,
                  onPageChange: setPage,
                  onSizePerPageChange: setSizePerPage
                })}
                wrapperClasses="table-responsive"
              />
            </div>
          )}
        </ToolkitProvider>
      </CardBody>
    </Card>
  );
});

export default TableCategory;
