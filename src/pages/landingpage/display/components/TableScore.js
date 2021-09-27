import React, { Component } from "react";
import { Row, Col } from "reactstrap";

// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";

// Data for dummy
import { dummyConstants } from "../../../../constants";

//Import Breadcrumb
import "./sass/datatables.scss";

class TableScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: 10,
      productData: dummyConstants.displayScore,
    };
  }

  render() {
    const columns = [
      {
        dataField: "pos",
        text: "Pos",
        sort: true,
      },
      {
        dataField: "athlete",
        text: "Athlete",
        sort: true,
      },
      {
        dataField: "country-code",
        text: "Country Code",
        sort: true,
      },
      {
        dataField: "state-code",
        text: "State Code",
        sort: true,
      },
      {
        dataField: "50m-1",
        text: "50m-1",
        sort: true,
      },
      {
        dataField: "50m-2",
        text: "50m-2",
        sort: true,
      },
      {
        dataField: "total",
        text: "Tot",
        sort: true,
      },
      {
        dataField: "10+x",
        text: "10+X",
        sort: true,
      },
      {
        dataField: "x",
        text: "X",
        sort: true,
      },
    ];

    const defaultSorted = [
      {
        dataField: "id",
        order: "asc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: dummyConstants.displayScore.length, // replace later with size(customers),
      custom: true,
    };

    // Custom Pagination Toggle
    // const sizePerPageList = [
    //   { text: '5', value: 5 },
    //   { text: '10', value: 10 },
    //   { text: '15', value: 15 },
    //   { text: '20', value: 20 },
    //   { text: '25', value: 25 },
    //   { text: 'All', value: (this.state.productData).length }];

    // const { SearchBar } = Search;

    return (
      <React.Fragment>
        <div className="col-12">
          <PaginationProvider
            pagination={paginationFactory(pageOptions)}
            keyField="id"
            columns={columns}
            data={this.state.productData}
          >
            {({ paginationTableProps }) => (
              <ToolkitProvider
                keyField="id"
                columns={columns}
                data={this.state.productData}
                search
              >
                {(toolkitProps) => (
                  <React.Fragment>
                    <Row>
                      <Col>
                        <div className="table-responsive">
                          <BootstrapTable
                          rowStyle={{cursor: 'default'}}
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            defaultSorted={defaultSorted}
                            classes={"table align-middle table-nowrap"}
                            headerWrapperClasses={"thead-light"}
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                          />
                        </div>
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </ToolkitProvider>
            )}
          </PaginationProvider>
        </div>
      </React.Fragment>
    );
  }
}

export default TableScore;
