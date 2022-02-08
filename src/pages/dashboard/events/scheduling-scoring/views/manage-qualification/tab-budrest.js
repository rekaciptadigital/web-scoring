import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventBudRests, useBudRestsForm } from "./hooks/bud-rests";

import { ButtonBlue, ButtonOutlineBlue } from "components/ma";
import {
  FieldInputTextSmall,
  FieldSelectBudRest,
  FolderPanel,
  NoticeBarInfo,
} from "../../components";

import { FolderHeader, FolderHeaderActions } from "./styles";

function TabBudRest() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const { data: eventBudRests, groupNames } = useEventBudRests(eventId);
  const { data: form, dispatch: dispatchForm } = useBudRestsForm(eventBudRests, groupNames);

  const shouldAllowEdit = true;

  return (
    <React.Fragment>
      <FolderPanel>
        <FolderHeader>
          <div>
            <h3>Atur Bantalan Kualifikasi</h3>
            <div>Pengaturan bantalan pada kualifikasi pertandingan</div>
          </div>

          <FolderHeaderActions>
            <ButtonBlue disabled={!shouldAllowEdit}>Simpan</ButtonBlue>
          </FolderHeaderActions>
        </FolderHeader>

        {!shouldAllowEdit && (
          <NoticeBarInfo>Pengaturan aktif apabila pendaftaran lomba telah ditutup</NoticeBarInfo>
        )}
      </FolderPanel>

      <FolderPanel style={{ paddingTop: 3 }}>
        <CategoryGroupsList>
          {Boolean(groupNames?.length) &&
            groupNames.map((groupName) => (
              <CategoryGroup key={groupName}>
                <GroupHeader>
                  <HeaderTitle>
                    <div>Kategori</div>
                    <h4>{groupName}</h4>
                  </HeaderTitle>

                  <HeaderMiddleControl>
                    <FieldTargetFace>
                      <FieldSelectBudRest
                        disabled={!shouldAllowEdit}
                        value={form?.[groupName]?.common.targetFace}
                        onChange={(option) => {
                          dispatchForm({
                            type: "CHANGE_COMMON",
                            groupName,
                            payload: option,
                          });
                        }}
                      >
                        Target Face
                      </FieldSelectBudRest>
                    </FieldTargetFace>
                  </HeaderMiddleControl>

                  <HeaderActions>
                    {shouldAllowEdit && <ButtonOutlineBlue>Simpan</ButtonOutlineBlue>}
                  </HeaderActions>
                </GroupHeader>

                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <THCateg>Kelas</THCateg>
                      <THCateg>Jenis Regu</THCateg>
                      <THCateg>Jarak</THCateg>
                      <THCateg>Peserta</THCateg>
                      <THCateg>Mulai</THCateg>
                      <THCateg>Akhir</THCateg>
                      <THCateg>Target Face</THCateg>
                    </tr>
                  </thead>

                  <tbody>
                    {eventBudRests[groupName]?.map((detail) => {
                      const budRest = form?.[groupName][detail.categoryDetailId] || {};
                      return (
                        <tr key={detail.categoryDetailId}>
                          <TDCateg>{detail.age}</TDCateg>
                          <TDCateg>{detail.team}</TDCateg>
                          <TDCateg>{detail.distance}</TDCateg>
                          <TDCateg>{detail.totalParticipants}</TDCateg>

                          <TDInput>
                            <FieldInputTextSmall
                              placeholder="No. bantalan"
                              disabled={!shouldAllowEdit}
                              value={budRest.start}
                            />
                          </TDInput>

                          <TDInput>
                            <FieldInputTextSmall
                              placeholder="No. bantalan"
                              disabled={!shouldAllowEdit}
                              value={budRest.end}
                            />
                          </TDInput>

                          <TDInput>
                            <FieldSelectBudRest
                              disabled={!shouldAllowEdit}
                              value={budRest.targetFace}
                            />
                          </TDInput>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CategoryGroup>
            ))}
        </CategoryGroupsList>
      </FolderPanel>
    </React.Fragment>
  );
}

const CategoryGroupsList = styled.div`
  > * + * {
    margin-top: 1.25rem;
  }
`;

const CategoryGroup = styled.div`
  padding: 1.25rem;
  border: solid 1px var(--ma-gray-100);
  border-radius: 0.5rem;
`;

const GroupHeader = styled.div`
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
`;

const HeaderTitle = styled.div`
  flex: 1 0 5rem;

  > * + * {
    margin-top: 0.5rem;
  }
`;

const HeaderMiddleControl = styled.div`
  flex-grow: 5;
`;

const FieldTargetFace = styled.div`
  width: 120px;
`;

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
`;

const THCateg = styled.th`
  text-transform: uppercase;
`;

const TDCateg = styled.td`
  text-transform: capitalize;
`;

const TDInput = styled.td`
  width: 7.5rem;
`;

export { TabBudRest };
