import React, { useState } from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Col,
    Row,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import TableMember from './components/TableMember'

function ListMember() {
    const [isJenis, setIsJenis] = useState(false)
    const [isCategory, setIsCategory] = useState(false)

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
                    <Link className="text-black-50">List Kategori</Link>
                    <Link>List Peserta</Link>
                    <Link className="text-black-50">Set Scoring</Link>
                    <Link className="text-black-50">Hasil Scoring</Link>
                </div>
                <div className="mb-4">
                    <h6>Data Peserta</h6>
                    <div>
                        <Row>
                            <Col md={7} sm={12}>
                                <div className="d-block d-md-flex justify-content-between">
                                    <Dropdown
                                    isOpen={isJenis}
                                    toggle={() =>
                                    setIsJenis(!isJenis)
                                    }
                                    >
                                        <DropdownToggle
                                        tag="button"
                                        className="btn btn-outline-light d-flex justify-content-between"
                                        style={{width: '227.47px'}}
                                        >
                                        Jenis <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>{" "}

                                    <Dropdown
                                    className="mt-md-0 mt-3"
                                    isOpen={isCategory}
                                    toggle={() =>
                                    setIsCategory(!isCategory)
                                    }
                                    >
                                        <DropdownToggle
                                        tag="button"
                                        className="btn btn-outline-light d-flex justify-content-between"
                                        style={{width: '227.47px'}}
                                        >
                                        Kategori Lomba <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem>Action</DropdownItem>
                                        <DropdownItem>Another action</DropdownItem>
                                        <DropdownItem>Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>{" "}

                                    <Button color='primary mt-md-0 mt-3' style={{width: '86.28px'}}>Search</Button>
                                </div>
                            </Col>
                            <Col md={5} sm={12}>
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
