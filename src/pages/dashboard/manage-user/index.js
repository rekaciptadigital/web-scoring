import * as React from "react";
// import { Link } from "react-router-dom";
import styled from "styled-components";
// import { useSelector } from "react-redux";
// import * as AuthStore from "store/slice/authentication";
// import { useProfileForm } from "./hooks/profile-form";
// import { useSubmitProfile } from "./hooks/submit-profile";
// import { usePasswordForm } from "./hooks/password-form";
// import { useSubmitPassword } from "./hooks/submit-password";

import {
  // AlertSubmitError,
  // LoadingScreen,
  ButtonBlue,
  // ButtonOutlineBlue,
  // ButtonGhostBlue,
  ButtonSecondaryBlue,
  ButtonTransparancy
} from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { Breadcrumb } from "./components/breadcrumb";
// import { AvatarUploader } from "./components/avatar-uploader";
import { ProcessingToast } from "./components/processing-toast";
import { FieldInputText } from "./components/field-input-text";
// import { FieldSelectProvince } from "./components/field-select-province";
// import { FieldSelectCity } from "./components/field-select-city";
// import { AlertSuccess } from "./components/alert-success";
import { Col, Row } from "reactstrap";
import DataEmpty from "./components/dataempty";
import UserTable from "./components/list-user";
import SweetAlert from "react-bootstrap-sweetalert";
import IconXCircle from "components/ma/icons/mono/x-circle";

function PageManageUser() {
  const [isAlertOpen, setAlertOpen] = React.useState(false);
  // const {
  //   // submit,
  //   isLoading: isSubmiting,
  //   isError,
  //   errors,
  //   isSuccess,
  // } = useSubmitProfile(userProfile, values);

  // const handleSubmit = (ev) => {
  //   ev.preventDefault();
  //   submit();
  // };

  const onConfirm = () => {
    setAlertOpen(true)
  }

  const onCancel = () => {
    console.log('click');
    setAlertOpen(false);
  };

  return (
    <ContentLayoutWrapper pageTitle="Manajemen Pengelola">
      <ProcessingToast />
      {/* <LoadingScreen loading={isSubmiting} /> */}
      {/* <AlertSubmitError isError={isError} errors={errors} /> */}
      {/* <AlertSuccess
        isSuccess={isSuccess}
        buttonLabel="Kembali"
        description="Profil Anda berhasil diperbarui"
      /> */}
      <div>
        <Breadcrumb label="Dashboard" to="/dashboard" />
      </div>

      <CardSheet>
        <CardTitle>Manajemen Pengelola</CardTitle>

        <Row>
          <Col>
            <ButtonSecondaryBlue>Semua</ButtonSecondaryBlue>
            <ButtonTransparancy>Pengelola Data</ButtonTransparancy>
            <ButtonTransparancy>Scorer</ButtonTransparancy>
          </Col>
          <Col>
            <div className="d-flex justify-content-end" style={{ position: "relative", gap: "0.5rem" }}>
              <ButtonBlue onClick={onConfirm}>Tambah Pengelola</ButtonBlue>
            </div>
          </Col>
        </Row>
        <UserTable />
        <DataEmpty />
      </CardSheet>

      <SweetAlert
        show={isAlertOpen}
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
              <h2>Tambah Pengelola</h2>
              <span>Lengkapi data user dibawah ini</span>
            </Col>
            <Col>
              <span className="d-flex justify-content-end">
                <ButtonTransparancy onClick={onCancel}><IconXCircle /></ButtonTransparancy>
              </span>
            </Col>
          </Row>

        </div>
        <div style={{ height: "300px", textAlign: 'left' }}>
          <form>
            <FormInput>
              <FieldInputText
                label="Email"
                name="email"
                placeholder="Cari email"
                required
              />
              <FieldInputText
                label="Nama Lengkap"
                name="name"
                placeholder="Masukkan nama lengkap"
                required
              />
              <FieldInputText
                label="Nomor Telepon"
                name="no_telepon"
                placeholder="Masukkan nomor telepon"
                required
                type="number"
              />
              <FieldInputText
                label="Status User"
                name="status"
                placeholder="Masukkan nama penyelenggara"
                readOnly
                value="Pengolah Data"
              />
            </FormInput>
          </form>
        </div>
      </SweetAlert>


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
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 28px;
      line-height: 36px;
      margin-bottom: 30px;
`;

// const EditorDisplay = styled.div`
//   display: flex;
//   gap: 1rem;
//   align-items: flex-end;

//   > *:nth-child(1) {
//     flex-grow: 1;
//   }

//   > *:nth-child(2) {
//     flex-shrink: 0;
//   }
// `;

const FormInput = styled.div`
    margin-top: 10px;  

    > * + * {
      margin-top: 0.75rem;
    }
`;

export default PageManageUser;
