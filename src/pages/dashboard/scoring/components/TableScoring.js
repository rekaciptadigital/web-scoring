import React, { Component } from "react"
import { Row, Col, Card, CardBody } from "reactstrap"

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider, PaginationListStandalone,
  SizePerPageDropdownStandalone
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data for dummy
import { dummyConstants } from '../../../../constants'

//Import Breadcrumb
import './sass/datatables.scss'

class TableScoring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      sizePerPage: 10,
      productData: dummyConstants.scoring
    }

  }

  render() {

    const columns = [{
      dataField: 'id',
      text: 'Id',
      sort: true,
    }, {
      dataField: 'class',
      text: 'Kelas',
      sort: true
    }, {
      dataField: 'arange',
      text: 'Jarak',
      sort: true
    }, {
      dataField: 'session',
      text: 'Jumlah Sesi',
      sort: true
    }, {
      dataField: 'rambahan',
      text: 'Rambahan',
      sort: true
    }, {
      dataField: 'shoot',
      text: 'Jumlah Shoot',
      sort: true
    }, {
      dataField: 'target_face',
      text: 'Target Face',
      sort: true
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: () => {
        return (
          <div>
            <span><i className="bx bx-edit"></i></span>
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
      totalSize: dummyConstants.scoring.length, // replace later with size(customers),
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
              <Col>
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
                                <Col>
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
                                <Col>
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

export default TableScoring
