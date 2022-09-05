import * as React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEventDetail } from "./hooks/event-detail";
import { useCategoryDetails } from "./hooks/category-details";
import { useCategoriesWithFilters } from "./hooks/category-filters";
import { useSubmitEliminationCount } from "./hooks/submit-elimination-count";
import { useSubmitEliminationConfig } from "./hooks/submit-elimination-config";
import { useScoresheetDownload } from "./hooks/scoresheet-download";

import Select from "react-select";
import { SpinnerDotBlock, ButtonBlue, LoadingScreen, AlertSubmitError } from "components/ma";
import { SubNavbar } from "../components/submenus-matches";
import { ContentLayoutWrapper } from "./components/content-layout-wrapper";
import { ScoringTable } from "./components/scoring-table";
import { ScoringTableTeam } from "./components/scoring-table-team";
import { SearchBox } from "./components/search-box";
import { toast } from "./components/processing-toast";
import { ButtonDownloadScoresheet } from "./components/button-download-scoresheet";
import { ButtonConfirmPrompt } from "./components/button-confirm-prompt";
import { ButtonCancelBracket } from "./components/button-cancel-bracket";
import { ButtonShowBracket } from "./components/button-show-bracket";

import IconCheck from "components/ma/icons/fill/check";

import classnames from "classnames";

const optionsParticipantsCount = [
  { value: 4, label: "4 Besar" },
  { value: 8, label: "8 Besar" },
  { value: 16, label: "16 Besar" },
  { value: 32, label: "32 Besar" },
];

function _getSelectedFromValue(countValue) {
  if (!countValue) {
    return null;
  }
  return optionsParticipantsCount.find((option) => option.value === countValue);
}

