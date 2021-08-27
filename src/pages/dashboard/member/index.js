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
import TableMember from './components/TableMember'
import { dummyConstants } from '../../../constants'

function ListMember() {

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Member</title>
                </MetaTags>
                <Container fluid>
                <Button color="primary">{'<-'}</Button>
                <span style={{marginLeft: '0.5rem'}}>Kembali ke Dashboard</span>
                <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                    <Link className="text-black-50">Edit Event</Link>
                    <Link to='/dashboard/category' className="text-black-50">List Kategori</Link>
                    <Link to='/dashboard/member'>List Peserta</Link>
                    <Link to='/dashboard/scoring' className="text-black-50">Set Scoring</Link>
                    <Link className="text-black-50">Hasil Scoring</Link>
                </div>
                <div className="mb-4">
                    <h6>Data Peserta</h6>
                    <div>
                        <Row>
                            <Col md={3} sm={12}>
                                {/* <div className="d-block d-md-flex justify-content-between"> */}
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                            </Col>
                            <Col md={3}>
                                    <SelectInput
                                        name='jenis'
                                        onChange={(e) => console.log(e)}
                                        options={dummyConstants.eventAgeCategories}
                                        />
                                        </Col>
                                    <Col md={3}>

                                    <Button color='primary mt-md-0 mt-3' style={{width: '86.28px'}}>Search</Button>
                                {/* </div> */}
                            </Col>
                            <Col md={3} sm={12}>
                                <div className="d-block d-md-flex mt-md-0 mt-3 justify-content-end">
                                    <Button className="bg-white"><span className="text-black-50">Unduh Data</span></Button>
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
                <TableMember />
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListMember
