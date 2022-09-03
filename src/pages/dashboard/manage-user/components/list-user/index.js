import * as React from "react";
// import styled from "styled-components";
import './style.css';
import {
    ButtonBlue,
    ButtonBlueOutline,
    ButtonTransparancy
} from "components/ma";
import SweetAlert from "react-bootstrap-sweetalert";
import { Col, Row } from "reactstrap";
import IconXCircle from "components/ma/icons/mono/x-circle";

function UserTable() {
    const [isOpenAlert, setIsOpenAlert] = React.useState(false);

    const onConfirm = () => {
        setIsOpenAlert(true)
    }

    const onCancel = () => {
        setIsOpenAlert(false);
    };

    return (
        <React.Fragment>
            <table className="table table-responsive">
                <thead>
                    <th>No</th>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th>No Telepon</th>
                    <th>Status User</th>
                    <th>Aksi</th>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td><ButtonBlueOutline onClick={onConfirm}>Detail</ButtonBlueOutline></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td>Tes</td>
                        <td><ButtonBlueOutline onClick={onConfirm}>Detail</ButtonBlueOutline></td>
                    </tr>
                </tbody>
            </table>

            <SweetAlert
                show={isOpenAlert}
                title=""
                onConfirm={() => { }}
                custom
                style={{ width: 900, borderRadius: "1.25rem" }}
                customButtons={
                    <span className="d-flex justify-content-end" style={{ gap: "0.5rem", width: "100%" }}>
                        <ButtonBlue onClick={onCancel}>Simpan</ButtonBlue>
                    </span>
                }
            >
                <div style={{ textAlign: "start" }}>
                    <Row>
                        <Col>
                            <h2>Detail User</h2>
                            <span>Berikut adalah data user</span>
                        </Col>
                        <Col>
                            <span className="d-flex justify-content-end">
                                <ButtonTransparancy onClick={onCancel}><IconXCircle /></ButtonTransparancy>
                            </span>
                        </Col>
                    </Row>

                </div>
                <div style={{ height: "200px", textAlign: 'left' }}>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th width="150px">Email</th>
                                <th width="30px">:</th>
                                <td>Tes User</td>
                            </tr>
                            <tr>
                                <th>Nama Lengkap</th>
                                <th>:</th>
                                <td>Tes User</td>
                            </tr>
                            <tr>
                                <th>Nomor Telepon</th>
                                <th>:</th>
                                <td>Tes User</td>
                            </tr>
                            <tr>
                                <th>Status User</th>
                                <th>:</th>
                                <td>Tes User</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </SweetAlert>


        </React.Fragment>
    )
}

// const FormInput = styled.div`
//     margin-top: 10px;  

//     > * + * {
//       margin-top: 0.75rem;
//     }
// `;

export default UserTable;