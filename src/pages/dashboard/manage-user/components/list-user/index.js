import * as React from "react";
import './style.css';
import {
    ButtonBlueOutline
  } from "components/ma";

function UserTable() {
    // const [isOpenAlert, setIsOpenAlert] = React.useState(false);

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
                        <td><ButtonBlueOutline>Detail</ButtonBlueOutline></td>
                    </tr>
                </tbody>
            </table>

            
        </React.Fragment>
    )
}

export default UserTable;