function PageEventScoringQualification() {
  const { event_id } = useParams();
  const eventId = parseInt(event_id);

  const {
    data: eventDetail,
    isInitialLoading: isInitialLoadingEventDetail,
    errors: errorsEventDetail,
  } = useEventDetail(eventId);

  const isSelectionType = eventDetail?.eventCompetition === "Selection";

  const {
    data: categoryDetails,
    errors: errorsCategoryDetail,
    isSettled: isSettledCategories,
    fetchCategoryDetails,
  } = useCategoryDetails(eventId);

  const {
    activeCategoryDetail,
    activeCompetitionCategory,
    optionsCompetitionCategory,
    optionsAgeCategory,
    optionsGenderCategory,
    selectOptionCompetitionCategory,
    selectOptionAgeCategory,
    selectOptionGenderCategory,
  } = useCategoriesWithFilters(categoryDetails);

  const [inputSearchQuery, setInputSearchQuery] = React.useState("");
  const [localCountNumber, setLocalCountNumber] = React.useState(null);
  const countNumberInputRef = React.useRef(null);

  const {
    submit: updateEliminationMemberCount,
    isLoading: isLoadingSubmitCount,
    isError: isErrorSubmitCount,
    errors: errorsSubmitCount,
  } = useSubmitEliminationCount(activeCategoryDetail?.categoryDetailId);

  const {
    submit: setElimination,
    isLoading: isLoadingSubmitElimination,
    isError: isErrorSubmitElimination,
    errors: errorsSubmitElimination,
  } = useSubmitEliminationConfig(activeCategoryDetail?.categoryDetailId);

  const { download } = useScoresheetDownload(activeCategoryDetail?.categoryDetailId);

  const resetOnChangeCategory = () => {
    setLocalCountNumber(null);
    setInputSearchQuery("");
  };

  const errorFetchingData =
    (!categoryDetails && errorsCategoryDetail) || (!eventDetail && errorsEventDetail);

  if (errorFetchingData) {
    return (
      <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
        <ViewWrapper>
          <p>
            Terdapat kendala dalam mengambil data. Lihat detail berikut untuk melihat informasi
            teknis lebih lanjut:
          </p>

          <pre>{JSON.stringify(errorsCategoryDetail)}</pre>
        </ViewWrapper>
      </ContentLayoutWrapper>
    );
  }

  if (!isSettledCategories || isInitialLoadingEventDetail) {
    return (
      <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
        <SpinnerDotBlock />
      </ContentLayoutWrapper>
    );
  }

  return (
    <ContentLayoutWrapper pageTitle="Skoring Kualifikasi" navbar={<SubNavbar />}>
      <LoadingScreen loading={isLoadingSubmitCount || isLoadingSubmitElimination} />
      <AlertSubmitError isError={isErrorSubmitCount} errors={errorsSubmitCount} />
      <AlertSubmitError isError={isErrorSubmitElimination} errors={errorsSubmitElimination} />

      <TabBar>
        <TabButtonList>
          {optionsCompetitionCategory.map((option) => (
            <li key={option.competitionCategory}>
              <TabButton
                className={classnames({ "tab-active": option.isActive })}
                onClick={() => {
                  resetOnChangeCategory();
                  selectOptionCompetitionCategory(option.competitionCategory);
                }}
              >
                {option.competitionCategory}
              </TabButton>
            </li>
          ))}
        </TabButtonList>
      </TabBar>

      <ViewWrapper>
        <ToolbarTop>
          <FilterBars key={activeCompetitionCategory}>
            <CategoryFilter>
              <FilterLabel>Kelas:</FilterLabel>
              <FilterList>
                {optionsAgeCategory?.length > 0 ? (
                  optionsAgeCategory.map((option) => (
                    <li key={option.ageCategory}>
                      <FilterItemButton
                        className={classnames({ "filter-item-active": option.isActive })}
                        onClick={() => {
                          resetOnChangeCategory();
                          selectOptionAgeCategory(option.ageCategory);
                        }}
                      >
                        {option.ageCategory}
                      </FilterItemButton>
                    </li>
                  ))
                ) : (
                  <li>Tidak tersedia filter kelas</li>
                )}
              </FilterList>
            </CategoryFilter>

            <CategoryFilter>
              <FilterLabel>Jenis Regu:</FilterLabel>
              <FilterList>
                {optionsGenderCategory?.length > 0 ? (
                  optionsGenderCategory.map((option) => (
                    <li key={option.genderCategory}>
                      <FilterItemButton
                        className={classnames({ "filter-item-active": option.isActive })}
                        onClick={() => {
                          resetOnChangeCategory();
                          selectOptionGenderCategory(option.genderCategory);
                        }}
                      >
                        {option.genderCategoryLabel}
                      </FilterItemButton>
                    </li>
                  ))
                ) : (
                  <li>Tidak tersedia filter jenis regu</li>
                )}
              </FilterList>
            </CategoryFilter>
          </FilterBars>

          <ToolbarRight key={activeCategoryDetail?.categoryDetailId}>
            <HorizontalSpaced>
              <SelectEliminationCounts>
                <label htmlFor="elimination-members-count">Babak Eliminasi</label>
                <Select
                  ref={countNumberInputRef}
                  openMenuOnFocus
                  placeholder="Pilih jumlah"
                  options={optionsParticipantsCount}
                  value={_getSelectedFromValue(
                    localCountNumber || activeCategoryDetail?.defaultEliminationCount
                  )}
                  onChange={(option) => {
                    setLocalCountNumber(option.value);
                    updateEliminationMemberCount(option.value, {
                      onSuccess() {
                        fetchCategoryDetails();
                      },
                      onError() {
                        setLocalCountNumber(activeCategoryDetail?.defaultEliminationCount);
                      },
                    });
                  }}
                  isDisabled={Boolean(activeCategoryDetail?.eliminationLock)}
                />

                {Boolean(activeCategoryDetail?.defaultEliminationCount) && (
                  <AppliedIconWrapper>
                    <IconCheck size="20" />
                  </AppliedIconWrapper>
                )}
              </SelectEliminationCounts>

              <PushBottom>
                <SearchBox
                  placeholder="Cari peserta"
                  value={inputSearchQuery}
                  onChange={(ev) => setInputSearchQuery(ev.target.value)}
                />
              </PushBottom>

              <PushBottom>
                <ButtonShowBracket
                  categoryDetailId={activeCategoryDetail?.categoryDetailId}
                  eliminationMemberCount={activeCategoryDetail?.defaultEliminationCount}
                />
              </PushBottom>
            </HorizontalSpaced>

            <HorizontalSpaced>
              <ButtonDownloadScoresheet
                sessionCount={activeCategoryDetail?.sessionCount}
                disabled={activeCategoryDetail?.isTeam}
                onDownload={(sessionNumber) => {
                  toast.loading("Sedang menyiapkan dokumen scoresheet...");
                  const options = {
                    onSuccess: () => {
                      toast.dismiss();
                    },
                  };
                  download(sessionNumber, options);
                }}
              />

              {activeCategoryDetail?.eliminationLock ? (
                <ButtonCancelBracket
                  categoryId={activeCategoryDetail?.categoryDetailId}
                  onSuccess={fetchCategoryDetails}
                />
              ) : !localCountNumber ? (
                <ButtonBlue onClick={() => countNumberInputRef.current?.focus?.()}>
                  Lanjut ke Eliminasi
                </ButtonBlue>
              ) : (
                <ButtonConfirmPrompt
                  title="Tentukan bagan eliminasi"
                  onConfirm={() => {
                    setElimination(localCountNumber, {
                      onSuccess: () => {
                        toast.success("Bagan eliminasi selesai");
                        fetchCategoryDetails();
                      },
                    });
                  }}
                />
              )}
            </HorizontalSpaced>
          </ToolbarRight>
        </ToolbarTop>

        {activeCategoryDetail &&
          (activeCategoryDetail.isTeam ? (
            <ScoringTableTeam
              key={_makeTableKeyByCategory(activeCategoryDetail)}
              categoryDetailId={activeCategoryDetail?.categoryDetailId}
              isLocked={Boolean(!activeCategoryDetail || activeCategoryDetail?.eliminationLock)}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategoryDetail?.defaultEliminationCount}
            />
          ) : (
            <ScoringTable
              key={_makeTableKeyByCategory(activeCategoryDetail)}
              categoryDetailId={activeCategoryDetail?.categoryDetailId}
              isSelectionType={isSelectionType}
              isLocked={Boolean(!activeCategoryDetail || activeCategoryDetail?.eliminationLock)}
              searchName={inputSearchQuery}
              onChangeParticipantPresence={resetOnChangeCategory}
              eliminationParticipantsCount={activeCategoryDetail?.defaultEliminationCount}
            />
          ))}
      </ViewWrapper>
    </ContentLayoutWrapper>
  );
}

