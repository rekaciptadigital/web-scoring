import React from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Col,
    Row,
} from 'reactstrap'
import { SelectInput } from 'components'
import { Link } from 'react-router-dom'
import TableSchedule from './components/TableSchedule'
import { dummyConstants } from '../../../constants'
import { DateInput } from "components"

function ListMember() {

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Member</title>
                </MetaTags>
                <Container fluid>
                <Link to="/dashboard">
                    <Button color="outline-dark">{'<-'}</Button>
                </Link>
                <span style={{marginLeft: '0.5rem'}}>Kembali ke Dashboard</span>
                <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                    <h3 style={{letterSpacing: '2px'}}>Jadwal Kualifikasi</h3>
                </div>
                <div className="mb-4">
                    <h6>Data Peserta</h6>
                    <div>
                        <Row>
                            <Col md={2} sm={12}>
                                {/* <div className="d-block d-md-flex justify-content-between"> */}
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                            </Col>
                            <Col md={2}>
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                                        </Col>
                                    <Col md={2}>


                                    <DateInput />
                                {/* </div> */}
                            </Col>
                            <Col md={3}>
                                    <Button color='primary mt-md-0 mt-3' style={{width: '86.28px'}}>Search</Button>
                            </Col>
                            <Col md={3} sm={12}>
                                <div className="d-block d-md-flex mt-md-0 mt-3 justify-content-end">
                                    <Button color="outline-dark">Unduh Data</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="d-flex justify-content-between" style={{width: '100px'}}>
                        <Link>U-12</Link>
                        <Link className="text-black-50">Umum</Link>
                    </div>
                    <hr />
                </div>
                <TableSchedule />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListMember
