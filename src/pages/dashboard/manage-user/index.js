import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { Modal, ModalBody } from "reactstrap";
import { Col, Row } from "reactstrap";

import {
  AlertSubmitError,
  LoadingScreen,
  ButtonBlue,
  // ButtonOutlineBlue,
  // ButtonGhostBlue,
  ButtonOutlineRed,
  ButtonTransparancy,
  AlertConfirmAction,
} from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { Breadcrumb } from "./components/breadcrumb";
import { ProcessingToast } from "./components/processing-toast";
import { FieldInputText } from "./components/field-input-text";
import { AlertSuccess } from "./components/alert-success";
import DataEmpty from "./components/dataempty";
import UserTable from "./components/list-user";
import IconXCircle from "components/ma/icons/mono/x-circle";
import TriangeAlert from "assets/images/triangle-alert.png";

import { ManageUserService } from "services";

function PageManageUser() {
  const { event_id } = useParams();

  const [isError, setError] = React.useState({ error: false, message: {} });
  const [isValid, setValid] = React.useState(false);
  const [isSucces, setSucces] = React.useState([false, ""]);
  const [listAdmin, setAdmin] = React.useState();
  const [isLoading, setLoading] = React.useState();
  const [isOpen, setOpen] = React.useState(false);
  const [isDetail, setDetail] = React.useState(false);
  const [detailData, setDataDetail] = React.useState({ admin_id: null, event_id: event_id });
  const [isConfirm, setConfirm] = React.useState(false);

  const initialValue = {
    email: null,
    name: null,
    phone_number: null,
    role_id: 6,
    event_id: event_id,
  };

  const [values, setValue] = React.useState(initialValue);

  const handeValueChange = (e) => {
    setValid(false);
    const { name, value } = e.target;
    if (name == "email") {
      const cekMail = ManageUserService.cekEmail({ event_id: event_id, email: value });
      cekMail.then(function (result) {
        if (result.message == "Failed" || result.message == "email ini sudah terdaftar") {
          setValid(true);
        }
        if (result.message == "Success") {
          setValue((prevState) => ({
            ...prevState,
            name: result?.data?.name,
            phone_number: result?.data?.phoneNumber,
          }));
        }
      });
    }
    setValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    ManageUserService.listAdmin({ event_id: event_id }).then((result) => {
      setAdmin(result.data);
    });
  }, [isSucces]);

  const onConfirm = () => {
    setLoading(true);
    const InviteAdmin = ManageUserService.inviteAdmin(values);
    InviteAdmin.then(function (result) {
      if (result.message === "Failed") {
        setError({ error: true, message: result.errors });
      }
      if (result.message === "Success") {
        setSucces([true, "User telah berhasil ditambahkan ke dalam sistem"]);
        setValue(initialValue);
        setOpen(false);
      }
      setLoading(false);
    });
  };

  const handleAddPengelola = () => {
    setOpen(true);
  };

  const confirmError = () => {
    setError({ error: false, message: {} });
  };

  const hadnleConfirmDelet = () => {
    setLoading(true);
    const removeAdmin = ManageUserService.removeAdmin({
      event_id: event_id,
      admin_id: detailData.id,
    });
    removeAdmin.then((ress) => {
      if (ress.message === "Success") {
        setSucces([true, "User telah berhasil dihapus dari sistem"]);
        setDetail(false);
      }
      setLoading(false);
    });
  };

  return (
    <ContentLayoutWrapper pageTitle="Manajemen Pengelola">
      <ProcessingToast />
      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError.error} errors={isError.message} onConfirm={confirmError} />
      <AlertSuccess
        isSuccess={isSucces[0]}
        buttonLabel="Kembali ke Management User"
        description={isSucces[1]}
        onConfirm={() => setSucces([false, ""])}
      />
      <div>
        <Breadcrumb label="Dashboard" to="/dashboard" />
      </div>

      <CardSheet>
        <Row>
          <Col>
            <CardTitle>Manajemen Pengelola</CardTitle>
          </Col>
          <Col>
            <div
              className="d-flex justify-content-end"
              style={{ position: "relative", gap: "0.5rem" }}
            >
              <ButtonBlue onClick={handleAddPengelola}>Tambah Pengelola</ButtonBlue>
            </div>
          </Col>
        </Row>
        {listAdmin?.length > 0 ? (
          <UserTable
            setOpen={setDetail}
            data={listAdmin}
            detailData={setDataDetail}
            event_id={event_id}
          />
        ) : (
          <DataEmpty />
        )}
      </CardSheet>

      <Modal
        isOpen={isOpen}
        size="lg"
        centered
        backdrop="static"
        autoFocus
        toggle={() => setOpen((open) => !open)}
        onClosed={() => setOpen(false)}
      >
        <ModalBody>
          <div style={{ textAlign: "start" }}>
            <Row>
              <Col>
                <h2>Tambah Pengelola</h2>
                <span>Lengkapi data user dibawah ini</span>
              </Col>
              <Col>
                <span className="d-flex justify-content-end">
                  <ButtonTransparancy onClick={() => setOpen(false)}>
                    <IconXCircle />
                  </ButtonTransparancy>
                </span>
              </Col>
            </Row>
          </div>
          <div style={{ height: "350px", textAlign: "left" }}>
            <form>
              <FormInput>
                <FieldInputText
                  label="Email"
                  name="email"
                  placeholder="Cari email"
                  type="text"
                  required
                  value={values?.email}
                  errors={true}
                  onChange={handeValueChange}
                />
                {isValid && <ValidEmail>Email sudah terdaftar</ValidEmail>}
                <FieldInputText
                  label="Nama Lengkap"
                  name="name"
                  placeholder="Masukkan nama lengkap"
                  required
                  value={values?.name}
                  onChange={handeValueChange}
                />
                <FieldInputText
                  label="Nomor Telepon"
                  name="phone_number"
                  placeholder="Masukkan nomor telepon"
                  required
                  type="number"
                  value={values?.phone_number}
                  onChange={handeValueChange}
                />
                <FieldInputText
                  label="Status User"
                  value="Pengolah Data"
                  disabled={true}
                 />
              </FormInput>
            </form>
          </div>
          <span className="d-flex justify-content-end" style={{ gap: "0.5rem", width: "100%" }}>
            <ButtonBlue onClick={onConfirm} disabled={isValid}>
              Simpan
            </ButtonBlue>
          </span>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={isDetail}
        size="lg"
        centered
        backdrop="static"
        autoFocus
        toggle={() => setDetail((open) => !open)}
        onClosed={() => setDetail(false)}
      >
        <ModalBody>
          <div style={{ textAlign: "start" }}>
            <Row>
              <Col>
                <h2>Detail User</h2>
                <span>Berikut adalah data user</span>
              </Col>
              <Col>
                <span className="d-flex justify-content-end">
                  <ButtonTransparancy onClick={() => setDetail(false)}>
                    <IconXCircle />
                  </ButtonTransparancy>
                </span>
              </Col>
            </Row>
          </div>
          <div style={{ height: "250px", textAlign: "left" }}>
            <table className="table">
              <tbody>
                <tr>
                  <th width="150px">Email</th>
                  <th width="30px">:</th>
                  <td>{detailData?.email}</td>
                </tr>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>:</th>
                  <td>{detailData?.name}</td>
                </tr>
                <tr>
                  <th>Nomor Telepon</th>
                  <th>:</th>
                  <td>{detailData?.phoneNumber}</td>
                </tr>
                <tr>
                  <th>Status User</th>
                  <th>:</th>
                  <td>{detailData?.roleName}</td>
                </tr>
              </tbody>
            </table>
            <span className="d-flex justify-content-end">
              <ButtonOutlineRed onClick={() => setConfirm(true)}>Hapus Pengelola</ButtonOutlineRed>
            </span>
          </div>
        </ModalBody>
      </Modal>

      <AlertConfirmAction
        shouldConfirm={isConfirm}
        onConfirm={hadnleConfirmDelet}
        onClose={() => setConfirm(false)}
        labelCancel="Tidak, kembali"
        labelConfirm="Ya, hapus"
      >
        <img src={TriangeAlert} />
        <h2>Perhatian !</h2>
        Apakah Anda yakin akan menghapus user dari sistem?
      </AlertConfirmAction>
    </ContentLayoutWrapper>
  );
}

/* ============================ */
// styles

const CardSheet = styled.div`
      position: relative;
      margin-bottom: 24px;

      padding: 35px;
      border: 0 solid #f6f6f6;
      border-radius: 8px;
      background-color: #ffffff;
      background-clip: border-box;
      box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);

  > * + * {
        margin - top: 1.5rem;
  }
      `;

const CardTitle = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 36px;
  margin-bottom: 30px;
`;

const FormInput = styled.div`
  margin-top: 10px;

  > * + * {
    margin-top: 0.75rem;
  }
`;

const ValidEmail = styled.span`
  color: var(--ma-red);
  font-size: 12px;
`;

export default PageManageUser;
