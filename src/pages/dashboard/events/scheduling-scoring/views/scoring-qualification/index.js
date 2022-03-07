import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useWizardView } from "utils/hooks/wizard-view";
import { useEventDetail } from "./hooks/event-detail";
import { useCategoriesByGender } from "./hooks/event-categories-by-gender";
import { useParticipantScorings } from "./hooks/participant-scorings";
import { useScoresheetDownload } from "./hooks/scoresheet-download";

import { ButtonOutlineBlue } from "components/ma";
import { FolderTabs, FolderPanel, TabItem, TabsContext } from "../../components";
import { FieldSelectCategory } from "./field-select-category";
import { ScoringEditor } from "./scoring-editor";

import IconUser from "components/ma/icons/mono/user";
import IconDownload from "components/ma/icons/mono/download";

import { makeOptionsFromData, shouldDisableEditing } from "./utils";

const tabsList = [
  { step: 1, label: "Individu Putra" },
  { step: 2, label: "Individu Putri" },
];

function StepScoringQualification() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);
  const { data: eventDetail } = useEventDetail(eventId);
  const { data: categories, groupNames: teamCategories } = useCategoriesByGender(eventId);
  const { currentStep: currentTab, goToStep: switchToTab } = useWizardView(tabsList);

  const currentTeamCategory = teamCategories[currentTab - 1];
  const optionsCategoryDetail = makeOptionsFromData(categories?.[currentTeamCategory]);

  const [selectedCategory, dispatchSelectedCategory] = React.useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  );

  React.useEffect(() => {
    if (!optionsCategoryDetail?.length) {
      return;
    }
    if (!selectedCategory[currentTeamCategory]) {
      dispatchSelectedCategory({ [currentTeamCategory]: optionsCategoryDetail[0] });
    }
  }, [currentTeamCategory]);

  const {
    data: scorings,
    state: scoringsState,
    refetch: refetchScorings,
    reset: resetScorings,
  } = useParticipantScorings(selectedCategory[currentTeamCategory]?.value);

  const isLoadingScorings = scoringsState.status === "loading";
  const isInitScorings = !scorings && isLoadingScorings;
  const isErrorScorings = scoringsState.status === "error";

  React.useEffect(() => {
    if (selectedCategory[currentTeamCategory]) {
      return;
    }
    resetScorings([]);
  }, [selectedCategory[currentTeamCategory]]);

  const handleSuccessSave = () => refetchScorings();

  const { handleScoresheetDownload, status: downloadStatus } = useScoresheetDownload();
  const isLoadingPreparingScoresheet = downloadStatus === "loading";
  const editIsDisabled = shouldDisableEditing(eventDetail?.publicInformation.eventEnd);

  return (
    <div>
      <TabsContext.Provider value={{ currentTab, switchToTab }}>
        <FolderTabs>
          {teamCategories?.map((team, index) => {
            return (
              <TabItem key={index + 1} tab={index + 1} icon={<IconUser size="16" />}>
                {team === "individu male"
                  ? "Individu Putra"
                  : team === "individu female"
                  ? "Individu Putri"
                  : ""}
              </TabItem>
            );
          })}
        </FolderTabs>

        <FolderPanel>
          <TopToolbar>
            <div>
              {categories ? (
                <FieldSelectCategory
                  key={currentTeamCategory}
                  placeholder={
                    optionsCategoryDetail?.length
                      ? "Kategori lomba"
                      : "Belum ada kategori di kelompok ini"
                  }
                  options={optionsCategoryDetail}
                  value={selectedCategory[currentTeamCategory]}
                  onChange={(option) => dispatchSelectedCategory({ [currentTeamCategory]: option })}
                  disabled={!optionsCategoryDetail?.length}
                >
                  Kategori
                </FieldSelectCategory>
              ) : (
                <FieldSelectCategory placeholder="Memuat kategori lomba...">
                  Kategori
                </FieldSelectCategory>
              )}
            </div>

            <SpacedButtonsGroup>
              <ButtonDownload
                onClick={() => {
                  handleScoresheetDownload(selectedCategory[currentTeamCategory]?.value);
                }}
              >
                <span>
                  <IconDownload size="16" />
                </span>
                <span>{isLoadingPreparingScoresheet ? "Menyiapkan data..." : "Scoresheet"}</span>
              </ButtonDownload>
            </SpacedButtonsGroup>
          </TopToolbar>

          {isInitScorings ? (
            <div>Sedang memuat data skoring...</div>
          ) : scorings?.length > 0 ? (
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
                {scorings.map((scoring) => {
                  const code = ["1", scoring.member.id, "1"].join("-");

                  const computeTargetNumber = () => {
                    return (
                      scoring.member.budRestNumber &&
                      scoring.member.targetFace &&
                      `${scoring.member.budRestNumber}${scoring.member.targetFace}`
                    );
                  };

                  return (
                    <tr key={scoring.member.id}>
                      <td>
                        {scoring.member.participantNumber || (
                          <React.Fragment>&ndash;</React.Fragment>
                        )}
                      </td>
                      <td>{computeTargetNumber() || <React.Fragment>&ndash;</React.Fragment>}</td>
                      <td>{scoring.member.name}</td>
                      <td>{scoring.member.clubName}</td>
                      <td>{scoring.total}</td>
                      <td>{scoring.totalX}</td>
                      <td>{scoring.totalXPlusTen}</td>

                      <TDTableButtons>
                        <ScoringEditor
                          rowItem={scoring}
                          code={code}
                          targetNumber={computeTargetNumber()}
                          onSuccess={handleSuccessSave}
                          disabled={editIsDisabled}
                        />
                      </TDTableButtons>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : scorings?.length === 0 ? (
            <div>Belum ada data skoring.</div>
          ) : isErrorScorings ? (
            <div>Error mengambil data skoring kualifikasi</div>
          ) : (
            <div>
              Ada error yang tidak diketahui. Silakan coba lagi beberapa saat lagi, atau hubungi
              teknikal support.
            </div>
          )}
        </FolderPanel>
      </TabsContext.Provider>
    </div>
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

const SpacedButtonsGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: flex-start;
`;

const ButtonDownload = styled(ButtonOutlineBlue)`
  > span:first-of-type {
    margin-right: 0.5rem;
  }
`;

const THMember = styled.th`
  text-transform: uppercase;
`;

const TDTableButtons = styled.td`
  width: 1.875rem;
`;

export { StepScoringQualification };
