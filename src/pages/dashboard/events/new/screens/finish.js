import * as React from "react";
import styled from "styled-components";

import { ButtonBlue } from "components/ma";

import imageIllustration from "assets/images/events/create-event-event-ready.png";

function ScreenFinish({ eventDetail }) {
  return (
    <CardSheet>
      <Illustration />
      <CenteredContent>
        <VerticalSpacedBox>
          <div>
            <h2>Pengaturan Pertandingan berhasil disimpan</h2>
            <p>
              Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage Event. Buat
              lebih banyak event di Dashboard EO.
            </p>
          </div>

          <HorizontalSpacedButtonGroups>
            <ButtonBlue onClick={() => alert(`Hit API status publikasi... ID: ${eventDetail?.id}`)}>
              Publikasi
            </ButtonBlue>
          </HorizontalSpacedButtonGroups>
        </VerticalSpacedBox>
      </CenteredContent>
    </CardSheet>
  );
}

const CardSheet = styled.div`
  margin-bottom: 24px;
  padding: 35px;
  border: 0 solid #f6f6f6;
  border-radius: 8px;
  background-color: #ffffff;
  background-clip: border-box;
  box-shadow: 0 0.75rem 1.5rem rgb(18 38 63 / 3%);
`;

const VerticalSpacedBox = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`;

const CenteredContent = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const Illustration = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  min-height: 328px;
  background-image: url(${imageIllustration});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const HorizontalSpacedButtonGroups = styled.div`
  > * + * {
    margin-left: 0.5rem;
  }
`;

export { ScreenFinish };
