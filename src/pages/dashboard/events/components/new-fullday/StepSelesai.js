import * as React from "react";
import styled from "styled-components";

import { Button, ButtonBlue } from "components/ma";
import FormSheet from "../FormSheet";

// eslint-disable-next-line no-unused-vars
function StepSelesai({ eventData }) {
  return (
    <FormSheet>
      <div>[TBD: gambar ilustrasi]</div>

      <h2>Pengaturan Pertandingan berhasil disimpan</h2>

      <p>
        Atur pertandingan, jadwal kualifikasi &amp; semua tentang event di Manage Event. Buat lebih
        banyak event di Dashboard EO.
      </p>

      <SpacedButtonGroup>
        <Button corner="8">Pratinjau</Button>
        <ButtonBlue corner="8">Publikasi</ButtonBlue>
      </SpacedButtonGroup>
    </FormSheet>
  );
}

const SpacedButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export { StepSelesai };
