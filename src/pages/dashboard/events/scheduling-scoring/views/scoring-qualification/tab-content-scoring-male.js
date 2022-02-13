import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue } from "components/ma";
import { FolderPanel, FieldInputDateSmall } from "../../components";
import { ScoringEditor } from "./scoring-editor";
import { FieldSelectCategory } from "./field-select-category";

import IconDownload from "components/ma/icons/mono/download";

function useMembers() {
  const data = [1, 2, 3];
  return { data };
}

function TabContentScoringMale() {
  const { data: members } = useMembers();

  return (
    <FolderPanel>
      <TopToolbar>
        <FieldInputDateSmall>Tanggal Kualifikasi</FieldInputDateSmall>
        <FieldSelectCategory placeholder="Kategori">Kategori</FieldSelectCategory>
      </TopToolbar>

      <table className="table table-responsive">
        <thead>
          <tr>
            <THMember>No. Peserta</THMember>
            <THMember>Bantalan</THMember>
            <THMember>Nama</THMember>
            <THMember>Klub</THMember>
            <THMember>Total</THMember>
            <THMember>X</THMember>
            <THMember>X+10</THMember>
            <THMember>&nbsp;</THMember>
          </tr>
        </thead>

        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td>X-XX</td>
              <td>1A</td>
              <td>Nama</td>
              <td>Kelelep</td>
              <td>0</td>
              <td>&ndash;</td>
              <td>&ndash;</td>
              <TDTableButtons>
                <ScoringEditor id={index + 1} data={member} />
                <TableRowButton title="Unduh Scoresheet">
                  <IconDownload size="18" />
                </TableRowButton>
              </TDTableButtons>
            </tr>
          ))}
        </tbody>
      </table>
    </FolderPanel>
  );
}

const TopToolbar = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
`;

const THMember = styled.th`
  text-transform: uppercase;
`;

const TDTableButtons = styled.td`
  width: 5.875rem;
`;

const TableRowButton = styled(ButtonOutlineBlue)`
  &,
  &:focus {
    padding: 0.25rem 0.45rem;
    border-color: transparent;
  }

  &:hover {
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    color: var(--ma-blue);
  }

  &:focus {
    box-shadow: 0 0 0 1px rgb(38, 132, 255);
  }
`;

export { TabContentScoringMale };
