import React from 'react'
import { Row, Col, Card, CardBody } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";

const TableOfficial = props => {
    const { data:members } = props;

    console.log(members);

    const columns = [
        {
            dataField: "No",
            text: "No",
        },
        {
            text: "Nama Official"
        },
        {
            text: "Nama Klub"
        },
        {
            text: "Email"
        },
        {
            text: "Telepon"
        },
        {
            text: "Kategori Pertandingan"
        },
        {
            dataField: "",
            text: "..."
        },
    ]

    const pageOptions = {
        sizePerPage: 10,
        custom: true,
    };
    
    const defaultSorted = [
        {
          dataField: "id",
          order: "asc",
        },
    ];

  return (
    <React.Fragment>
        <div>
            <Row>
                <Col className="col-12">
                    <Card>
                        <CardBody>
                            <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="id"
                            columns={columns}
                            data={members}
                            >
                            {({ paginationTableProps }) => (
                                <ToolkitProvider keyField="id" columns={columns} data={members} search>
                                {(toolkitProps) => (
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
                                            noDataIndication="Table is Empty"
                                            pagination={paginationFactory(pageOptions)}
                                            // selectRow={selectRow}
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

                        </CardBody>
                    </Card>
                </Col>
            </Row>
            


        </div>
    </React.Fragment>
  )
}

export default TableOfficial