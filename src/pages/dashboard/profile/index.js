import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import * as AuthStore from "store/slice/authentication";
import { useProfileForm } from "./hooks/profile-form";
import { useSubmitProfile } from "./hooks/submit-profile";
import { usePasswordForm } from "./hooks/password-form";
import { useSubmitPassword } from "./hooks/submit-password";

import {
  AlertSubmitError,
  LoadingScreen,
  Button,
  ButtonBlue,
  ButtonOutlineBlue,
} from "components/ma";
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
      <AlertSuccess
        isSuccess={isSuccess}
        buttonLabel="Kembali"
        description="Profil Anda berhasil diperbarui"
      />
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

      <CardSheet>
        <div>
          <CardTitle>Keamanan Akun</CardTitle>
        </div>

        <div>
          <PasswordEditor />
        </div>
      </CardSheet>
    </ContentLayoutWrapper>
  );
}

function PasswordEditor() {
  const [isOpen, setOpen] = React.useState(false);

  if (!isOpen) {
    return (
      <PWEditorDisplay>
        <FieldInputText label="Kata Sandi" type="password" value="password" readOnly disabled />
        <div>
          <ButtonOutlineBlue onClick={() => setOpen(true)}>Ubah Kata Sandi</ButtonOutlineBlue>
        </div>
      </PWEditorDisplay>
    );
  }

  return <PasswordEditorForm onClose={() => setOpen(false)} />;
}

function PasswordEditorForm({ onClose }) {
  const { values, setValue, isValid } = usePasswordForm();
  const {
    submit: submitPassword,
    isLoading,
    isError,
    errors,
    isSuccess,
  } = useSubmitPassword(values);

  return (
    <PWEditorForm>
      <LoadingScreen loading={isLoading} />
      <AlertSubmitError isError={isError} errors={errors} />
      <AlertSuccess
        isSuccess={isSuccess}
        buttonLabel="Kembali"
        description="Password Anda berhasil diperbarui"
        onConfirm={onClose}
      />
      <div>
        <CardTitle>Ubah Sandi</CardTitle>
        <p>Masukan kata sandi Anda yang baru. Kata sandi harus berbeda dengan kata sandi lama.</p>
      </div>

      <VerticalFields>
        <ExistingPasswordFieldGroup>
          <FieldInputText
            label="Kata Sandi Saat Ini"
            type="password"
            placeholder="Masukkan kata sandi saat ini"
            value={values.password_old}
            onChange={(value) => setValue("password_old", value)}
          />

          <div>
            <ButtonOutlineBlue as={Link} to="/forgot-password" tabIndex="-1">
              Lupa Kata Sandi
            </ButtonOutlineBlue>
          </div>
        </ExistingPasswordFieldGroup>

        <FieldInputText
          label="Kata Sandi Baru"
          type="password"
          placeholder="Masukkan kata sandi baru"
          value={values.password}
          onChange={(value) => setValue("password", value)}
        />
        <FieldInputText
          label="Konfirmasi Kata Sandi"
          type="password"
          placeholder="Masukkan ulang kata sandi baru di atas"
          value={values.password_confirmation}
          onChange={(value) => setValue("password_confirmation", value)}
        />
      </VerticalFields>

      <BottomAction>
        <Button onClick={onClose}>Batal</Button>
        <ButtonBlue disabled={!isValid} onClick={submitPassword}>
          Simpan
        </ButtonBlue>
      </BottomAction>
    </PWEditorForm>
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

const PWEditorDisplay = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

const PWEditorForm = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const VerticalFields = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const ExistingPasswordFieldGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
  }
`;

export default PageUserProfile;
