import * as React from "react";
import styled from "styled-components";

import { ButtonBlue } from "components/ma";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { Breadcrumb } from "./components/breadcrumb";
import { AvatarUploader } from "./components/avatar-uploader";
import { ProcessingToast } from "./components/processing-toast";

function PageUserProfile() {
  return (
    <ContentLayoutWrapper pageTitle="Profil Pengguna">
      <ProcessingToast />
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
            <div>form</div>

            <BottomAction>
              <ButtonBlue flexible>Simpan</ButtonBlue>
            </BottomAction>
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
  gap: 2.5rem;

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

const BottomAction = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export default PageUserProfile;
