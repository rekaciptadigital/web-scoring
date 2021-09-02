import React from 'react'
import { MetaTags } from 'react-meta-tags'
import {
    Container,
    Button,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import TableEditResult from '../components/TableEditResult'

function EditResult() {
    return (
        <React.Fragment>
        <div className="page-content">
            <MetaTags>
                <title>Dashboard | Edit Hasil Scoring</title>
            </MetaTags>
            <Container fluid>
                <Link to="/dashboard/result">
                    <Button color="outline-dark">{'<-'}</Button>
                </Link>
            <span style={{marginLeft: '0.5rem'}}>List Hasil Scoring</span>
            <div className="mb-3 d-flex justify-content-around w-50 mt-md-0 mt-3 mx-auto">
                <Link className="text-black-50">Edit Event</Link>
                <Link to='/dashboard/category' className="text-black-50">List Kategori</Link>
                <Link to='/dashboard/member' className="text-black-50">List Peserta</Link>
                <Link to='/dashboard/scoring' className="text-black-50">Set Scoring</Link>
                <Link to='/dashboard/result'>Hasil Scoring</Link>
            </div>
            <div className="mt-5">
                <TableEditResult />
            </div>
            </Container>
        </div>
    </React.Fragment>
    )
}

export default EditResult
