import * as React from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useWizardView } from "utils/hooks/wizard-view";

import { ButtonOutlineBlue } from "components/ma";
import { FolderTabs, TabItem, TabsContext, FolderPanel } from "../../components";

import IconIndividu from "components/ma/icons/mono/user";
import IconTeam from "components/ma/icons/mono/users";

const tabsList = [
  { step: 1, label: "Individu" },
  { step: 2, label: "Beregu" },
];

function StepManageElimination() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { currentStep: currentTab, goToStep: switchToTab } = useWizardView(tabsList);

  return (
    <div>
      <TabsContext.Provider value={{ currentTab, switchToTab }}>
        <FolderTabs>
          <TabItem tab="1" icon={<IconIndividu size="16" />}>
            Individu
          </TabItem>

          <TabItem tab="2" icon={<IconTeam size="16" />}>
            Beregu
          </TabItem>
        </FolderTabs>
      </TabsContext.Provider>

      <FolderPanel>
        <CategoryGroupsList>
          <CategoryGroup>
            <GroupHeader>
              <HeaderTitle>
                <div>Kategori</div>
                <h4>{"Traditional Bow"}</h4>
              </HeaderTitle>

              <HeaderActions></HeaderActions>
            </GroupHeader>

            <table className="table table-responsive">
              <thead>
                <tr>
                  <THCateg>Kelas</THCateg>
                  <THCateg>Jenis Regu</THCateg>
                  <THCateg>Jarak</THCateg>
                  <THCateg>Jumlah Babak</THCateg>
                  <THCateg>Peserta</THCateg>
                  <THCateg>Tanggal Eliminasi</THCateg>
                  <THCateg>Status</THCateg>
                  <THCateg>&nbsp;</THCateg>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <TDCateg>{"Umum"}</TDCateg>
                  <TDCateg style={{ width: 135 }}>{"Individu Putra"}</TDCateg>
                  <TDCateg>{"50m"}</TDCateg>
                  <TDCateg>&ndash;</TDCateg>
                  <TDCateg>{28}</TDCateg>
                  <TDCateg>{"12/02/2022"}</TDCateg>
                  <TDCateg>{"Belum Diatur"}</TDCateg>
                  <TDCateg>
                    <ButtonOutlineBlue
                      as={Link}
                      to={`/dashboard/event/${eventId}/scheduling-scoring/elimination-setting`}
                    >
                      Atur
                    </ButtonOutlineBlue>
                  </TDCateg>
                </tr>
                <tr>
                  <TDCateg>{"Umum"}</TDCateg>
                  <TDCateg>{"Beregu Campuran"}</TDCateg>
                  <TDCateg>{"30m, 40m, 50m"}</TDCateg>
                  <TDCateg>&ndash;</TDCateg>
                  <TDCateg>{28}</TDCateg>
                  <TDCateg>{"12/02/2022"}</TDCateg>
                  <TDCateg>{"Belum Diatur"}</TDCateg>
                  <TDCateg>
                    <ButtonOutlineBlue
                      as={Link}
                      to={`/dashboard/event/${eventId}/scheduling-scoring/elimination-setting`}
                    >
                      Atur
                    </ButtonOutlineBlue>
                  </TDCateg>
                </tr>
              </tbody>
            </table>
          </CategoryGroup>
        </CategoryGroupsList>
      </FolderPanel>
    </div>
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

export { StepManageElimination };