/* =============================== */
// styles

const ViewWrapper = styled.div`
  padding: 1.875rem;
  background-color: #ffffff;

  > * + * {
    margin-top: 1.875rem;
  }
`;

const TabBar = styled.div`
  margin-bottom: 0.25rem;
  background-color: #ffffff;
`;

const TabButtonList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;

  > * {
    flex-grow: 1;
  }
`;

const TabButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #ffffff;
  color: var(--ma-blue);
  font-weight: 500;

  position: relative;

  &::after {
    content: " ";
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 5px;

    transform: scaleX(0);
    transition: all 0.2s;
  }

  &:hover {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }

  &.tab-active {
    &::after {
      background-color: var(--ma-yellow);
      transform: scaleX(1);
    }
  }
`;

const ToolbarTop = styled.div`
  display: flex;
  gap: 1.5rem 2.25rem;

  > *:nth-child(1) {
    flex-grow: 1;
  }

  > *:nth-child(2) {
    flex-shrink: 0;
    margin-top: auto;
  }
`;

const FilterBars = styled.div`
  > * + * {
    margin-top: 0.5rem;
  }
`;

const ToolbarRight = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const SelectEliminationCounts = styled.div`
  position: relative;
  min-width: 7.5rem;
`;

const AppliedIconWrapper = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: -1.5rem;
`;

const HorizontalSpaced = styled.div`
  display: flex;
  gap: 0.5rem;

  > * {
    flex-grow: 1;
  }
`;

const PushBottom = styled.div`
  align-self: flex-end;
`;

const CategoryFilter = styled.div`
  display: flex;
  align-items: center;

  > *:nth-child(1) {
    flex-shrink: 0;
    min-width: 6.25rem;
  }

  > *:nth-child(2) {
    flex-grow: 1;
  }
`;

const FilterLabel = styled.div`
  color: var(--ma-txt-black);
  font-weight: 600;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterItemButton = styled.button`
  transition: all 0.15s;

  &,
  &:active,
  &:focus,
  &:focus-visible {
    padding: 0.25rem 0.5rem;
    border: solid 1px var(--ma-blue-400);
    border-radius: 0.5rem;
    background-color: transparent;

    color: var(--ma-blue-400);
    font-weight: 600;

    &.filter-item-active {
      background-color: var(--ma-primary-blue-50);
      border-color: var(--ma-blue);
      box-shadow: 0 0 0 1px var(--ma-blue);
      color: var(--ma-blue);
    }
  }

  &:hover {
    background-color: var(--ma-primary-blue-50);
  }
`;

/* ================================ */
// utils

function _makeTableKeyByCategory(activeCategoryDetail) {
  if (!activeCategoryDetail) {
    return "default-key";
  }
  return activeCategoryDetail.categoryDetailId;
}

export default PageEventScoringQualification;
