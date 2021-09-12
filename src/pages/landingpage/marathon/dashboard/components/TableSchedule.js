import React, { Component } from "react"
import { Row, Col, Button} from "reactstrap"

// datatable related plugins
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
 
} from 'react-bootstrap-table2-paginator';

import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// Data for dummy
import { dummyConstants } from '../../../../../constants'


class TableSchedule extends Component {

  constructor(props) {
    super(props)
    this.state = {
      productData: dummyConstants.qualificationSchedule,
    }
  }
  
  render() {
    const columns = [{
      dataField: 'date',
      text: 'Tanggal',
      sort: true
    }, 
    {
    dataField: 'session',
    text: 'Sesi',
    sort: true
    }, 
    {
    dataField: 'time',
    text: 'Waktu',
    sort: true
    }, 
    {
    dataField: 'quota',
    text: 'Kuota Terisi',
    sort: true
    },
    {
    dataField: 'id',
    formatter: () => {
        return (
        <div>
            <Button className="btn-success">Pilih Sesi</Button>
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

    return (
      <React.Fragment>
        <div className="col-11">
          <PaginationProvider
            pagination={paginationFactory(pageOptions)}
            keyField='id'
            columns={columns}
            data={this.state.productData}
        >
            {({ paginationTableProps }) => (
            <ToolkitProvider
                keyField='id'
                columns={columns}
                data={this.state.productData}
                search
            >
                {toolkitProps => (
                <React.Fragment>

                    <Row>
                    <Col xl="12">
                        <div className="table-responsive">
                        <BootstrapTable
                            keyField={"id"}
                            responsive
                            bordered={false}
                            striped={false}
                            defaultSorted={defaultSorted}
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
                </React.Fragment>
                )
                }
            </ToolkitProvider>
            )
            }</PaginationProvider>
                
        </div>
      </React.Fragment>
    )
  }
}

export default TableSchedule
