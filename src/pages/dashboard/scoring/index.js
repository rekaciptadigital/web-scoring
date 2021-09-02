import React, { useState } from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Card,
    CardBody,
    Row,
    Col,
} from 'reactstrap'
import { SelectInput } from 'components'
import { Link } from 'react-router-dom'
import TableScoring from './components/TableScoring'
import setscore from '../../../assets/images/myachery/setscore.png'
import { dummyConstants } from '../../../constants'

function ListScoring() {

    const [open] = useState(true)

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Scoring</title>
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
                    <Link to='/dashboard/scoring'>Set Scoring</Link>
                    <Link to='/dashboard/result' className="text-black-50">Hasil Scoring</Link>
                </div>
                {  open ? (
                    <div className="mb-4">
                    <Card>
                        <CardBody className="d-flex justify-content-center" style={{height: '50vh', alignItems: 'center'}}>
                            <div style={{cursor: 'pointer'}}>
                                <Link to="/dashboard/scoring/new">
                                    <img src={setscore} />
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
                ):( <> 
                <div className="mb-4">
                    <h6>Kategori yang Dilombakan</h6>
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
                                    <Link to="/dashboard/scoring/new">
                                        <Button color="outline-dark">Tambah Scoring</Button>
                                    </Link>
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
                <TableScoring />
                </>
                )}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ListScoring
