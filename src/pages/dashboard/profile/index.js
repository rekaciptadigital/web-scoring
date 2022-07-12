import * as React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useProfileForm } from "./hooks/profile-form";
import { useSubmitProfile } from "./hooks/submit-profile";

import { AlertSubmitError, LoadingScreen, ButtonBlue } from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { Breadcrumb } from "./components/breadcrumb";
import { AvatarUploader } from "./components/avatar-uploader";
import { ProcessingToast } from "./components/processing-toast";
import { FieldInputText } from "./components/field-input-text";
import { FieldSelectProvince } from "./components/field-select-province";
import { FieldSelectCity } from "./components/field-select-city";
import { AlertSuccess } from "./components/alert-success";

function PageUserProfile() {
  const { userProfile } = useSelector(AuthStore.getAuthenticationStore);
  const { values, setValue, isDirty } = useProfileForm(userProfile);
  const {
    submit,
    isLoading: isSubmiting,
    isError,
    errors,
    isSuccess,
  } = useSubmitProfile(userProfile, values);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    submit();
  };

  return (
    <ContentLayoutWrapper pageTitle="Profil Pengguna">
      <ProcessingToast />
      <LoadingScreen loading={isSubmiting} />
      <AlertSubmitError isError={isError} errors={errors} />
      <AlertSuccess isSuccess={isSuccess} />
      <div>
        <Breadcrumb label="Profil Event Organizer" to="/dashboard" />
      </div>

      <CardSheet>
        <div>
          <CardTitle>Data Penyelenggara Event</CardTitle>
        </div>

        <ProfileFormLayout>
          <div>
            <AvatarUploader />
            <UploadInstruction>
              Unggah foto Anda dengan ukuran 4x3, min. besar file 500kb, format PNG/JPEG untuk
              keperluan scoresheet, bagan, laporan, dan ID Card.
            </UploadInstruction>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <InputGrid>
                  <div>
                    <FieldInputText
                      label="Nama"
                      name="name"
                      placeholder="Masukkan nama penyelenggara"
                      required
                      value={values.name}
                      onChange={(value) => setValue("name", value)}
                    />
                    <InputInstruction>
                      Masukkan nama pribadi / organisasi / institusi / klub
                    </InputInstruction>
                  </div>

                  <FieldInputText
                    label="Email"
                    placeholder="Masukkan email"
                    required
                    value={userProfile?.email}
                    disabled
                    readOnly
                  />

                  <FieldSelectProvince
                    value={values.provinceId}
                    onChange={(value) => setValue("provinceId", value)}
                  />

                  <FieldSelectCity
                    provinceId={values.provinceId}
                    value={values.cityId}
                    onChange={(value) => setValue("cityId", value)}
                  />

                  <FieldInputText
                    label="Nomor Telepon"
                    placeholder="Masukkan nomor telepon (nomor WhatsApp)"
                    required
                    value={values.phone}
                    onChange={(value) => setValue("phone", value)}
                  />
                </InputGrid>
              </div>

              <BottomAction>
                <ButtonBlue flexible disabled={!isDirty}>
                  Simpan
                </ButtonBlue>
              </BottomAction>
            </form>
          </div>
        </ProfileFormLayout>
      </CardSheet>
    </ContentLayoutWrapper>
  );
}

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
    margin-top: 1.5rem;
  }
`;

const CardTitle = styled.h5`
  font-weight: 600;
`;

const ProfileFormLayout = styled.div`
  display: flex;
  gap: 4rem;

  > *:nth-child(1) {
    width: 11.25rem;
    flex-shrink: 0;

    > * + * {
      margin-top: 1rem;
    }
  }

  > *:nth-child(2) {
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    > * + * {
      margin-top: 1.5rem;
    }

    > *:nth-child(1) {
      flex-grow: 1;
    }

    > *:nth-child(2) {
      flex-shrink: 0;
    }
  }
`;

const UploadInstruction = styled.p`
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--ma-gray-50);
  color: var(--ma-gray-500);
  font-size: 0.875em;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-auto-rows: minmax(5.5rem, auto);
  gap: 0.5rem 1.5rem;
`;

const InputInstruction = styled.p`
  margin: 0;
  margin-top: 0.375rem;
  border-radius: 0.5rem;
  color: var(--ma-gray-500);
  font-size: 0.875em;
`;

const BottomAction = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export default PageUserProfile;
