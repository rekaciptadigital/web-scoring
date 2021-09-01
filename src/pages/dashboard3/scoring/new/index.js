import React from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
    Label,
    Row,
    Col,
} from 'reactstrap'
import { SelectInput } from 'components'
import { Link } from 'react-router-dom'
import { dummyConstants } from '../../../../constants'
import copy from '../../../../assets/images/myachery/copy.png'

function ScoringNew() {
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Dashboard | List - Member</title>
                </MetaTags>
                <Container fluid>
                <Row>
                    <Col md={6}>
                    <Button color="outline-dark">{'<-'}</Button>
                    <span style={{marginLeft: '0.5rem'}}>Kembali ke Dashboard</span>
                    </Col>
                    <Col md={6}>
                    <Button className="float-end">Simpan</Button>
                    </Col>
                </Row>
                <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                    <Link className="text-black-50">Edit Event</Link>
                    <Link to='/dashboard/category' className="text-black-50">List Kategori</Link>
                    <Link to='/dashboard/member' className="text-black-50">List Peserta</Link>
                    <Link to='/dashboard/scoring'>Set Scoring</Link>
                    <Link className="text-black-50">Hasil Scoring</Link>
                </div>
                <div className="mb-4">
                    <Label>Kategori Lomba</Label>
                    <div className="w-25">
                        <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            />
                    </div>
                    <Label className="mt-4">Set Sistem Scoring</Label>
                    <div>
                        <Row>
                            <Col md={2}>
                            <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            placeholder="Jumlah Sesi"
                            />
                            </Col>
                            <Col md={2}>
                            <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            placeholder="Jenis Babak"
                            />
                            </Col>
                            <Col md={2}>
                            <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            placeholder="Rambahan"
                            />
                            </Col>
                            <Col md={2}>
                            <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            placeholder="Jumlah Shoot"
                            />
                            </Col>
                            <Col md={2}>
                            <SelectInput 
                            name='category'
                            options={dummyConstants.eventAgeCategories}
                            placeholder="Target Face"
                            />
                            </Col>
                            <Col md={2}>
                            <img src={copy} className='pt-2' />
                            </Col>
                        </Row>
                    </div>
                </div>
                <Button color="outline-dark">Tambah Scoring</Button>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ScoringNew
