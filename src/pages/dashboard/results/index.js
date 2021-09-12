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
import TableResult from './components/TableResult'
import { dummyConstants } from '../../../constants'

function ListResult() {
    return (
        <React.Fragment>
        <div className="page-content">
            <MetaTags>
                <title>Dashboard | List - Hasil</title>
            </MetaTags>
            <Container fluid>
            <Link to="/dashboard">
                <Button color="outline-dark">{'<-'}</Button>
            </Link>
            <span style={{marginLeft: '0.5rem'}}>Kembali ke Dashboard</span>
            <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                <Link className="text-black-50">Edit Event</Link>
                <Link to='/dashboard/category' className="text-black-50">List Kategori</Link>
                <Link to='/dashboard/member' className="text-black-50">List Peserta</Link>
                <Link to='/dashboard/scoring' className="text-black-50">Set Scoring</Link>
                <Link to='/dashboard/result'>Hasil Scoring</Link>
            </div>
            <div className="mb-4">
                <h6>Hasil Scoring</h6>
                <div>
                    <Row>
                        <Col md={2} sm={12}>
                            {/* <div className="d-block d-md-flex justify-content-between"> */}
                                <SelectInput
                                label="Jenis Babak:"
                                    name='jenis'
                                    onChange={(e) => console.log(e)}
                                    options={dummyConstants.eventAgeCategories}
                                    />
                        </Col>
                        <Col md={2}>
                                <SelectInput
                                label="Jenis Regu:"
                                    name='jenis'
                                    onChange={(e) => console.log(e)}
                                    options={dummyConstants.eventAgeCategories}
                                    />
                        </Col>
                        <Col md={2}>
                                <SelectInput
                                label="Kategori Lomba:"
                                    name='jenis'
                                    onChange={(e) => console.log(e)}
                                    options={dummyConstants.eventAgeCategories}
                                    />
                        </Col>
                        <Col md={2}>
                                <SelectInput
                                label="Jarak:"
                                    name='jenis'
                                    onChange={(e) => console.log(e)}
                                    options={dummyConstants.eventAgeCategories}
                                    />
                        </Col>
                        <Col md={2} style={{paddingTop: '1.8rem'}}>
                            <Button color='primary' style={{width: '86.28px'}}>Search</Button>
                        {/* </div> */}
                        </Col>
                        <Col md={2} style={{paddingTop: '1.8rem'}}>
                            <Link to="/dashboard/result/bagan">
                                <Button color='outline-dark' className="float-md-end">Lihat Bagan</Button>
                            </Link>
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
            <TableResult />
            </Container>
        </div>
    </React.Fragment>
    )
}

export default ListResult
