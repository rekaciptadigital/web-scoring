import * as React from "react";
import styled from "styled-components";

import { ButtonOutlineBlue } from "components/ma";
import { FolderPanel } from "../../components";
import { ScoringEditor } from "./scoring-editor";
import { FieldSelectCategory } from "./field-select-category";

import IconDownload from "components/ma/icons/mono/download";

function useMembers() {
  const data = [1, 2, 3, 4, 5];
  return { data };
}

function TabContentScoringFemale() {
  const { data: members } = useMembers();

  return (
    <FolderPanel>
      <TopToolbar>
        <div>
          <FieldSelectCategory
            placeholder="Kategori"
            value={{ value: 1, label: "Default ke - Kategori - Urutan Pertama" }}
          >
            Kategori
          </FieldSelectCategory>
        </div>

        <SpacedButtonsGroup>
          <ButtonDownload>
            <span>
              <IconDownload size="16" />
            </span>
            <span>Scoresheet</span>
          </ButtonDownload>
        </SpacedButtonsGroup>
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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;

  > *:first-child {
    flex: 1 1 0%;

    > * {
      max-width: 18.75rem;
    }
  }
`;

const ButtonDownload = styled(ButtonOutlineBlue)`
  > span:first-of-type {
    margin-right: 0.5rem;
  }
`;

const SpacedButtonsGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
`;

const THMember = styled.th`
  text-transform: uppercase;
`;

const TDTableButtons = styled.td`
  width: 1.875rem;
`;

export { TabContentScoringFemale };
