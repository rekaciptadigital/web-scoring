import * as React from "react";
import styled from "styled-components";

import { FieldSelectCategory } from "./field-select-category";

import { FolderHeader } from "./styles";

function StepManageElimination() {
  return (
    <div>
      <FolderHeader>
        <div>
          <h3>Atur Eliminasi</h3>
          <div>need copywriting, please...</div>
        </div>
      </FolderHeader>

      <div>
        <TopToolbar>
          <FieldSelectCategory>Tanggal Kualifikasi</FieldSelectCategory>

          <FieldSelectCategory placeholder="Divisi">Kategori</FieldSelectCategory>

          <FieldSelectCategory placeholder="Kategori">Kategori</FieldSelectCategory>

          <div>
            <button>tbd</button>
          </div>
        </TopToolbar>
      </div>
    </div>
  );
}

const TopToolbar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;
`;

export { StepManageElimination };
