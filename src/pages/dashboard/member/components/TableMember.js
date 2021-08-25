import React, { Component } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

//Import Breadcrumb
import './sass/datatables.scss'

// Table data
const products = [
  {"id": 1, "name": "Asep", "email": "asep@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 1},
  {"id": 2, "name": "Jamal", "email": "jamal@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 3, "name": "Taufik", "email": "taufik@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 0},
  {"id": 4, "name": "Arif", "email": "arif@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 5, "name": "Laisa", "email": "laisa@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "wanita", "status": 1},
  {"id": 6, "name": "Wade Warren", "email": "wa-de@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 7, "name": "Udien", "email": "udien@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 0},
];

class TableMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      sizePerPage: 10,
      productData: products
    }

  }

  render() {

    const columns = [{
      dataField: 'id',
      text: 'Id',
      sort: true,
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true
    }, {
      dataField: 'email',
      text: 'Email',
      sort: true
    }, {
      dataField: 'telepon',
      text: 'Telepon',
      sort: true
    }, {
      dataField: 'club',
      text: 'Club',
      sort: true
    }, {
      dataField: 'age',
      text: 'Usia',
    }, {
      dataField: 'gender',
      text: 'Gender',
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: (cell, row) => {
        return (
          <div>
            <span className={`${row.status ? "bg-success" : "bg-warning"} text-white rounded-3 px-2`}>{row.status ? "Completed" : "Pending"}</span>
          </div>
        )
      }
    }
];

    const defaultSorted = [{
      dataField: 'id',
      order: 'asc'
    }];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: products.length, // replace later with size(customers),
      custom: true,
    }

    // Custom Pagination Toggle
    // const sizePerPageList = [
    //   { text: '5', value: 5 },
    //   { text: '10', value: 10 },
    //   { text: '15', value: 15 },
    //   { text: '20', value: 20 },
    //   { text: '25', value: 25 },
    //   { text: 'All', value: (this.state.productData).length }];

  
    // Select All Button operation
    const selectRow = {
      mode: 'checkbox'
    }

    // const { SearchBar } = Search;

    return (
      <React.Fragment>
        <div>
          <div>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={this.state.productData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={this.state.productData}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>

                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      {/* <SearchBar
                                        {...toolkitProps.searchProps}
                                      /> */}
                                      {/* <i className="bx bx-search-alt search-icon" /> */}
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                      selectRow={selectRow}
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />

                                  </div>
                                </Col>
                              </Row>

                              <Row className="align-items-md-center mt-30">
                                <Col className="inner-custom-pagination d-flex">
                                  <div className="d-inline">
                                    <SizePerPageDropdownStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                  <div className="text-md-right ms-auto">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </React.Fragment>
                          )
                          }
                        </ToolkitProvider>
                      )
                      }</PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TableMember
