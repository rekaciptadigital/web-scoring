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
import { dummyConstants } from '../../../constants'
import TableCategory from './components/TableCategory'

function ListCategory() {

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
                    <Link className="text-black-50">Edit Event</Link>
                    <Link to='/dashboard/category'>List Kategori</Link>
                    <Link to='/dashboard/member' className="text-black-50">List Peserta</Link>
                    <Link to='/dashboard/scoring' className="text-black-50">Set Scoring</Link>
                    <Link to='/dashboard/result' className="text-black-50">Hasil Scoring</Link>
                </div>
                <div className="mb-4">
                    <h6>Kategori yang Dilombakan</h6>
                    <div>
                        <Row>
                            <Col md={4} sm={12}>
                                {/* <div className="d-block d-md-flex justify-content-between"> */}
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                            </Col>
                            {/* <Col md={3}>
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                                        </Col> */}
                                    <Col md={4}>

                                    <Button color='primary mt-md-0 mt-3' style={{width: '86.28px'}}>Search</Button>
                                {/* </div> */}
                            </Col>
                            <Col md={4} sm={12}>
                                <div className="d-block d-md-flex mt-md-0 mt-3 justify-content-end">
                                    <Button color="outline-dark">Unduh Data</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="d-flex justify-content-between" style={{width: '170px'}}>
                        <Link>Traditional Bow</Link>
                        <Link className="text-black-50">Recurve</Link>
                    </div>
                    <hr />
                </div>
                <TableCategory />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListCategory
